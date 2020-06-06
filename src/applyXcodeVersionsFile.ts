import VersionResolver from "./VersionResolver"
import applyXcodeVersionsToWorkflowFiles from "./applyXcodeVersionsToWorkflowFiles"
import * as path from "path"
import * as fs from "fs"
import * as yaml from "yaml"
import XcodeVersionsFile from "./XcodeVersionsFile"

export default async function applyXcodeVersionsFile(
  xcodeVersionsFilePath: string,
  versionResolver: VersionResolver
): Promise<void> {
  const xcodeVersionsFileContents = fs.readFileSync(
    xcodeVersionsFilePath,
    "utf8"
  )
  const xcodeVersions = yaml.parse(
    xcodeVersionsFileContents
  ) as XcodeVersionsFile

  const xcodeVersionsFileDirectory = path.dirname(xcodeVersionsFilePath)

  const workflowXcodeVersions = xcodeVersions.workflows
  await applyXcodeVersionsToWorkflowFiles(
    workflowXcodeVersions,
    xcodeVersionsFileDirectory,
    versionResolver
  )
}
