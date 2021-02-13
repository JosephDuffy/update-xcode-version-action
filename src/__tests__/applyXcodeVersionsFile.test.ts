import { mocked } from "ts-jest/utils"
import { readFileSync, writeFileSync, PathLike } from "fs"
import * as path from "path"
import applyXcodeVersionsFile from "../applyXcodeVersionsFile"
import MockResolver from "./MockResolver"
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
const expectedDoubleQuotesOutputFilePath =
  "./src/__tests__/workflows/output-double-quotes.yml"
const expectedSingleQuotesOutputFilePath =
  "./src/__tests__/workflows/output-single-quotes.yml"

test("applyXcodeVersionsFile double quotes", async () => {
  const fullXcodeVersionsFilePath = path.resolve(xcodeVersionsFilePath)
  const fullInputFilePath = path.resolve(inputFilePath)
  const fullExpectedOutputFilePath = path.resolve(
    expectedDoubleQuotesOutputFilePath
  )

  mockedReadFileSync.mockImplementation(
    (
      filePath: PathLike | number,
      options?: { encoding?: string | null; flag?: string } | string | null
    ): string | Buffer => {
      switch (filePath) {
        case fullXcodeVersionsFilePath:
          return fs.readFileSync(filePath, options)
        case fullInputFilePath:
          return fs.readFileSync(filePath, options)
        default:
          throw Error(`Unexpected path requested: ${filePath}`)
      }
    }
  )

  const resolver = new MockResolver()
  await applyXcodeVersionsFile(fullXcodeVersionsFilePath, resolver, "double")

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
test("applyXcodeVersionsFile single quotes", async () => {
  const fullXcodeVersionsFilePath = path.resolve(xcodeVersionsFilePath)
  const fullInputFilePath = path.resolve(inputFilePath)
  const fullExpectedOutputFilePath = path.resolve(
    expectedSingleQuotesOutputFilePath
  )

  mockedReadFileSync.mockImplementation(
    (
      filePath: PathLike | number,
      options?: { encoding?: string | null; flag?: string } | string | null
    ): string | Buffer => {
      switch (filePath) {
        case fullXcodeVersionsFilePath:
          return fs.readFileSync(filePath, options)
        case fullInputFilePath:
          return fs.readFileSync(filePath, options)
        default:
          throw Error(`Unexpected path requested: ${filePath}`)
      }
    }
  )

  const resolver = new MockResolver()
  await applyXcodeVersionsFile(fullXcodeVersionsFilePath, resolver, "single")

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
