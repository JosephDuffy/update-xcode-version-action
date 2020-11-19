import VersionResolver from "./VersionResolver"
import * as path from "path"
import * as core from "@actions/core"
import * as fs from "fs"
import { WorkflowNode, Workflows } from "./XcodeVersionsFile"
import { Stream } from "stream"
import { exec } from "child_process"

export default async function applyXcodeVersionsToWorkflowFiles(
  workflows: Workflows,
  rootPath: string,
  versionResolver: VersionResolver
): Promise<void> {
  for (const fileName in workflows) {
    const rootNode = workflows[fileName]
    const workflowFilePath = path.resolve(rootPath, fileName)
    core.debug(
      `Resolved workflow file "${fileName}" against "${rootPath}": "${workflowFilePath}"`
    )
    const workflowFileContents = fs.readFileSync(workflowFilePath)

    const updates = updatesFrom(rootNode)

    const scriptPath = path.resolve(__dirname, "applyXcodeVersion.py")

    core.debug(`Running script at ${scriptPath}`)

    let modifiedFileContents = workflowFileContents
    for (const update of updates) {
      try {
        const output = await execute(modifiedFileContents, [
          "python3",
          scriptPath,
          ...update.keyPath,
          ...update.value,
        ])
        modifiedFileContents = Buffer.from(output)
      } catch (error) {
        core.error(error)
      }
    }

    fs.writeFileSync(
      workflowFilePath,
      modifiedFileContents.toString("utf8"),
      "utf8"
    )
  }
}

function execute(input: Buffer, params: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = exec(params.join(" "), (error, stdout) => {
      if (error) {
        reject(error)
      } else {
        resolve(stdout)
      }
    })

    if (child.stdin) {
      const stdinStream = new Stream.Readable()
      stdinStream.push(input) // Add data to the internal queue for users of the stream to consume
      stdinStream.push(null) // Signals the end of the stream (EOF)
      stdinStream.pipe(child.stdin)
    }
  })
}

interface WorkflowUpdate {
  readonly keyPath: string[]
  readonly value: string[]
}

function updatesFrom(
  node: WorkflowNode,
  keyPath: string[] = []
): WorkflowUpdate[] {
  if (typeof node === "string") {
    // TODO: Resolve
    return [
      {
        keyPath,
        value: [node],
      },
    ]
  } else if (Array.isArray(node)) {
    // TODO: Resolve
    return [
      {
        keyPath,
        value: node,
      },
    ]
  } else {
    return Object.keys(node).flatMap((key) => {
      keyPath.push(key)
      return updatesFrom(node[key], keyPath)
    })
  }
}
