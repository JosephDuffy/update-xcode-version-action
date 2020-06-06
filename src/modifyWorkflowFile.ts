import * as fs from "fs"
import * as yaml from "yaml"
import setXcodeVersionsInWorkflow from "./setXcodeVersionsInWorkflow"
import VersionResolver from "./VersionResolver"

export default async function modifyWorkflowFile(
  path: string,
  keyPaths: Record<string, unknown>,
  resolveVersion: VersionResolver
): Promise<Record<string, unknown>> {
  const workflowFileContents = fs.readFileSync(path, "utf8")

  const workflow = yaml.parse(workflowFileContents)
  return setXcodeVersionsInWorkflow(workflow, keyPaths, resolveVersion)
}
