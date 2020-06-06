import * as fs from "fs"
import applyWorkflowXcodeVersionsFile from "../applyWorkflowXcodeVersionsFile"
import * as yaml from "yaml"
import VersionResolver from "../VersionResolver"

const inputFile = "./src/__tests__/workflows/input.yml"
const expectedOutputFile = "./src/__tests__/workflows/output.yml"
const inputFileBackup = "./src/__tests__/workflows/input-copy.yml"

beforeEach(() => {
  fs.copyFileSync(inputFile, inputFileBackup)
})

afterEach(() => {
  fs.copyFileSync(inputFileBackup, inputFile)
  fs.unlinkSync(inputFileBackup)
})

test("applyWorkflowXcodeVersionsFile", async () => {
  const workflowXcodeVersions = yaml.parse(
    fs.readFileSync("./src/__tests__/workflow-xcode-versions.yml", "utf8")
  )
  const resolver = new MockResolver()
  await applyWorkflowXcodeVersionsFile(
    workflowXcodeVersions,
    "./src/__tests__/",
    resolver
  )

  const resultContents = fs.readFileSync(inputFile, "utf8")
  const expectedContents = fs.readFileSync(expectedOutputFile, "utf8")

  expect(resultContents).toEqual(expectedContents)
})

class MockResolver implements VersionResolver {
  async resolveVersion(versionSpecifier: string): Promise<string> {
    const versionsMap = {
      latest: "11.3",
      beta: "11.4-beta",
      "last-major": "10.3",
      "latst-minor": "11.2.1",
    } as Record<string, string>
    return versionsMap[versionSpecifier] ?? versionSpecifier
  }
}
