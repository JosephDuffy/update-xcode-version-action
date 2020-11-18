"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const toolsCache = __importStar(require("@actions/tool-cache"));
const core = __importStar(require("@actions/core"));
const exec_1 = require("@actions/exec");
class XcutilsVersionResolver {
    constructor(xcodeSearchPath) {
        this.hasDownloadedBinary = false;
        this.xcodeSearchPath = xcodeSearchPath;
    }
    resolveVersion(versionSpecifier) {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield this.run([
                "select",
                versionSpecifier,
                "--print-versions",
                "--output=json",
                `--search-path=${this.xcodeSearchPath}`,
            ]);
            core.debug(`Resolved versions for ${versionSpecifier}: ${json}`);
            const versions = JSON.parse(json);
            if (versions.length === 0) {
                throw Error(`No versions found matching ${versionSpecifier}`);
            }
            const version = versions[0];
            core.debug(`Resolved ${versionSpecifier} to ${JSON.stringify(version)}`);
            const path = version.path;
            const xcodeSplit = path.split("/Xcode_");
            if (xcodeSplit.length < 2) {
                throw Error(`Path does not contain "Xcode_": ${path}`);
            }
            const appSplit = xcodeSplit[1].split(".app");
            if (appSplit.length < 2) {
                throw Error(`Path does not contain ".app": ${path}`);
            }
            return appSplit[0];
        });
    }
    run(args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.hasDownloadedBinary) {
                yield this.pullXcutils();
            }
            let output = "";
            const options = {
                listeners: {
                    stdout: (data) => {
                        output += data.toString();
                    },
                },
            };
            yield exec_1.exec("xcutils", args, options);
            return output;
        });
    }
    pullXcutils() {
        return __awaiter(this, void 0, void 0, function* () {
            const version = "v0.1.2-rc2";
            const xcutilsZipPath = yield toolsCache.downloadTool(`https://github.com/JosephDuffy/xcutils/releases/download/${version}/xcutils.zip`);
            const xcutilsFolder = yield toolsCache.extractZip(xcutilsZipPath, "/usr/local/bin");
            core.addPath(xcutilsFolder);
            this.hasDownloadedBinary = true;
        });
    }
}
exports.default = XcutilsVersionResolver;
