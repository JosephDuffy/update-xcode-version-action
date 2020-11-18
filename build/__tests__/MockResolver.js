"use strict";
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
class MockResolver {
    // eslint-disable-next-line require-await
    resolveVersion(versionSpecifier) {
        return __awaiter(this, void 0, void 0, function* () {
            const versionsMap = {
                beta: "11.4-beta",
                latest: "11.3",
                "last-minor": "11.2.1",
                "last-major": "10.3",
            };
            if (versionsMap[versionSpecifier]) {
                return versionsMap[versionSpecifier];
            }
            else {
                throw Error(`Unknown version specifier ${versionSpecifier}`);
            }
        });
    }
}
exports.default = MockResolver;
