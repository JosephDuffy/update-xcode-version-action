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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const core = __importStar(require("@actions/core"));
const path = __importStar(require("path"));
const XcutilsVersionResolver_1 = __importDefault(require("./XcutilsVersionResolver"));
const applyXcodeVersionsFile_1 = __importDefault(require("./applyXcodeVersionsFile"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const workspacePath = process.env["GITHUB_WORKSPACE"];
            if (workspacePath === undefined) {
                throw new Error("GITHUB_WORKSPACE environment variable not available");
            }
            const xcodeVersionsFile = core.getInput("xcode-versions-file", {
                required: true,
            });
            core.debug(`xcode-versions-file input: ${xcodeVersionsFile}`);
            const xcodeSearchPathInput = core.getInput("xcode-search-path");
            core.debug(`xcode-search-path input: ${xcodeSearchPathInput.length > 0 ? xcodeSearchPathInput : "not provided"}`);
            const xcodeSearchPath = path.resolve(workspacePath, xcodeSearchPathInput.length > 0 ? xcodeSearchPathInput : "/Applications");
            core.debug(`Resolved Xcode search path "${xcodeSearchPathInput}" against workspace "${workspacePath}": "${xcodeSearchPath}`);
            // The path to the file that describes which workflow and Xcode projects files to update
            const xcodeVersionsFilePath = path.resolve(workspacePath, xcodeVersionsFile);
            const xcutilsVersionResolver = new XcutilsVersionResolver_1.default(xcodeSearchPath);
            yield applyXcodeVersionsFile_1.default(xcodeVersionsFilePath, xcutilsVersionResolver);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
exports.run = run;
/* istanbul ignore next */
if (process.env.NODE_ENV !== "test") {
    run();
}
