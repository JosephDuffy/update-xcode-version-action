# update-xcode-version-action

![Tests](https://github.com/JosephDuffy/update-xcode-version-action/workflows/Tests/badge.svg)
[![codecov](https://codecov.io/gh/JosephDuffy/update-xcode-version-action/branch/master/graph/badge.svg)](https://codecov.io/gh/JosephDuffy/update-xcode-version-action)

`update-xcode-version-action` is a GitHub actions that utilises [`xcutils`](https://github.com/JosephDuffy/xcutils) to automate the creation of pull requests when a new Xcode version is available (on GitHub actions).

It can be configured to update an Xcode project, GitHub actions workflow files, or both.

Thanks to `xcutils` versions can be specified as `latest`, `beta`, `last-minor`, etc., allowing for a single configuration to continue working without the need for extra tweaking. You can think of your versions specification as a lock file for Xcode versions.

For example, say you wish to always have the project use the latest Xcode, but you want to test on the next available beta and the last minor version, you can create a yaml file such as `.github/xcode-versions.yml`:

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

projects:
  TestProject.xcproject:
    - latest
```

Now with an example workflow:

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

Adding another workflow to run nightly will enable `update-xcode-version-action`:

```yaml
name: "Check for Xcode Updates"

on:
  schedule:
    # Check for updates at 8am UTC every day
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
          xcode-versions-file: .github/xcode-versions.yml
```