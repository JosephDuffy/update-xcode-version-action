import VersionResolver from "./VersionResolver"
import * as core from "@actions/core"

export default async function replaceXcodeVersionSpecifiers(
  record: Record<string, unknown>,
  versionResolver: VersionResolver
): Promise<Record<string, unknown>> {
  for (const key in record) {
    const value = record[key] as Record<string, unknown>

    if (Array.isArray(value)) {
      try {
        const resolvedVersions = await Promise.all(
          value.map((versionSpecifier) => {
            return versionResolver.resolveVersion(versionSpecifier)
          })
        )
        record[key] = resolvedVersions
      } catch (error) {
        core.info(
          `Ignoring ${value} because of error resolving version: ${error}`
        )
      }
    } else {
      const resolvedValues = await replaceXcodeVersionSpecifiers(
        value,
        versionResolver
      )
      record[key] = resolvedValues
    }
  }

  return record
}
