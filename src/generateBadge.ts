import VersionResolver from "./VersionResolver"
import * as fs from "fs"
import https from "https"
import getBadgeURL from "./getBadgeURL"

export default async function generateBadge(
  badgePath: string,
  versions: string[],
  versionResolver: VersionResolver
): Promise<void> {
  const badgeURL = await getBadgeURL(versions, versionResolver)

  return new Promise((resolve, reject) => {
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
}
