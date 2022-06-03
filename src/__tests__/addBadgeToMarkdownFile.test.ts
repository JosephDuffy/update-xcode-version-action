import { mocked } from "ts-jest/utils"
import { readFileSync, writeFileSync, PathLike } from "fs"
import * as path from "path"
import addBadgeToMarkdownFile from "../addBadgeToMarkdownFile"
import MockResolver from "./MockResolver"
const fs = jest.requireActual("fs")
jest.mock("fs")
const mockedReadFileSync = mocked(readFileSync, true)
const mockedWriteFileSync = mocked(writeFileSync, true)

afterEach(() => {
  mockedReadFileSync.mockReset()
  mockedWriteFileSync.mockReset()
})

const markdownFilePath = "./src/__tests__/input.md"

test("addBadgeToMarkdownFile", async () => {
  const fullMarkdownFilePath = path.resolve(markdownFilePath)
  const fullExpectedOutputFilePath = path.resolve("./src/__tests__/output.md")

  mockedReadFileSync.mockImplementation(
    (
      filePath: PathLike | number,
      options?: { encoding?: string | null; flag?: string } | string | null
    ): string | Buffer => {
      switch (filePath) {
        case fullMarkdownFilePath:
          return fs.readFileSync(filePath, options)
        default:
          throw Error(`Unexpected path requested: ${filePath}`)
      }
    }
  )

  const resolver = new MockResolver()
  await addBadgeToMarkdownFile(
    ["beta", "latest"],
    resolver,
    markdownFilePath,
    "."
  )

  const expectedContents = fs.readFileSync(fullExpectedOutputFilePath, "utf8")

  expect(mockedWriteFileSync).toBeCalledWith(
    fullMarkdownFilePath,
    expectedContents,
    "utf8"
  )
})
