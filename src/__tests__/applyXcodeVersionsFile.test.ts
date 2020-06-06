import { mocked } from "ts-jest/utils"
import { readFileSync, writeFileSync, PathLike, BaseEncodingOptions } from "fs"
import * as path from "path"
import VersionResolver from "../VersionResolver"
import applyXcodeVersionsFileModule from "../applyXcodeVersionsFile"
const fs = jest.requireActual("fs")
jest.mock("fs")
const mockedReadFileSync = mocked(readFileSync, true)
const mockedWriteFileSync = mocked(writeFileSync, true)

afterEach(() => {
  mockedReadFileSync.mockReset()
  mockedWriteFileSync.mockReset()
})

const xcodeVersionsFilePath = "./src/__tests__/xcode-versions.yml"
const inputFilePath = "./src/__tests__/workflows/input.yml"
const expectedOutputFilePath = "./src/__tests__/workflows/output.yml"

test("applyXcodeVersionsFile", async () => {
  const fullXcodeVersionsFilePath = path.resolve(xcodeVersionsFilePath)
  const fullInputFilePath = path.resolve(inputFilePath)
  const fullExpectedOutputFilePath = path.resolve(expectedOutputFilePath)

  mockedReadFileSync.mockImplementation(
    (
      filePath: PathLike | number,
      options?:
        | (BaseEncodingOptions & { flag?: string })
        | BufferEncoding
        | null
    ): Buffer | string => {
      switch (filePath) {
        case fullXcodeVersionsFilePath:
          return fs.readFileSync(filePath, options)
        case fullInputFilePath:
          return fs.readFileSync(filePath, options)
        default:
          throw Error(`Unexepected path requested: ${filePath}`)
      }
    }
  )

  const resolver = new MockResolver()
  await applyXcodeVersionsFileModule(fullXcodeVersionsFilePath, resolver)

  const expectedContents = fs.readFileSync(fullExpectedOutputFilePath, "utf8")

  expect(mockedReadFileSync).toBeCalledTimes(2)
  expect(mockedReadFileSync).nthCalledWith(1, fullXcodeVersionsFilePath, "utf8")
  expect(mockedReadFileSync).nthCalledWith(2, fullInputFilePath, "utf8")
  expect(mockedWriteFileSync).toBeCalledTimes(1)
  expect(mockedWriteFileSync).toBeCalledWith(
    fullInputFilePath,
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
