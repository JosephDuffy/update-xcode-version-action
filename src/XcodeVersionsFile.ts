export default interface XcodeVersionsFile {
  workflows: Workflows
  projects: {
    [project: string]: string
  }
}

export type Workflows = {
  [filePath: string]: WorkflowNode
}

export type WorkflowNode = string | string[] | { [key: string]: WorkflowNode }
