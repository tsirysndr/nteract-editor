"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const styled_components_1 = __importDefault(require("styled-components"));
/**
 * This is the <textarea /> we let CodeMirror hijack.
 *
 * This also provides a decent server-side renderable <textarea /> that matches
 * the style of our CodeMirror editor.
 */
exports.TextArea = styled_components_1.default.textarea.attrs({
    autoComplete: "off",
    ariaLabel: "codemirror-textarea"
}) `
  font-family: "Dank Mono", dm, "Source Code Pro", "Monaco", monospace;
  font-size: 14px;
  line-height: 20px;

  height: inherit;

  background: none;

  border: none;
  overflow: hidden;

  -webkit-scrollbar: none;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  width: 100%;
  resize: none;
  padding: 10px 0 5px 10px;
  letter-spacing: 0.3px;
  word-spacing: 0px;

  &:focus {
    outline: none;
    border: none;
  }
`;
exports.InitialTextArea = exports.TextArea;
