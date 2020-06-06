import VersionResolver from "./VersionResolver"
import mergeWorkflowWithXcodeVersionSpecifiers from "./mergeWorkflowWithXcodeVersionSpecifiers"
import * as path from "path"
import * as fs from "fs"
import * as yaml from "yaml"
import * as core from "@actions/core"

export default async function applyXcodeVersionsToWorkflowFiles(
  workflowFileKeyPaths: Record<string, unknown>,
  rootPath: string,
  versionResolver: VersionResolver
): Promise<void> {
  for (const fileName in workflowFileKeyPaths) {
    const keyPaths = workflowFileKeyPaths[fileName] as Record<string, unknown>
    const workflowFilePath = path.resolve(rootPath, fileName)
    core.debug(
      `Resolved workflow file "${fileName}" against "${rootPath}": "${workflowFilePath}"`
    )
    const workflowFileContents = fs.readFileSync(workflowFilePath, "utf8")
    const workflow = yaml.parse(workflowFileContents)

    const modifiedWorkflow = await mergeWorkflowWithXcodeVersionSpecifiers(
      workflow,
      keyPaths,
      versionResolver
    )
    const modifiedWorkflowYAML = yaml.stringify(modifiedWorkflow)
    fs.writeFileSync(workflowFilePath, modifiedWorkflowYAML, "utf8")
  }
}
