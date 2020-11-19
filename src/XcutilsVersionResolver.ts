import * as toolsCache from "@actions/tool-cache"
import * as core from "@actions/core"
import { exec, ExecOptions } from "@actions/exec"
import VersionResolver from "./VersionResolver"
import XcodeVersion from "./XcodeVersion"

export default class XcutilsVersionResolver implements VersionResolver {
  private hasDownloadedBinary = false

  private xcodeSearchPath: string

  constructor(xcodeSearchPath: string) {
    this.xcodeSearchPath = xcodeSearchPath
  }

  async resolveVersion(versionSpecifier: string): Promise<string> {
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
      throw Error(`No versions found matching ${versionSpecifier}`)
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
    if (!this.hasDownloadedBinary) {
      await this.pullXcutils()
    }

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

  private async pullXcutils() {
    const version = "v0.2.0"
    const zipURL = `https://github.com/JosephDuffy/xcutils/releases/download/${version}/xcutils.zip`

    core.debug(`Downloading xcutils archive from ${zipURL}`)

    const xcutilsZipPath = await toolsCache.downloadTool(zipURL)

    core.debug("Extracting xcutils zip to /usr/local/bin")

    const xcutilsFolder = await toolsCache.extractZip(
      xcutilsZipPath,
      "/usr/local/bin"
    )

    core.debug(`Adding xcutils to path: ${xcutilsFolder}`)

    core.addPath(xcutilsFolder)
    this.hasDownloadedBinary = true
  }
}
