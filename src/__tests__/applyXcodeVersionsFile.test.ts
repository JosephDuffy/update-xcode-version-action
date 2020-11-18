import { mocked } from "ts-jest/utils"
import { readFileSync, writeFileSync, PathLike, BaseEncodingOptions } from "fs"
import * as path from "path"
import applyXcodeVersionsFile from "../applyXcodeVersionsFile"
// import MockResolver from "./MockResolver"
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

  console.log("fullXcodeVersionsFilePath", fullXcodeVersionsFilePath)
  console.log("fullInputFilePath", fullInputFilePath)
  console.log("fullExpectedOutputFilePath", fullExpectedOutputFilePath)

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

  // const resolver = new MockResolver()
  await applyXcodeVersionsFile(fullXcodeVersionsFilePath)

  const expectedContents = fs.readFileSync(fullExpectedOutputFilePath, "utf8")

  expect(mockedReadFileSync).toBeCalledTimes(2)
  expect(mockedReadFileSync).nthCalledWith(1, fullXcodeVersionsFilePath, "utf8")
  expect(mockedReadFileSync).nthCalledWith(2, fullInputFilePath)
  expect(mockedWriteFileSync).toBeCalledTimes(1)
  expect(mockedWriteFileSync).toBeCalledWith(
    fullInputFilePath,
    expectedContents,
    "utf8"
  )
})
