export default interface XcodeVersionsFile {
  workflows: {
    [filePath: string]: Record<string, unknown>
  }
  projects: {
    [project: string]: string
  }
}
