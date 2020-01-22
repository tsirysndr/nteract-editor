"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// https://github.com/nteract/nteract/issues/389
const codemirror_1 = __importDefault(require("codemirror"));
require("codemirror/mode/meta");
require("codemirror/mode/python/python");
codemirror_1.default.defineMode("ipython", (conf, parserConf) => {
    const ipythonConf = Object.assign({}, parserConf, {
        name: "python",
        singleOperators: new RegExp("^[+\\-*/%&|@^~<>!?]"),
        identifiers: new RegExp("^[_A-Za-z\u00A1-\uFFFF][_A-Za-z0-9\u00A1-\uFFFF]*") // Technically Python3
    });
    return codemirror_1.default.getMode(conf, ipythonConf);
});
codemirror_1.default.defineMIME("text/x-ipython", "ipython");
