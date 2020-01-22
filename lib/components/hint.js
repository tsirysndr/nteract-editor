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
const React = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
// Completion to us, "hint" to codemirror
function Hint(props) {
    return (React.createElement(React.Fragment, null,
        props.type ? React.createElement(exports.TypeIcon, { type: props.type }) : null,
        props.displayText || props.text));
}
exports.Hint = Hint;
/**
 * An Icon to show before a code hint to show the type
 * (e.g. Module, Keyword, etc.)
 */
exports.TypeIcon = styled_components_1.default.span.attrs(props => ({
    className: `completion-type-${props.type}`,
    title: props.type
})) `
  & {
    background: transparent;
    border: transparent 1px solid;
    width: 17px;
    height: 17px;
    margin: 0;
    padding: 0;
    display: inline-block;
    margin-right: 5px;
    top: 18px;
  }

  &:before {
    /* When experimental type completion isn't available render the left side as "nothing" */
    content: " ";
    bottom: 1px;
    left: 4px;
    position: relative;
    color: white;
  }
  /* color and content for each type of completion */
  &.completion-type-keyword:before {
    content: "K";
  }
  &.completion-type-keyword {
    background-color: darkred;
  }
  &.completion-type-class:before {
    content: "C";
  }
  &.completion-type-class {
    background-color: blueviolet;
  }
  &.completion-type-module:before {
    content: "M";
  }
  &.completion-type-module {
    background-color: chocolate;
  }
  &.completion-type-statement:before {
    content: "S";
  }
  &.completion-type-statement {
    background-color: forestgreen;
  }
  &.completion-type-function:before {
    content: "ƒ";
  }
  &.completion-type-function {
    background-color: yellowgreen;
  }
  &.completion-type-instance:before {
    content: "I";
  }
  &.completion-type-instance {
    background-color: teal;
  }
  &.completion-type-null:before {
    content: "ø";
  }
  &.completion-type-null {
    background-color: black;
  }
`; // Somehow setting the type on `attrs` isn't propagating properly
