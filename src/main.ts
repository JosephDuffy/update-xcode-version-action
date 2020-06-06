import * as core from "@actions/core"
import * as path from "path"
import * as fs from "fs"
import * as yaml from "yaml"
import XcutilsVersionResolver from "./XcutilsVersionResolver"
import applyWorkflowXcodeVersionsFile from "./applyWorkflowXcodeVersionsFile"

async function run(): Promise<void> {
  try {
    const workspacePath = process.env["GITHUB_WORKSPACE"]

    if (workspacePath === undefined) {
      core.error("GITHUB_WORKSPACE environment variable not available")
      return
    }

    const workflowXcodeVersionsFile = core.getInput(
      "workflow-xcode-versions-file",
      { required: true }
    )

    core.debug(
      `workflow-xcode-versions-file input: ${workflowXcodeVersionsFile}`
    )

    const xcodeSearchPathInput = core.getInput("xcode-search-path")

    core.debug(
      `xcode-search-path input: ${xcodeSearchPathInput ?? "not provided"}`
    )

    const xcodeSearchPath = path.resolve(
      workspacePath,
      xcodeSearchPathInput ?? "/Applications"
    )

    // The path to the file that describes which workflow files to update
    const workflowXcodeVersionsFilePath = path.resolve(
      workspacePath,
      workflowXcodeVersionsFile
    )
    const workflowXcodeVersionsFileContents = fs.readFileSync(
      workflowXcodeVersionsFilePath,
      "utf8"
    )
    const workflowXcodeVersions = yaml.parse(workflowXcodeVersionsFileContents)

    const workflowXcodeVersionsFileDirectory = path.resolve(
      path.dirname(workflowXcodeVersionsFilePath),
      ".."
    )

    const xcutilsVersionResolver = new XcutilsVersionResolver(xcodeSearchPath)

    await applyWorkflowXcodeVersionsFile(
      workflowXcodeVersions,
      workflowXcodeVersionsFileDirectory,
      xcutilsVersionResolver
    )
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
