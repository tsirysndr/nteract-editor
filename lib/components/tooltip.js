"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const outputs_1 = require("@nteract/outputs");
const React = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const TipButton = styled_components_1.default.button `
  float: right;
  font-size: 11.5px;
  position: absolute;
  right: 0px;
  top: 0px;
`;
const Tip = styled_components_1.default.div `
  background-color: var(--theme-app-bg, #2b2b2b);
  box-shadow: 2px 2px 50px rgba(0, 0, 0, 0.2);
  float: right;
  height: auto;
  left: ${(props) => props.cursorCoords.left}px;
  margin: 30px 20px 50px 20px;
  padding: 20px 20px 50px 20px;
  position: absolute;
  top: ${(props) => props.cursorCoords.top}px;
  white-space: pre-wrap;
  width: auto;
  z-index: 9999999;
`;
function Tooltip({ bundle, cursorCoords, deleteTip }) {
    return bundle && cursorCoords ? (React.createElement(Tip, { className: "CodeMirror-hint", tabIndex: 0, onKeyDown: e => {
            e.key === "Escape" ? deleteTip() : null;
        }, cursorCoords: cursorCoords },
        React.createElement(outputs_1.RichMedia, { data: bundle, metadata: { expanded: true } },
            React.createElement(outputs_1.Media.Markdown, null),
            React.createElement(outputs_1.Media.Plain, null)),
        React.createElement(TipButton, { onClick: deleteTip }, "\u2715"))) : null;
}
exports.Tooltip = Tooltip;
