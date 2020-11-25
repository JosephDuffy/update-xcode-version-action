import VersionResolver from "./VersionResolver"
import * as fs from "fs"
import https from "https"

export default function generateBadge(
  badgePath: string,
  versions: string[],
  versionResolver: VersionResolver
): Promise<void> {
  return new Promise((resolve, reject) => {
    const resolvedVersionPromises = versions.map((v) =>
      versionResolver.resolveVersion(v)
    )

    Promise.all(resolvedVersionPromises)
      // eslint-disable-next-line github/no-then
      .then((resolvedVersions) => {
        const displayResolvedVersions = encodeURI(
          resolvedVersions.filter((v) => v !== undefined).join(" | ")
        )

        const badgeURL = `https://img.shields.io/badge/Xcode-${displayResolvedVersions}-success`

        https
          .get(badgeURL, (response) => {
            const badgeWriteStream = fs.createWriteStream(badgePath)
            response.pipe(badgeWriteStream)
            resolve()
          })
          .on("error", (error) => {
            reject(error)
          })
      })
      // eslint-disable-next-line github/no-then
      .catch((error) => {
        reject(error)
      })
  })
}
