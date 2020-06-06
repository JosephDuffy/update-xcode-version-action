import VersionResolver from "./VersionResolver"
import replaceXcodeVersionSpecifiers from "./replaceXcodeVersionSpecifiers"

export default async function mergeWorkflowWithXcodeVersionSpecifiers(
  workflow: Record<string, unknown>,
  keyPaths: Record<string, unknown>,
  versionResolver: VersionResolver
): Promise<Record<string, unknown>> {
  const resolvedKeyPaths = await replaceXcodeVersionSpecifiers(
    keyPaths,
    versionResolver
  )
  return mergeWorkflowWithXcodeVersions(workflow, resolvedKeyPaths)
}

export function mergeWorkflowWithXcodeVersions(
  workflow: Record<string, unknown>,
  xcodeVersions: Record<string, unknown>
): Record<string, unknown> {
  for (const key in xcodeVersions) {
    const value = xcodeVersions[key] as Record<string, unknown>

    if (Array.isArray(value)) {
      workflow[key] = value
    } else {
      const resolvedValues = mergeWorkflowWithXcodeVersions(
        workflow[key] as Record<string, unknown>,
        value
      )
      workflow[key] = resolvedValues
    }
  }

  return workflow
}
