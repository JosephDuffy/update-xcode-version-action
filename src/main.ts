import * as core from "@actions/core"
import * as path from "path"
import * as github from "@actions/github"
import { exec } from "@actions/exec"
import XcutilsVersionResolver from "./XcutilsVersionResolver"
import applyXcodeVersionsFile from "./applyXcodeVersionsFile"
import generateBadge from "./generateBadge"

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

    const quotes = core.getInput("quotes")

    if (quotes !== "single" && quotes !== "double") {
      core.error("Quotes can only be 'single' or 'double'")
      return
    }

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
    await applyXcodeVersionsFile(
      xcodeVersionsFilePath,
      xcutilsVersionResolver,
      quotes
    )

    const xcodeVersionBadgePath = core.getInput("xcode-version-badge-path")

    if (xcodeVersionBadgePath !== "") {
      const xcodeVersionBadgeVersionsString = core.getInput(
        "xcode-version-badge-versions"
      )
      const xcodeVersionBadgeVersions = xcodeVersionBadgeVersionsString
        .split(",")
        .map((s) => s.trim())

      if (xcodeVersionBadgeVersions.length > 0) {
        await generateBadge(
          path.resolve(workspacePath, xcodeVersionBadgePath),
          xcodeVersionBadgeVersions,
          xcutilsVersionResolver
        )
      }
    }

    const githubToken = core.getInput("github-token")

    if (githubToken !== "") {
      core.debug("Have a GitHub token; creating pull request")

      const gitDiffExitCode = await exec("git", ["diff", "--exit-code"], {
        ignoreReturnCode: true,
      })

      if (gitDiffExitCode === 0) {
        core.info("No change were applied")
        return
      }

      core.debug("Setting up committer details")

      await exec("git", [
        "config",
        "--local",
        "user.email",
        "action@github.com",
      ])
      await exec("git", ["config", "--local", "user.name", "GitHub Action"])

      const baseBranchName =
        (process.env.GITHUB_HEAD_REF && process.env.GITHUB_HEAD_REF.length > 0
          ? process.env.GITHUB_HEAD_REF
          : undefined) ?? github.context.ref.slice("refs/heads/".length)

      const octokit = github.getOctokit(githubToken)

      const commitAndPushChanges = async () => {
        const branchName = "update-xcode-version-action/update-xcode-versions"
        await exec("git", ["checkout", "-b", branchName])
        core.debug("Created branch")

        await exec("git", ["add", "."])
        core.debug("Staged all changes")

        await exec("git", ["commit", "-m", "Update Xcode Versions"])
        core.debug("Created commit")

        const branchExists =
          (await exec("git", [
            "ls-remote",
            "--exit-code",
            "--heads",
            "origin",
            branchName,
          ])) === 0

        if (branchExists) {
          const contentsDiffer =
            (await exec("git", [
              "diff",
              "--exit-code",
              "branchName",
              `origin/${branchName}`,
            ])) === 1

          if (!contentsDiffer) {
            core.debug(
              "Existing branch has matching content -- no need to update."
            )
            return
          }
        }

        await exec("git", ["push", "--force", "origin", branchName])
        core.debug("Pushed branch")
      }

      const pullRequests = await octokit.rest.pulls.list({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        head: `${github.context.repo.owner}:update-xcode-version-action/update-xcode-versions`,
        state: "open",
      })

      if (pullRequests.data.length > 0) {
        core.debug(
          `Found matching pull requests: ${JSON.stringify(pullRequests)}`
        )

        const pullRequest = pullRequests.data[0]

        if (pullRequest.base.ref !== baseBranchName) {
          core.info(
            `An existing pull requests exists at ${pullRequest.html_url} with base branch ${pullRequest.base.ref}, but the workflow was run from ${baseBranchName}.`
          )
          core.info(
            "The action will not create a new PR or update the existing branch. Delete the PR and run again to recreate."
          )
        } else {
          core.info(
            `Pull request exists at ${pullRequest.html_url}. Pushing changes.`
          )

          await commitAndPushChanges()

          core.setOutput("pull-request-url", pullRequest.html_url)
          core.setOutput("pull-request-id", pullRequest.number)
        }
      } else {
        await commitAndPushChanges()

        const createParameters = {
          title: "Update Xcode Versions",
          head: "update-xcode-version-action/update-xcode-versions",
          base: baseBranchName,
          owner: github.context.repo.owner,
          repo: github.context.repo.repo,
        }

        core.debug(
          `Attempting to create a pull request with parameters:${JSON.stringify(
            createParameters
          )}`
        )

        const response = await octokit.rest.pulls.create(createParameters)

        core.info(`Create pull request at ${response.data.html_url}`)

        core.setOutput("pull-request-url", response.data.html_url)
        core.setOutput("pull-request-id", response.data.number)
      }
    }
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}

/* istanbul ignore next */
if (process.env.NODE_ENV !== "test") {
  run()
}
