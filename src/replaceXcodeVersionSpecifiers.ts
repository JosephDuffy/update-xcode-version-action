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
