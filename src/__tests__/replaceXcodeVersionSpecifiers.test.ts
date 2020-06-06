import replaceXcodeVersionSpecifiers from "../replaceXcodeVersionSpecifiers"
import MockResolver from "./MockResolver"

test("replaceXcodeVersionSpecifiers", async () => {
  const input = {
    "level-1-a": {
      "level-1-a-1": ["latest", "beta"],
      "level-1-a-2": {
        "misc-key": true,
        "level-1-a-2-1": ["last-minor"],
        "unknown-specifiers-array": ["another-string"],
      },
    },
  }
  const expectedOutput = {
    "level-1-a": {
      "level-1-a-1": ["11.3", "11.4-beta"],
      "level-1-a-2": {
        "misc-key": true,
        "level-1-a-2-1": ["11.2.1"],
        "unknown-specifiers-array": ["another-string"],
      },
    },
  }

  const resolver = new MockResolver()
  const result = await replaceXcodeVersionSpecifiers(input, resolver)
  expect(result).toEqual(expectedOutput)
})
