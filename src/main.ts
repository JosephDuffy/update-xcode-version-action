import * as core from "@actions/core"
import * as path from "path"
import * as fs from "fs"
import * as yaml from "yaml"
import setXcodeVersionsInWorkflow from "./setXcodeVersionsInWorkflow"
import XcutilsVersionResolver from "./XcutilsVersionResolver"

async function run(): Promise<void> {
  try {
    const workspacePath = process.env["GITHUB_WORKSPACE"]

    if (workspacePath === undefined) {
      core.error("GITHUB_WORKSPACE environment variable not available")
      return
    }

    const workflowXcodeVersionsFile = core.getInput(
      "workflow-xcode-versions-file"
    )

    if (workflowXcodeVersionsFile === undefined) {
      core.error("GITHUB_WORKSPACE environment variable not available")
      return
    }

    const xcodeSearchPath = path.resolve(
      workspacePath,
      core.getInput("xcode-search-path") ?? "/Applications"
    )

    const workflowXcodeVersionsFilePath = path.resolve(
      workspacePath,
      workflowXcodeVersionsFile
    )

    const workflowXcodeVersionsFileDirectory = path.dirname(
      workflowXcodeVersionsFilePath
    )

    const workflowXcodeVersionsFileContents = fs.readFileSync(
      workflowXcodeVersionsFilePath,
      "utf8"
    )

    const workflowXcodeVersions = yaml.parse(workflowXcodeVersionsFileContents)
    const xcutilsVersionResolver = new XcutilsVersionResolver(xcodeSearchPath)

    for (const fileName in workflowXcodeVersions) {
      const keyPaths = workflowXcodeVersions[fileName]
      const workflowFilePath = path.resolve(
        workflowXcodeVersionsFileDirectory,
        fileName
      )
      const workflowFileContents = fs.readFileSync(workflowFilePath, "utf8")
      const workflow = yaml.parse(workflowFileContents)

      const modifiedWorkflow = await setXcodeVersionsInWorkflow(
        workflow,
        keyPaths,
        xcutilsVersionResolver
      )
      const modifiedWorkflowYAML = yaml.stringify(modifiedWorkflow)
      fs.writeFileSync(modifiedWorkflowYAML, "utf8")
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
