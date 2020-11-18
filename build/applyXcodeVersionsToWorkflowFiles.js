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
const mergeWorkflowWithXcodeVersionSpecifiers_1 = __importDefault(require("./mergeWorkflowWithXcodeVersionSpecifiers"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const yaml = __importStar(require("yaml"));
const core = __importStar(require("@actions/core"));
function applyXcodeVersionsToWorkflowFiles(workflowFileKeyPaths, rootPath, versionResolver) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const fileName in workflowFileKeyPaths) {
            const keyPaths = workflowFileKeyPaths[fileName];
            const workflowFilePath = path.resolve(rootPath, fileName);
            core.debug(`Resolved workflow file "${fileName}" against "${rootPath}": "${workflowFilePath}"`);
            const workflowFileContents = fs.readFileSync(workflowFilePath, "utf8");
            const workflow = yaml.parse(workflowFileContents);
            const modifiedWorkflow = yield mergeWorkflowWithXcodeVersionSpecifiers_1.default(workflow, keyPaths, versionResolver);
            const modifiedWorkflowYAML = yaml.stringify(modifiedWorkflow);
            fs.writeFileSync(workflowFilePath, modifiedWorkflowYAML, "utf8");
        }
    });
}
exports.default = applyXcodeVersionsToWorkflowFiles;
