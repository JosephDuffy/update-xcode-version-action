import VersionResolver from "./VersionResolver"
import * as core from "@actions/core"

/**
 * Recursively replace Xcode version specifiers with their resolved version.
 * @param record
 * @param versionResolver
 */
export default async function replaceXcodeVersionSpecifiers(
  record: Record<string, unknown>,
  versionResolver: VersionResolver
): Promise<Record<string, unknown>> {
  for (const key in record) {
    const value = record[key] as Record<string, unknown>

    if (Array.isArray(value)) {
      const resolvedVersions: string[] = []

      for (let index = 0; index < value.length; index++) {
        const versionSpecifier = value[index]
        try {
          core.debug(`Attempting to resolve ${versionSpecifier}`)
          const resolvedVersion = await versionResolver.resolveVersion(
            versionSpecifier
          )
          core.debug(`Resolved ${versionSpecifier} as ${resolvedVersion}`)
          resolvedVersions[index] = resolvedVersion
        } catch (error) {
          core.info(
            `Ignoring ${value} because of error resolving version: ${error}`
          )
          resolvedVersions[index] = versionSpecifier
        }
      }

      record[key] = resolvedVersions
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
