import VersionResolver from "./VersionResolver"
import { replaceXcodeVersionSpecifiers } from "./replaceXcodeVersionSpecifiers"

export default async function setXcodeVersionsInWorkflow(
  workflow: Record<string, unknown>,
  keyPaths: Record<string, unknown>,
  versionResolver: VersionResolver
): Promise<Record<string, unknown>> {
  const resolvedKeyPaths = replaceXcodeVersionSpecifiers(
    keyPaths,
    versionResolver
  )
  return { ...workflow, ...resolvedKeyPaths }
}
