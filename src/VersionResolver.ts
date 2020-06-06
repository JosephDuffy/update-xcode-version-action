export default interface VersionResolver {
  resolveVersion(version: string): Promise<string>
}
