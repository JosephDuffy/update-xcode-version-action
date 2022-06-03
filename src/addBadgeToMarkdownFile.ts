import VersionResolver from "./VersionResolver"
import * as path from "path"
import * as fs from "fs"
import getBadgeURL from "./getBadgeURL"

export default async function addBadgeToMarkdownFile(
  versions: string[],
  versionResolver: VersionResolver,
  markdownPath: string,
  rootPath: string
): Promise<void> {
  const badgeURL = await getBadgeURL(versions, versionResolver)
  const markdownFileURL = path.resolve(rootPath, markdownPath)
  let markdown = fs.readFileSync(markdownFileURL).toString("utf8")
  const searchString = "<!---xcode-version-badge-markdown-->"
  markdown = markdown.replace(
    /^.*<!---xcode-version-badge-markdown-->.*$/gm,
    `![Supported Xcode Versions](${badgeURL})${searchString}`
  )

  fs.writeFileSync(markdownFileURL, markdown, "utf8")
}
