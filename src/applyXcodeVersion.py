#!/usr/bin/env python3

from ruamel.yaml import YAML
import argparse
import pathlib
import sys
from functools import reduce
from operator import getitem

# Credit: https://stackoverflow.com/a/14692747/657676
def getFromDict(dataDict, mapList):
    return reduce(getitem, mapList, dataDict)


def setInDict(dataDict, mapList, value):
    getFromDict(dataDict, mapList[:-1])[mapList[-1]] = value


parser = argparse.ArgumentParser(description="Apply Xcode version to YAML file")
parser.add_argument("yaml_key", nargs="+", help="Key in YAML file to update")
parser.add_argument("yaml_value", type=str, help="Value to set key to")

args = parser.parse_args()

key = args.yaml_key
value = args.yaml_value

yaml = YAML()
yaml.preserve_quotes = True
file = yaml.load(sys.stdin)

setInDict(file, key, value)

yaml.dump(file, sys.stdout)
