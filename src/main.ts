import * as core from "@actions/core"
import * as path from "path"
import * as fs from "fs"
import * as yaml from "yaml"
import XcutilsVersionResolver from "./XcutilsVersionResolver"
import applyWorkflowXcodeVersionsFile from "./applyWorkflowXcodeVersionsFile"
import XcodeVersionsFile from "./XcodeVersionsFile"

async function run(): Promise<void> {
  try {
    const workspacePath = process.env["GITHUB_WORKSPACE"]

    if (workspacePath === undefined) {
      core.error("GITHUB_WORKSPACE environment variable not available")
      return
    }

    const xcodeVersionsFile = core.getInput("xcode-versions-file", {
      required: true,
    })

    core.debug(`xcode-versions-file input: ${xcodeVersionsFile}`)

    const xcodeSearchPathInput = core.getInput("xcode-search-path")

    core.debug(
      `xcode-search-path input: ${xcodeSearchPathInput ?? "not provided"}`
    )

    const xcodeSearchPath = path.resolve(
      workspacePath,
      xcodeSearchPathInput ?? "/Applications"
    )

    // The path to the file that describes which workflow and Xcode projects files to update
    const xcodeVersionsFilePath = path.resolve(workspacePath, xcodeVersionsFile)
    const xcodeVersionsFileContents = fs.readFileSync(
      xcodeVersionsFilePath,
      "utf8"
    )
    const xcodeVersions = yaml.parse(
      xcodeVersionsFileContents
    ) as XcodeVersionsFile

    const xcodeVersionsFileDirectory = path.resolve(
      path.dirname(xcodeVersionsFilePath),
      ".."
    )

    const xcutilsVersionResolver = new XcutilsVersionResolver(xcodeSearchPath)

    const workflowXcodeVersions = xcodeVersions.workflows
    await applyWorkflowXcodeVersionsFile(
      workflowXcodeVersions,
      xcodeVersionsFileDirectory,
      xcutilsVersionResolver
    )
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
