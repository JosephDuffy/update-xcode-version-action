import VersionResolver from "./VersionResolver"

export async function replaceXcodeVersionSpecifiers(
  record: Record<string, unknown>,
  versionResolver: VersionResolver
): Promise<Record<string, unknown>> {
  let modifiedRecord = record

  for (const key in record) {
    const value = record[key] as Record<string, unknown>

    if (Array.isArray(value)) {
      const resolvedVersions = await Promise.all(
        value.map((versionSpecifier) => {
          return versionResolver.resolveVersion(versionSpecifier)
        })
      )
      modifiedRecord[key] = resolvedVersions
    } else {
      modifiedRecord = await replaceXcodeVersionSpecifiers(
        value,
        versionResolver
      )
    }
  }

  return modifiedRecord
}
