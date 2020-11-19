import mergeWorkflowWithXcodeVersionSpecifiers, {
  mergeWorkflowWithXcodeVersions,
} from "../mergeWorkflowWithXcodeVersionSpecifiers"
import MockResolver from "./MockResolver"

test("mergeWorkflowWithXcodeVersionSpecifiers", async () => {
  const workflow = {
    "level-1-a": {
      "level-1-a-1": ["11.2", "11.3-beta"],
      "level-1-a-2": {
        "misc-key": true,
        "level-1-a-2-1": ["11.1"],
        "unknown-specifiers-array": ["another-string"],
      },
    },
  }
  const keyPaths = {
    "level-1-a": {
      "level-1-a-1": ["latest", "beta"],
      "level-1-a-2": {
        "level-1-a-2-1": ["last-minor"],
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
  const result = await mergeWorkflowWithXcodeVersionSpecifiers(
    workflow,
    keyPaths,
    resolver
  )
  expect(result).toEqual(expectedOutput)
})

test("mergeWorkflowWithXcodeVersions", () => {
  const workflow = {
    "level-1-a": {
      "level-1-a-1": ["11.2", "11.3-beta"],
      "level-1-a-2": {
        "misc-key": true,
        "level-1-a-2-1": ["11.1"],
        "unknown-specifiers-array": ["another-string"],
      },
    },
  }
  const xcodeVersions = {
    "level-1-a": {
      "level-1-a-1": ["11.3", "11.4-beta"],
      "level-1-a-2": {
        "level-1-a-2-1": ["11.2.1"],
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

  const result = mergeWorkflowWithXcodeVersions(workflow, xcodeVersions)
  expect(result).toEqual(expectedOutput)
})
