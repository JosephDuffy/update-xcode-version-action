import VersionResolver from "./VersionResolver"
import applyXcodeVersionsToWorkflowFiles from "./applyXcodeVersionsToWorkflowFiles"
import * as path from "path"
import * as fs from "fs"
import * as yaml from "yaml"
import XcodeVersionsFile from "./XcodeVersionsFile"

/**
 * Update the YAML files described in `xcodeVersionsFilePath`.
 *
 * @param xcodeVersionsFilePath The path to the file that specifies the key paths and YAML files to update.
 * @param versionResolver An object that can be used to resolve versions in leaves.
 */
export default function applyXcodeVersionsFile(
  xcodeVersionsFilePath: string //,
  // versionResolver: VersionResolver
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
  return applyXcodeVersionsToWorkflowFiles(
    workflowXcodeVersions,
    xcodeVersionsFileDirectory //,
    // versionResolver
  )

  // return new Promise((resolve) => {
  //   resolve()
  // })
}
