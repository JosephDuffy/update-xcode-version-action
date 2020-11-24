import VersionResolver from "./VersionResolver"
import * as path from "path"
import * as core from "@actions/core"
import execa from "execa"
import * as fs from "fs"
import { WorkflowNode, Workflows } from "./XcodeVersionsFile"

export default async function applyXcodeVersionsToWorkflowFiles(
  workflows: Workflows,
  rootPath: string,
  versionResolver: VersionResolver
): Promise<void> {
  core.debug("Installing pip3 requirements")

  await execa("pip3", [
    "install",
    "-r",
    path.resolve(__dirname, "../requirements.txt"),
  ])

  for (const fileName in workflows) {
    const rootNode = workflows[fileName]
    const workflowFilePath = path.resolve(rootPath, fileName)
    core.debug(
      `Resolved workflow file "${fileName}" against "${rootPath}": "${workflowFilePath}"`
    )
    const workflowFileContents = fs.readFileSync(workflowFilePath)

    const updates = await updatesFrom(rootNode, versionResolver)

    // "../src" is used to support being run from the `dist` directory
    const scriptPath = path.resolve(__dirname, "../src/applyXcodeVersion.py")

    let modifiedFileContents = workflowFileContents.toString()
    for (const update of updates) {
      try {
        core.debug(
          `Running script at ${scriptPath} with parameters ${[
            ...update.keyPath,
            "--yaml_value",
            ...update.value,
          ]}`
        )
        core.debug(`Passing file contents: ${modifiedFileContents}`)

        const { stdout } = await execa(
          scriptPath,
          [...update.keyPath, "--yaml_value", ...update.value],
          {
            input: modifiedFileContents,
          }
        )

        modifiedFileContents = stdout
      } catch (error) {
        core.error(error)
      }
    }

    fs.writeFileSync(workflowFilePath, modifiedFileContents, "utf8")
  }
}

interface WorkflowUpdate {
  readonly keyPath: string[]
  readonly value: string[]
}

export async function updatesFrom(
  node: WorkflowNode,
  versionResolver: VersionResolver,
  keyPath: string[] = []
): Promise<WorkflowUpdate[]> {
  if (typeof node === "string") {
    const resolvedVersion = await versionResolver.resolveVersion(node)
    return [
      {
        keyPath,
        value: [resolvedVersion],
      },
    ]
  } else if (Array.isArray(node)) {
    const resolvePromises = node.map((version) =>
      versionResolver.resolveVersion(version)
    )

    const versions = await Promise.all(resolvePromises)

    return [
      {
        keyPath,
        value: versions,
      },
    ]
  } else {
    const promises = Object.keys(node).map((key) => {
      return updatesFrom(node[key], versionResolver, [...keyPath, key])
    })
    const result = await Promise.all(promises)
    return result.flatMap((element) => element)
  }
}
