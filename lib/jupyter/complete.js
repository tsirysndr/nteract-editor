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
const react_dom_1 = __importDefault(require("react-dom"));
const messaging_1 = require("@nteract/messaging");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const hint_1 = require("../components/hint");
const surrogate_1 = require("./surrogate");
// Hint picker
function pick(_cm, handle) {
    handle.pick();
}
exports.pick = pick;
function formChangeObject(cm, change) {
    return {
        cm,
        change
    };
}
exports.formChangeObject = formChangeObject;
// duplicate of default codemirror rendering logic for completions,
// except if the completion have a metadata._experimental key, dispatch to a new
// completer for these new values.
exports.expand_completions = (editor) => (results) => {
    let start = results.cursor_start;
    let end = results.cursor_end;
    if (end === null) {
        // adapted message spec replies don't have cursor position info,
        // interpret end=null as current position,
        // and negative start relative to that
        end = editor.indexFromPos(editor.getCursor());
        if (start === null) {
            start = end;
        }
        else if (start < 0) {
            start = end + start;
        }
    }
    else {
        // handle surrogate pairs
        // HACK: This seems susceptible to timing issues, we could verify changes in
        //       what's in the editor, as we'll be able to correlate across events
        //       Suggestions and background in https://github.com/nteract/nteract/pull/1840#discussion_r133380430
        const text = editor.getValue();
        end = surrogate_1.char_idx_to_js_idx(end, text);
        start = surrogate_1.char_idx_to_js_idx(start, text);
    }
    const from = editor.posFromIndex(start);
    const to = editor.posFromIndex(end);
    let matches = results.matches;
    // ipykernel may return experimental completion in the metadata field,
    // experiment with these. We use codemirror ability to take a rendering
    // function on a per completion basis (we can't give a global one :-( to
    // render not only the text, but the type as well.
    // as this is not documented in CM the DOM structure of the completer will be
    //
    // <ul class="CodeMirror-hints" >
    //  <li class="CodeMirror-hint"></li>
    //  <li class="CodeMirror-hint CodeMirror-hint-active"></li>
    //  <li class="CodeMirror-hint"></li>
    //  <li class="CodeMirror-hint"></li>
    // </ul>
    // with each <li/> passed as the first argument of render.
    if (results.metadata && results.metadata._jupyter_types_experimental) {
        matches = results.metadata._jupyter_types_experimental;
    }
    function render(elt, data, // Not used, it's the overall list of results
    // The "completion" result here is literally whatever object we return as
    // elements to the list return below, as CodeMirror uses this render
    // callback later
    completion) {
        react_dom_1.default.render(React.createElement(hint_1.Hint, Object.assign({}, completion)), elt);
    }
    return {
        list: matches.map((match) => {
            if (typeof match === "string") {
                return { to, from, text: match, render };
            }
            return Object.assign({ to,
                from,
                render }, match);
        }),
        from,
        to
    };
};
function codeCompleteObservable(channels, editor, message) {
    const completion$ = channels.pipe(messaging_1.childOf(message), messaging_1.ofMessageType("complete_reply"), operators_1.map(entry => entry.content), operators_1.first(), operators_1.map(exports.expand_completions(editor)), operators_1.timeout(15000) // Large timeout for slower languages; this is just here to make sure we eventually clean up resources
    );
    // On subscription, send the message
    return rxjs_1.Observable.create((observer) => {
        const subscription = completion$.subscribe(observer);
        channels.next(message);
        return subscription;
    });
}
exports.codeCompleteObservable = codeCompleteObservable;
exports.completionRequest = (code, cursorPos) => messaging_1.createMessage("complete_request", {
    content: {
        code,
        cursor_pos: cursorPos
    }
});
function codeComplete(channels, editor) {
    const cursor = editor.getCursor();
    let cursorPos = editor.indexFromPos(cursor);
    const code = editor.getValue();
    cursorPos = surrogate_1.js_idx_to_char_idx(cursorPos, code);
    const message = exports.completionRequest(code, cursorPos);
    return codeCompleteObservable(channels, editor, message);
}
exports.codeComplete = codeComplete;
