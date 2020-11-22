import { mocked } from "ts-jest/utils"
import { readFileSync, writeFileSync } from "fs"
import { ChildProcess, exec } from "child_process"
import * as yaml from "yaml"
import path from "path"
import XcodeVersionsFile, { WorkflowNode } from "../XcodeVersionsFile"
import applyXcodeVersionsToWorkflowFiles, {
  updatesFrom,
} from "../applyXcodeVersionsToWorkflowFiles"
import MockResolver from "./MockResolver"
import {
  MaybeMockedDeep,
  MockedFunction,
  MockedFunctionDeep,
} from "ts-jest/dist/utils/testing"
const fs = jest.requireActual("fs")
jest.mock("fs")
const childProcessMock = jest.mock("child_process")

describe(applyXcodeVersionsToWorkflowFiles, () => {
  const xcodeVersionsFilePath = "./src/__tests__/xcode-versions.yml"
  const inputFilePath = path.resolve("./src/__tests__/workflows/input.yml")
  const outputFilePath = "./src/__tests__/workflows/output.yml"
  const mockedReadFileSync = mocked(readFileSync, true)
  const mockedWriteFileSync = mocked(writeFileSync, true)

  beforeEach(() => {
    mockedReadFileSync.mockReturnValue(fs.readFileSync(inputFilePath, "utf8"))

    childProcessMock.resetAllMocks()
  })

  afterEach(() => {
    mockedReadFileSync.mockReset()
    mockedWriteFileSync.mockReset()
  })

  it("writes updated YAML", async () => {
    const xcodeVersions = yaml.parse(
      fs.readFileSync(xcodeVersionsFilePath, "utf8")
    ) as XcodeVersionsFile

    const workflowXcodeVersions = xcodeVersions.workflows
    const resolver = new MockResolver()
    await applyXcodeVersionsToWorkflowFiles(
      workflowXcodeVersions,
      "./src/__tests__/",
      resolver
    )

    const expectedContents = fs.readFileSync(outputFilePath, "utf8")

    expect(mockedReadFileSync).toBeCalledTimes(1)
    expect(mockedReadFileSync).toBeCalledWith(inputFilePath)
    expect(mockedWriteFileSync).toBeCalledTimes(1)
    expect(mockedWriteFileSync).toBeCalledWith(
      inputFilePath,
      expectedContents,
      "utf8"
    )
  })

  describe("when the python script fails", () => {
    let mockedExec: MockedFunction<typeof exec>

    beforeEach(() => {
      mockedExec = mocked(exec, false)

      const error = new Error("Test message")

      mockedExec.mockImplementation(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((command: string, callback: any): ChildProcess => {
          // Result of pip will not actually be used
          if (command.startsWith("pip")) {
            callback(null, "", "")
            return {} as ChildProcess
          }

          callback(error, "", "")

          return {} as ChildProcess
        }) as any // eslint-disable @typescript-eslint/no-explicit-any
      )
    })

    afterEach(() => {
      mockedExec.mockReset()
      jest.unmock("child_process")
    })

    it("writes no changes when the python script fails", async () => {
      const xcodeVersions = yaml.parse(
        fs.readFileSync(xcodeVersionsFilePath, "utf8")
      ) as XcodeVersionsFile

      const workflowXcodeVersions = xcodeVersions.workflows
      const resolver = new MockResolver()

      await applyXcodeVersionsToWorkflowFiles(
        workflowXcodeVersions,
        "./src/__tests__/",
        resolver
      )

      expect(mockedReadFileSync).toBeCalledTimes(1)
      expect(mockedReadFileSync).toBeCalledWith(inputFilePath)
      expect(mockedWriteFileSync).not.toBeCalled()
    })
  })
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
      value: ["10.3", "11.2.1", "11.3", "11.4-beta"],
    },
    {
      keyPath: ["jobs", "last-major", "strategy", "matrix", "xcode"],
      value: ["10.3"],
    },
  ])
})
