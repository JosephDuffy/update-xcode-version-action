import { getInput, debug, setFailed } from "@actions/core"

async function run(): Promise<void> {
  try {
    const workflowXcodeVersionsFile = getInput("workflow-xcode-versions-file")
    debug(workflowXcodeVersionsFile)
    debug(process.env["PWD"] ?? "NO PWD")
    debug(process.env["PATH"] ?? "NO PATH")
    debug(process.env["GITHUB_WORKSPACE"] ?? "NO WORKSPACE")
  } catch (error) {
    setFailed(error.message)
  }
}

run()
