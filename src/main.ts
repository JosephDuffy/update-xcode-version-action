import * as core from "@actions/core"
import * as path from "path"
import * as github from "@actions/github"
import { exec } from "@actions/exec"
import XcutilsVersionResolver from "./XcutilsVersionResolver"
import applyXcodeVersionsFile from "./applyXcodeVersionsFile"

export async function run(): Promise<void> {
  try {
    const workspacePath = process.env["GITHUB_WORKSPACE"]

    if (workspacePath === undefined) {
      throw new Error("GITHUB_WORKSPACE environment variable not available")
    }

    const xcodeVersionsFile = core.getInput("xcode-versions-file", {
      required: true,
    })

    core.debug(`xcode-versions-file input: ${xcodeVersionsFile}`)

    const xcodeSearchPathInput = core.getInput("xcode-search-path")

    core.debug(
      `xcode-search-path input: ${
        xcodeSearchPathInput.length > 0 ? xcodeSearchPathInput : "not provided"
      }`
    )

    const xcodeSearchPath = path.resolve(
      workspacePath,
      xcodeSearchPathInput.length > 0 ? xcodeSearchPathInput : "/Applications"
    )

    core.debug(
      `Resolved Xcode search path "${xcodeSearchPathInput}" against workspace "${workspacePath}": "${xcodeSearchPath}`
    )

    // The path to the file that describes which workflow and Xcode projects files to update
    const xcodeVersionsFilePath = path.resolve(workspacePath, xcodeVersionsFile)
    const xcutilsVersionResolver = new XcutilsVersionResolver(xcodeSearchPath)
    await applyXcodeVersionsFile(xcodeVersionsFilePath, xcutilsVersionResolver)

    const githubToken = core.getInput("github-token")

    if (githubToken !== "") {
      core.info("Have a GitHub token; creating pull request")
      await exec("git", [
        "checkout",
        "-b",
        "update-xcode-version-action/update-xcode-versions",
      ])
      core.info("Created branch")
      await exec("git", ["add", "."])
      core.info("Stages all changes")
      await exec("git", ["commit", "-m", "Update Xcode Versions"])
      core.info("Created commit")

      const octokit = github.getOctokit(githubToken)
      await octokit.pulls.create()

      core.info("Created octokit")
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

/* istanbul ignore next */
if (process.env.NODE_ENV !== "test") {
  run()
}
