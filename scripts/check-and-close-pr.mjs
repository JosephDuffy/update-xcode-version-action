/* eslint-disable no-console */
import * as github from "@actions/github"
import { exit } from "process"
;(async () => {
  const pullRequestID = process.env["PULL_REQUEST_ID"]
  const octokit = github.getOctokit(process.env["GITHUB_TOKEN"])

  try {
    const pullRequest = await octokit.rest.pulls.get({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      // eslint-disable-next-line camelcase
      pull_number: pullRequestID,
    })

    switch (pullRequest.data.state) {
      case "open":
        break
      case "closed":
        exit(1)
    }

    try {
      await octokit.rest.pulls.update({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        // eslint-disable-next-line camelcase
        pull_number: pullRequestID,
        state: "closed",
      })

      console.log("Successfully close pull request")
    } catch (err) {
      console.error("Failed to close pull request", err)
      exit(1)
    }
  } catch (err) {
    console.error("Failed to load pull request", err)
    exit(1)
  }
})()
