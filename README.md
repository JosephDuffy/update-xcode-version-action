# update-xcode-version-action

![Tests](https://github.com/JosephDuffy/update-xcode-version-action/workflows/Tests/badge.svg)
[![codecov](https://codecov.io/gh/JosephDuffy/update-xcode-version-action/branch/master/graph/badge.svg)](https://codecov.io/gh/JosephDuffy/update-xcode-version-action)

`update-xcode-version-action` is a GitHub actions that utilises [`xcutils`](https://github.com/JosephDuffy/xcutils) to automate the creation of pull requests when a new Xcode version is available (on GitHub actions).

It can be configured to update GitHub actions workflow files and create a pull request with the changes.

Thanks to `xcutils` [versions can be specified as `latest`, `beta`, `last-minor`, etc.](https://github.com/JosephDuffy/xcutils#version-specifiers), allowing for a single configuration to continue working without the need for extra tweaking. **You can think of your versions specification as a lock file for Xcode versions**.

## Configuration

Xcode versions are configured using a yaml file. By default the action will look for a file at `.github/xcode-versions.yml`, but you can configure it to look elsewhere.

For example to have a release workflow use the latest Xcode and tests to use the next available beta and the last minor version you can create a yaml file such as:

```yaml
workflows:
  workflows/test.yml:
    jobs:
      run_tests:
        strategy:
          matrix:
            xcode:
              - last-minor
              - latest
              - beta

  workflows/release.yml:
    jobs:
      release:
        strategy:
          matrix:
            xcode:
              - latest
```

This would update a workflow file with the following structure:

```yaml
name: Tests

on: [push]

jobs:
  run_tests:
    name: Run Tests
    runs-on: macos-latest
    strategy:
      fail-fast: false
      matrix:
        xcode: ["11.1", "11.2.1", "11.3-beta"]

    steps:
      - uses: actions/checkout@v2

      - name: Select Xcode ${{ matrix.xcode }}
        run: sudo xcode-select --switch /Applications/Xcode_${{ matrix.xcode }}.app

      run: xcodebuild ... # Run your tests
```

Running a check for updates can be done automatically or manually by adding a new workflow to the project that runs the `update-xcode-version-action` action, e.g.:

```yaml
name: "Check for Xcode Updates"

on:
  # Allow to be run manually
  workflow_dispatch:

  # Run at 8am UTC daily
  schedule:
    - cron: "0 8 * * *"

jobs:
  update-xcode-versions:
    name: Check for Xcode Updates
    runs-on: macOS-latest
    steps:
      - uses: actions/checkout@v2

      - name: Update Xcode Versions
        uses: josephduffy/update-xcode-version-action@master
        with:
          xcode-versions-file: .github/xcode-versions.yml # Default, not required, but can be changed
```

When `update-xcode-version-action` discovers a change in the resolved versions it will create a pull request with the changes.
