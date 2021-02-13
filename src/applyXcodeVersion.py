#!/usr/bin/env python3

from ruamel.yaml import YAML
from ruamel.yaml.scalarstring import SingleQuotedScalarString, DoubleQuotedScalarString
import argparse
import pathlib
import sys
from enum import Enum
from functools import reduce
from operator import getitem

# Credit: https://stackoverflow.com/a/14692747/657676
def getFromDict(dataDict, mapList):
    return reduce(getitem, mapList, dataDict)


def setInDict(dataDict, mapList, value):
    getFromDict(dataDict, mapList[:-1])[mapList[-1]] = value


class Quotes(Enum):
    single = "single"
    double = "double"

    def __str__(self):
        return self.value


parser = argparse.ArgumentParser(description="Apply Xcode version to YAML file")
parser.add_argument("yaml_key", nargs="+", help="Key in YAML file to update")
parser.add_argument("--yaml_value", nargs="+", help="Value to set key to")
parser.add_argument(
    "--yaml_file",
    type=str,
    help="The file to update. If not provided will read from stdin and write to stdout",
)
parser.add_argument(
    "--quotes", type=Quotes, choices=list(Quotes), default=Quotes.double
)

args = parser.parse_args()

key = args.yaml_key
value = args.yaml_value
quotes = args.quotes

yaml = YAML()
# Do not modify long lines
yaml.width = 9999999
yaml.preserve_quotes = True
yaml.indent(mapping=2, sequence=4, offset=2)

yaml_file = None

if args.yaml_file:
    yaml_file = pathlib.Path(args.yaml_file)
    file = yaml.load(yaml_file)
else:
    file = yaml.load(sys.stdin)

existing_value = getFromDict(file, key[:-1])[key[-1]]

if yaml_file:
    print("Existing key", key, "has value", existing_value)

if existing_value != value:
    if quotes == Quotes.single:
        setInDict(
            file, key, list(map(lambda value: SingleQuotedScalarString(value), value))
        )
    else:
        setInDict(
            file, key, list(map(lambda value: DoubleQuotedScalarString(value), value))
        )
elif yaml_file:
    print("Key has not changed")

if yaml_file:
    yaml.dump(file, yaml_file)
else:
    yaml.dump(file, sys.stdout)
