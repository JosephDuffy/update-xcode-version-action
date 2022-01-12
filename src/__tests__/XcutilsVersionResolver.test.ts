import { mocked } from "ts-jest/utils"
import XcutilsVersionResolver from "../XcutilsVersionResolver"
import { addPath } from "@actions/core"
import { downloadTool, extractZip, find, cacheDir } from "@actions/tool-cache"
import { exec, ExecOptions } from "@actions/exec"
import XcodeVersion from "../XcodeVersion"
jest.mock("@actions/core")
jest.mock("@actions/tool-cache")
jest.mock("@actions/exec")
const mockedAddPath = mocked(addPath, true)
const mockedDownloadTool = mocked(downloadTool, true)
const mockedExtractZip = mocked(extractZip, true)
const mockedExec = mocked(exec, true)
const mockedFind = mocked(find, true)
const mockedCacheDir = mocked(cacheDir, true)

afterEach(() => {
  mockedAddPath.mockReset()
  mockedDownloadTool.mockReset()
  mockedExtractZip.mockReset()
  mockedExec.mockReset()
  mockedFind.mockReset()
  mockedCacheDir.mockReset()
})

test("resolving to a single version", async () => {
  const searchPath = "/Applications"
  const downloadedToolPath = "/test/directory/file.zip"
  const extractedDirectory = "/usr/local/bin"
  mockedDownloadTool.mockResolvedValue(downloadedToolPath)
  mockedExtractZip.mockResolvedValue(extractedDirectory)
  mockedAddPath.mockReturnValue()
  mockedFind.mockReturnValue("")
  mockedCacheDir.mockResolvedValue(extractedDirectory)
  const mockVersions: XcodeVersion[] = [
    {
      path: "/Applications/Xcode_11.5.app",
      build: "11E608c",
      bundleVersion: 16139,
      version: "11.5.0",
    },
  ]

  mockedExec.mockImplementation(
    async (
      commandLine: string,
      args?: string[],
      options?: ExecOptions
      // eslint-disable-next-line require-await
    ): Promise<number> => {
      if (options?.listeners?.stdout) {
        const string = JSON.stringify(mockVersions)
        const buffer = Buffer.from(string)
        options.listeners.stdout(buffer)
      }

      return 0
    }
  )

  const resolver = new XcutilsVersionResolver(searchPath)

  const resolvedVersion = await resolver.resolveVersion("latest")

  expect(resolvedVersion).toEqual("11.5")
  expect(mockedDownloadTool).toBeCalled()
  expect(mockedExtractZip).toBeCalledWith(
    downloadedToolPath,
    extractedDirectory
  )
  expect(mockedAddPath).toBeCalledWith(extractedDirectory)
  expect(mockedExec).toBeCalledWith(
    "xcutils",
    [
      "select",
      "latest",
      "--print-versions",
      "--output=json",
      `--search-path=${searchPath}`,
    ],
    expect.anything()
  )
})

test("resolving to no versions", async () => {
  const searchPath = "/Applications"
  const downloadedToolPath = "/test/directory/file.zip"
  const extractedDirectory = "/usr/local/bin"
  mockedDownloadTool.mockResolvedValue(downloadedToolPath)
  mockedExtractZip.mockResolvedValue(extractedDirectory)
  mockedAddPath.mockReturnValue()
  mockedFind.mockReturnValue("")
  mockedCacheDir.mockResolvedValue(extractedDirectory)

  mockedExec.mockImplementation(
    async (
      commandLine: string,
      args?: string[],
      options?: ExecOptions
      // eslint-disable-next-line require-await
    ): Promise<number> => {
      if (options?.listeners?.stdout) {
        const string = JSON.stringify([])
        const buffer = Buffer.from(string)
        options.listeners.stdout(buffer)
      }

      return 0
    }
  )

  const resolver = new XcutilsVersionResolver(searchPath)

  await expect(resolver.resolveVersion("latest")).resolves.toBeUndefined()

  expect(mockedDownloadTool).toBeCalled()
  expect(mockedExtractZip).toBeCalledWith(
    downloadedToolPath,
    extractedDirectory
  )
  expect(mockedAddPath).toBeCalledWith(extractedDirectory)
  expect(mockedExec).toBeCalledWith(
    "xcutils",
    [
      "select",
      "latest",
      "--print-versions",
      "--output=json",
      `--search-path=${searchPath}`,
    ],
    expect.anything()
  )
})

test("resolving multiple times", async () => {
  const searchPath = "/Applications"
  const downloadedToolPath = "/test/directory/file.zip"
  const extractedDirectory = "/usr/local/bin"
  mockedDownloadTool.mockResolvedValue(downloadedToolPath)
  mockedExtractZip.mockResolvedValue(extractedDirectory)
  mockedAddPath.mockReturnValue()
  mockedFind.mockReturnValue("")
  mockedCacheDir.mockResolvedValue(extractedDirectory)
  const mockVersions: XcodeVersion[] = [
    {
      path: "/Applications/Xcode_11.5.app",
      build: "11E608c",
      bundleVersion: 16139,
      version: "11.5.0",
    },
  ]

  mockedExec.mockImplementation(
    async (
      commandLine: string,
      args?: string[],
      options?: ExecOptions
      // eslint-disable-next-line require-await
    ): Promise<number> => {
      if (options?.listeners?.stdout) {
        const string = JSON.stringify(mockVersions)
        const buffer = Buffer.from(string)
        options.listeners.stdout(buffer)
      }

      return 0
    }
  )

  const resolver = new XcutilsVersionResolver(searchPath)

  await resolver.resolveVersion("latest")
  await resolver.resolveVersion("beta")

  expect(mockedDownloadTool).toBeCalledTimes(1)
  expect(mockedExtractZip).toBeCalledTimes(1)
  expect(mockedExtractZip).toBeCalledWith(
    downloadedToolPath,
    extractedDirectory
  )
  expect(mockedAddPath).toBeCalledTimes(1)
  expect(mockedAddPath).toBeCalledWith(extractedDirectory)
  expect(mockedExec).toBeCalledTimes(2)
  expect(mockedExec).toBeCalledWith(
    "xcutils",
    [
      "select",
      "latest",
      "--print-versions",
      "--output=json",
      `--search-path=${searchPath}`,
    ],
    expect.anything()
  )
})

test("resolving version without Xcode_ in path", async () => {
  const searchPath = "/Applications"
  const downloadedToolPath = "/test/directory/file.zip"
  const extractedDirectory = "/usr/local/bin"
  mockedDownloadTool.mockResolvedValue(downloadedToolPath)
  mockedExtractZip.mockResolvedValue(extractedDirectory)
  mockedAddPath.mockReturnValue()
  mockedFind.mockReturnValue("")
  mockedCacheDir.mockResolvedValue(extractedDirectory)
  const xcodePath = "/Applications/Xcode-11.5.app"
  const mockVersions: XcodeVersion[] = [
    {
      path: xcodePath,
      build: "11E608c",
      bundleVersion: 16139,
      version: "11.5.0",
    },
  ]

  mockedExec.mockImplementation(
    async (
      commandLine: string,
      args?: string[],
      options?: ExecOptions
      // eslint-disable-next-line require-await
    ): Promise<number> => {
      if (options?.listeners?.stdout) {
        const string = JSON.stringify(mockVersions)
        const buffer = Buffer.from(string)
        options.listeners.stdout(buffer)
      }

      return 0
    }
  )

  const resolver = new XcutilsVersionResolver(searchPath)

  await expect(resolver.resolveVersion("latest")).rejects.toEqual(
    new Error(`Path does not contain "Xcode_": ${xcodePath}`)
  )

  expect(mockedDownloadTool).toBeCalled()
  expect(mockedExtractZip).toBeCalledWith(
    downloadedToolPath,
    extractedDirectory
  )
  expect(mockedAddPath).toBeCalledWith(extractedDirectory)
  expect(mockedExec).toBeCalledWith(
    "xcutils",
    [
      "select",
      "latest",
      "--print-versions",
      "--output=json",
      `--search-path=${searchPath}`,
    ],
    expect.anything()
  )
})

test("resolving version without .app in path", async () => {
  const searchPath = "/Applications"
  const downloadedToolPath = "/test/directory/file.zip"
  const extractedDirectory = "/usr/local/bin"
  mockedDownloadTool.mockResolvedValue(downloadedToolPath)
  mockedExtractZip.mockResolvedValue(extractedDirectory)
  mockedAddPath.mockReturnValue()
  mockedFind.mockReturnValue("")
  mockedCacheDir.mockResolvedValue(extractedDirectory)
  const xcodePath = "/Applications/Xcode_11.5.xip"
  const mockVersions: XcodeVersion[] = [
    {
      path: xcodePath,
      build: "11E608c",
      bundleVersion: 16139,
      version: "11.5.0",
    },
  ]

  mockedExec.mockImplementation(
    async (
      commandLine: string,
      args?: string[],
      options?: ExecOptions
      // eslint-disable-next-line require-await
    ): Promise<number> => {
      if (options?.listeners?.stdout) {
        const string = JSON.stringify(mockVersions)
        const buffer = Buffer.from(string)
        options.listeners.stdout(buffer)
      }

      return 0
    }
  )

  const resolver = new XcutilsVersionResolver(searchPath)

  await expect(resolver.resolveVersion("latest")).rejects.toEqual(
    new Error(`Path does not contain ".app": ${xcodePath}`)
  )

  expect(mockedDownloadTool).toBeCalled()
  expect(mockedExtractZip).toBeCalledWith(
    downloadedToolPath,
    extractedDirectory
  )
  expect(mockedAddPath).toBeCalledWith(extractedDirectory)
  expect(mockedExec).toBeCalledWith(
    "xcutils",
    [
      "select",
      "latest",
      "--print-versions",
      "--output=json",
      `--search-path=${searchPath}`,
    ],
    expect.anything()
  )
})
