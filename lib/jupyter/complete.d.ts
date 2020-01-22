import { JupyterMessage } from "@nteract/messaging";
import { Channels } from "@nteract/messaging";
import { Doc, Position } from "codemirror";
export declare function pick(_cm: any, handle: {
    pick: () => void;
}): void;
export declare function formChangeObject<T, U>(cm: T, change: U): {
    cm: T;
    change: U;
};
interface CompletionResult {
    end: number;
    start: number;
    type: string;
    text: string;
    displayText?: string;
}
declare type CompletionMatch = string | CompletionResult;
interface CompletionResults {
    cursor_start: number;
    cursor_end: number;
    matches: CompletionMatch[];
    metadata?: {
        _jupyter_types_experimental?: any;
    };
}
export declare const expand_completions: (editor: Doc) => (results: CompletionResults) => {
    list: ({
        to: Position;
        from: Position;
        text: string;
        render: (elt: HTMLElement, data: any, completion: {
            text: string;
            type?: string | undefined;
        }) => void;
    } | {
        end: number;
        start: number;
        type: string;
        text: string;
        displayText?: string | undefined;
        to: Position;
        from: Position;
        render: (elt: HTMLElement, data: any, completion: {
            text: string;
            type?: string | undefined;
        }) => void;
    })[];
    from: Position;
    to: Position;
};
export declare function codeCompleteObservable(channels: Channels, editor: Doc, message: JupyterMessage): any;
export declare const completionRequest: (code: string, cursorPos: number) => JupyterMessage<"complete_request", any>;
export declare function codeComplete(channels: Channels, editor: Doc): any;
export {};
