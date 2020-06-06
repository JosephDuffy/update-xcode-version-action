import VersionResolver from "./VersionResolver"
import setXcodeVersionsInWorkflow from "./setXcodeVersionsInWorkflow"
import path = require("path")
import fs = require("fs")
import yaml = require("yaml")

export default async function applyWorkflowXcodeVersionsFile(
  workflowXcodeVersions: Record<string, unknown>,
  rootPath: string,
  versionResolver: VersionResolver
): Promise<void> {
  for (const fileName in workflowXcodeVersions) {
    const keyPaths = workflowXcodeVersions[fileName] as Record<string, unknown>
    const workflowFilePath = path.resolve(rootPath, fileName)
    const workflowFileContents = fs.readFileSync(workflowFilePath, "utf8")
    const workflow = yaml.parse(workflowFileContents)

    const modifiedWorkflow = await setXcodeVersionsInWorkflow(
      workflow,
      keyPaths,
      versionResolver
    )
    const modifiedWorkflowYAML = yaml.stringify(modifiedWorkflow)
    fs.writeFileSync(workflowFilePath, modifiedWorkflowYAML, "utf8")
  }
}
