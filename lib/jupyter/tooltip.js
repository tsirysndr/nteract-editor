"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messaging_1 = require("@nteract/messaging");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const surrogate_1 = require("./surrogate");
function tooltipObservable(channels, _editor, message) {
    const tip$ = channels.pipe(messaging_1.childOf(message), messaging_1.ofMessageType("inspect_reply"), operators_1.map((entry) => entry.content), operators_1.first(), operators_1.map(results => ({
        dict: results.data
    })));
    // On subscription, send the message
    return rxjs_1.Observable.create((observer) => {
        const subscription = tip$.subscribe(observer);
        channels.next(message);
        return subscription;
    });
}
exports.tooltipObservable = tooltipObservable;
function tooltipRequest(code, cursorPos) {
    return messaging_1.createMessage("inspect_request", {
        content: {
            code,
            cursor_pos: cursorPos,
            detail_level: 0
        }
    });
}
exports.tooltipRequest = tooltipRequest;
function tool(channels, editor) {
    const cursor = editor.getCursor();
    // Get position while handling surrogate pairs
    const cursorPos = surrogate_1.js_idx_to_char_idx(editor.indexFromPos(cursor), editor.getValue());
    const code = editor.getValue();
    const message = tooltipRequest(code, cursorPos);
    return tooltipObservable(channels, editor, message);
}
exports.tool = tool;
