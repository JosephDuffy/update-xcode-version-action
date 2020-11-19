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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  versionResolver: VersionResolver
): Promise<void> {
  await execute([
    "pip3",
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

    const updates = updatesFrom(rootNode)

    // "../src" is used to support being run from the `dist` directory
    const scriptPath = path.resolve(__dirname, "../src/applyXcodeVersion.py")

    core.debug(`Running script at ${scriptPath}`)

    let modifiedFileContents = workflowFileContents
    for (const update of updates) {
      try {
        const output = await execute(
          [scriptPath, ...update.keyPath, ...update.value],
          modifiedFileContents
        )
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

function execute(params: string[], input?: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = exec(params.join(" "), (error, stdout) => {
      if (error) {
        reject(error)
      } else {
        resolve(stdout)
      }
    })

    if (input && child.stdin) {
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
