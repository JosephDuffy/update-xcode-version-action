import VersionResolver from "./VersionResolver"

export default async function getBadgeURL(
  versions: string[],
  versionResolver: VersionResolver
): Promise<string> {
  const resolvedVersionPromises = versions.map((v) =>
    versionResolver.resolveVersion(v)
  )

  const resolvedVersions = await Promise.all(resolvedVersionPromises)
  const displayResolvedVersions = encodeURI(
    resolvedVersions.filter((v) => v !== undefined).join(" | ")
  )

  return `https://img.shields.io/badge/Xcode-${displayResolvedVersions}-success`
}
