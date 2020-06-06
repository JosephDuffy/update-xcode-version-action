import * as core from "@actions/core"
import * as path from "path"
import XcutilsVersionResolver from "./XcutilsVersionResolver"
import applyXcodeVersionsFile from "./applyXcodeVersionsFile"

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

    core.debug(
      `Resolved Xcode search path "${xcodeSearchPathInput}" against workspace "${workspacePath}": "${xcodeSearchPath}`
    )

    // The path to the file that describes which workflow and Xcode projects files to update
    const xcodeVersionsFilePath = path.resolve(workspacePath, xcodeVersionsFile)
    const xcutilsVersionResolver = new XcutilsVersionResolver(xcodeSearchPath)
    await applyXcodeVersionsFile(xcodeVersionsFilePath, xcutilsVersionResolver)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
