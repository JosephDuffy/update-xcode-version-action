import * as toolsCache from "@actions/tool-cache"
import * as core from "@actions/core"
import { exec, ExecOptions } from "@actions/exec"
import VersionResolver from "./VersionResolver"
import XcodeVersion from "./XcodeVersion"

export default class XcutilsVersionResolver implements VersionResolver {
  private hasDownloadedBinary = false

  private xcodeSearchPath: string

  private downloadBinaryPromise?: Promise<void>

  constructor(xcodeSearchPath: string) {
    this.xcodeSearchPath = xcodeSearchPath
  }

  async resolveVersion(versionSpecifier: string): Promise<string | undefined> {
    const json = await this.run([
      "select",
      versionSpecifier,
      "--print-versions",
      "--output=json",
      `--search-path=${this.xcodeSearchPath}`,
    ])
    core.debug(`Resolved versions for ${versionSpecifier}: ${json}`)
    const versions = JSON.parse(json) as XcodeVersion[]

    if (versions.length === 0) {
      return
    }

    const version = versions[0]
    core.debug(`Resolved ${versionSpecifier} to ${JSON.stringify(version)}`)
    const path = version.path
    const xcodeSplit = path.split("/Xcode_")

    if (xcodeSplit.length < 2) {
      throw Error(`Path does not contain "Xcode_": ${path}`)
    }

    const appSplit = xcodeSplit[1].split(".app")

    if (appSplit.length < 2) {
      throw Error(`Path does not contain ".app": ${path}`)
    }

    return appSplit[0]
  }

  private async run(args: string[]): Promise<string> {
    await this.pullXcutils()

    let output = ""

    const options: ExecOptions = {
      listeners: {
        stdout: (data: Buffer) => {
          output += data.toString()
        },
      },
    }

    await exec("xcutils", args, options)

    return output
  }

  private async pullXcutils(): Promise<void> {
    if (this.downloadBinaryPromise !== undefined) {
      return this.downloadBinaryPromise
    }

    this.downloadBinaryPromise = this.createDownloadBinaryPromise()
    await this.downloadBinaryPromise
  }

  private async createDownloadBinaryPromise(): Promise<void> {
    const version = "0.2.2"

    const cachedXcutilsDirectory = toolsCache.find("xcutils", version)

    if (cachedXcutilsDirectory !== "") {
      core.debug(`Adding cached xcutils to path: ${cachedXcutilsDirectory}`)

      core.addPath(cachedXcutilsDirectory)
      return
    }

    const zipURL = `https://github.com/JosephDuffy/xcutils/releases/download/v${version}/xcutils.zip`

    core.debug(`Downloading xcutils archive from ${zipURL}`)

    const xcutilsZipPath = await toolsCache.downloadTool(zipURL)

    core.debug("Extracting xcutils zip to /usr/local/bin")

    const xcutilsFolder = await toolsCache.extractZip(
      xcutilsZipPath,
      "/usr/local/bin"
    )

    const cachedPath = await toolsCache.cacheDir(
      xcutilsFolder,
      "xcutils",
      version
    )

    core.debug(`Adding xcutils to path: ${cachedPath}`)

    core.addPath(cachedPath)
  }
}
