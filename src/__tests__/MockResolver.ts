import VersionResolver from "../VersionResolver"

export default class MockResolver implements VersionResolver {
  // eslint-disable-next-line require-await
  async resolveVersion(versionSpecifier: string): Promise<string | undefined> {
    const versionsMap = {
      beta: "12.3",
      latest: "12.2",
      "last-minor": "12.1",
      "last-major": "11.7",
    } as Record<string, string>

    return versionsMap[versionSpecifier]
  }
}
