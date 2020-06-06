import VersionResolver from "../VersionResolver"

export default class MockResolver implements VersionResolver {
  // eslint-disable-next-line require-await
  async resolveVersion(versionSpecifier: string): Promise<string> {
    const versionsMap = {
      beta: "11.4-beta",
      latest: "11.3",
      "last-minor": "11.2.1",
      "last-major": "10.3",
    } as Record<string, string>

    if (versionsMap[versionSpecifier]) {
      return versionsMap[versionSpecifier]
    } else {
      throw Error(`Unknown version specifier ${versionSpecifier}`)
    }
  }
}
