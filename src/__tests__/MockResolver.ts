import VersionResolver from "../VersionResolver"

export default class MockResolver implements VersionResolver {
  // eslint-disable-next-line require-await
  async resolveVersion(versionSpecifier: string): Promise<string> {
    const versionsMap = {
      beta: "12.3",
      latest: "12.2",
      "last-minor": "12.1",
      "last-major": "11.7",
    } as Record<string, string>

    if (versionsMap[versionSpecifier]) {
      return versionsMap[versionSpecifier]
    } else {
      throw Error(`Unknown version specifier ${versionSpecifier}`)
    }
  }
}
