import { mocked } from "ts-jest/utils"
import { readFileSync, writeFileSync } from "fs"
import * as yaml from "yaml"
import path from "path"
import VersionResolver from "../VersionResolver"
import XcodeVersionsFile from "../XcodeVersionsFile"
import applyWorkflowXcodeVersionsFileModule from "../applyWorkflowXcodeVersionsFile"
const fs = jest.requireActual("fs")
jest.mock("fs")
const mockedReadFileSync = mocked(readFileSync, true)
const mockedWriteFileSync = mocked(writeFileSync, true)

afterEach(() => {
  mockedReadFileSync.mockReset()
  mockedWriteFileSync.mockReset()
})

const xcodeVersionsFilePath = "./src/__tests__/xcode-versions.yml"
const inputFilePath = path.resolve("./src/__tests__/workflows/input.yml")
const outputFilePath = "./src/__tests__/workflows/output.yml"

test("applyWorkflowXcodeVersionsFile", async () => {
  const xcodeVersions = yaml.parse(
    fs.readFileSync(xcodeVersionsFilePath, "utf8")
  ) as XcodeVersionsFile

  mockedReadFileSync.mockReturnValue(fs.readFileSync(inputFilePath, "utf8"))

  const workflowXcodeVersions = xcodeVersions.workflows
  const resolver = new MockResolver()
  await applyWorkflowXcodeVersionsFileModule(
    workflowXcodeVersions,
    "./src/__tests__/",
    resolver
  )

  const expectedContents = fs.readFileSync(outputFilePath, "utf8")

  expect(mockedReadFileSync).toBeCalledTimes(1)
  expect(mockedReadFileSync).toBeCalledWith(inputFilePath, "utf8")
  expect(mockedWriteFileSync).toBeCalledTimes(1)
  expect(mockedWriteFileSync).toBeCalledWith(
    inputFilePath,
    expectedContents,
    "utf8"
  )
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
