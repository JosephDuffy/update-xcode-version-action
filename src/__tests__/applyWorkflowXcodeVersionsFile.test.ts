import { mocked } from "ts-jest/utils"
import { readFileSync, writeFileSync } from "fs"
import * as yaml from "yaml"
import path from "path"
import XcodeVersionsFile, { WorkflowNode } from "../XcodeVersionsFile"
import applyXcodeVersionsToWorkflowFiles, {
  updatesFrom,
} from "../applyXcodeVersionsToWorkflowFiles"
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
const inputFilePath = path.resolve("./src/__tests__/workflows/input.yml")
const outputSingleQuotesFilePath =
  "./src/__tests__/workflows/output-single-quotes.yml"
const outputDoubleQuotesFilePath =
  "./src/__tests__/workflows/output-double-quotes.yml"

test("applyXcodeVersionsToWorkflowFiles single quotes", async () => {
  const xcodeVersions = yaml.parse(
    fs.readFileSync(xcodeVersionsFilePath, "utf8")
  ) as XcodeVersionsFile

  mockedReadFileSync.mockReturnValue(fs.readFileSync(inputFilePath, "utf8"))

  const workflowXcodeVersions = xcodeVersions.workflows
  const resolver = new MockResolver()
  await applyXcodeVersionsToWorkflowFiles(
    workflowXcodeVersions,
    "./src/__tests__/",
    resolver,
    "single"
  )

  const expectedContents = fs.readFileSync(outputSingleQuotesFilePath, "utf8")

  expect(mockedReadFileSync).toBeCalledTimes(1)
  expect(mockedReadFileSync).toBeCalledWith(inputFilePath)
  expect(mockedWriteFileSync).toBeCalledTimes(1)
  expect(mockedWriteFileSync).toBeCalledWith(
    inputFilePath,
    expectedContents,
    "utf8"
  )
})

test("applyXcodeVersionsToWorkflowFiles double quotes", async () => {
  const xcodeVersions = yaml.parse(
    fs.readFileSync(xcodeVersionsFilePath, "utf8")
  ) as XcodeVersionsFile

  mockedReadFileSync.mockReturnValue(fs.readFileSync(inputFilePath, "utf8"))

  const workflowXcodeVersions = xcodeVersions.workflows
  const resolver = new MockResolver()
  await applyXcodeVersionsToWorkflowFiles(
    workflowXcodeVersions,
    "./src/__tests__/",
    resolver,
    "double"
  )

  const expectedContents = fs.readFileSync(outputDoubleQuotesFilePath, "utf8")

  expect(mockedReadFileSync).toBeCalledTimes(1)
  expect(mockedReadFileSync).toBeCalledWith(inputFilePath)
  expect(mockedWriteFileSync).toBeCalledTimes(1)
  expect(mockedWriteFileSync).toBeCalledWith(
    inputFilePath,
    expectedContents,
    "utf8"
  )
})

test("updatesFrom", async () => {
  const input: WorkflowNode = {
    jobs: {
      "multiple-versions": {
        strategy: {
          matrix: {
            xcode: ["last-major", "last-minor", "latest", "beta"],
          },
        },
      },
      "last-major": {
        strategy: {
          matrix: {
            xcode: ["last-major"],
          },
        },
      },
    },
  }
  const resolver = new MockResolver()

  const actualResult = await updatesFrom(input, resolver)

  expect(actualResult).toEqual([
    {
      keyPath: ["jobs", "multiple-versions", "strategy", "matrix", "xcode"],
      value: ["11.7", "12.1", "12.2", "12.3"],
    },
    {
      keyPath: ["jobs", "last-major", "strategy", "matrix", "xcode"],
      value: ["11.7"],
    },
  ])
})
