"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Declare which options we allow being configured
exports.configurableCodeMirrorOptions = {
    // Do nothing with value, we handle it in a separately managed way
    value: false,
    mode: true,
    // We don't allow overriding the theme as we use this to help theme codemirror
    theme: false,
    indentUnit: true,
    smartIndent: true,
    tabSize: true,
    indentWithTabs: true,
    electricChars: true,
    rtlMoveVisually: true,
    keyMap: true,
    // We're in control of `extraKeys` since we need to bind them to our events
    extraKeys: false,
    lineWrapping: true,
    lineNumbers: true,
    firstLineNumber: true,
    lineNumberFormatter: true,
    gutters: true,
    fixedGutter: true,
    readOnly: true,
    showCursorWhenSelecting: true,
    undoDepth: true,
    historyEventDelay: true,
    tabindex: true,
    autofocus: true,
    dragDrop: true,
    onDragEvent: true,
    onKeyEvent: true,
    cursorBlinkRate: true,
    cursorHeight: true,
    workTime: true,
    workDelay: true,
    pollInterval: true,
    flattenSpans: true,
    maxHighlightLength: true,
    viewportMargin: true,
    lint: true,
    placeholder: true,
    // CodeMirror addon configurations
    showHint: true,
    // We don't want overriding of the hint behavior
    hintOptions: false
};
function isConfigurable(option) {
    return !!exports.configurableCodeMirrorOptions[option];
}
exports.isConfigurable = isConfigurable;
