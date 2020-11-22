import * as core from "@actions/core"
import * as path from "path"
import * as github from "@actions/github"
import { exec } from "@actions/exec"
import XcutilsVersionResolver from "./XcutilsVersionResolver"
import applyXcodeVersionsFile from "./applyXcodeVersionsFile"
import { Stream } from "stream"

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
      core.debug("Have a GitHub token; creating pull request")

      core.debug("Setting up committer details")

      await exec("git", [
        "config",
        "--local",
        "user.email",
        "action@github.com",
      ])
      await exec("git", ["config", "--local", "user.name", "GitHub Action"])

      let baseBranchName = ""
      await exec("git", ["branch", "--show-current"], {
        listeners: {
          stdout: (buffer) => {
            baseBranchName += buffer.toString("utf8")
          },
        },
      })

      await exec("git", [
        "checkout",
        "-b",
        "update-xcode-version-action/update-xcode-versions",
      ])
      core.debug("Created branch")

      await exec("git", ["add", "."])
      core.debug("Staged all changes")

      await exec("git", ["commit", "-m", "Update Xcode Versions"])
      core.debug("Created commit")

      await exec("git", [
        "push",
        "--force",
        "origin",
        "update-xcode-version-action/update-xcode-versions",
      ])
      core.debug("Pushed branch")

      const createParameters = {
        title: "Update Xcode Versions",
        head: "update-xcode-version-action/update-xcode-versions",
        base: `${github.context.repo.owner}:${baseBranchName}`,
        owner: github.context.actor,
        repo: github.context.repo.repo,
      }

      core.debug(
        `Attempting to create a pull request with parameters:${JSON.stringify(
          createParameters
        )}`
      )

      const octokit = github.getOctokit(githubToken)
      const response = await octokit.pulls.create(createParameters)

      core.info(`Create pull request at ${response.data.html_url}`)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

/* istanbul ignore next */
if (process.env.NODE_ENV !== "test") {
  run()
}
