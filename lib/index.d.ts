import { MediaBundle } from "@nteract/commutable";
import { Channels } from "@nteract/messaging";
import CodeMirror, { Doc, Editor, EditorChangeLinkedList, EditorFromTextArea } from "codemirror";
import { FullEditorConfiguration } from "./configurable";
import * as React from "react";
import { Subject, Subscription } from "rxjs";
import CodeMirrorCSS from "./vendored/codemirror";
import ShowHintCSS from "./vendored/show-hint";
export { CodeMirrorCSS, ShowHintCSS };
export interface EditorKeyEvent {
    editor: Editor;
    ev: KeyboardEvent;
}
export declare type CodeMirrorEditorProps = {
    preserveScrollPosition: boolean;
    editorFocused: boolean;
    completion: boolean;
    tip?: boolean;
    focusAbove?: (instance: Editor) => void;
    focusBelow?: (instance: Editor) => void;
    theme: string;
    channels?: Channels | null;
    kernelStatus: string;
    onChange?: (value: string, change: EditorChangeLinkedList) => void;
    onFocusChange?: (focused: boolean) => void;
    value: string;
    editorType: "codemirror";
} & Partial<FullEditorConfiguration>;
interface CodeMirrorEditorState {
    bundle: MediaBundle | null;
    cursorCoords: {
        top: number;
        left: number;
        bottom: number;
    } | null;
}
interface CodeCompletionEvent {
    editor: Editor & Doc;
    callback: (completionResult: any) => {};
    debounce: boolean;
}
export default class CodeMirrorEditor extends React.PureComponent<CodeMirrorEditorProps, CodeMirrorEditorState> {
    static defaultProps: Partial<CodeMirrorEditorProps>;
    textarea?: HTMLTextAreaElement | null;
    cm: EditorFromTextArea;
    defaultOptions: FullEditorConfiguration;
    completionSubject: Subject<CodeCompletionEvent>;
    completionEventsSubscriber: Subscription;
    debounceNextCompletionRequest: boolean;
    textareaRef: React.RefObject<HTMLTextAreaElement>;
    tooltipNode: HTMLDivElement | null;
    constructor(props: CodeMirrorEditorProps);
    fullOptions(defaults?: FullEditorConfiguration): FullEditorConfiguration;
    cleanMode(): string | object;
    componentWillMount(): void;
    componentDidMount(): void;
    componentDidUpdate(prevProps: CodeMirrorEditorProps): void;
    componentWillReceiveProps(nextProps: CodeMirrorEditorProps): void;
    componentWillUnmount(): void;
    focusChanged(focused: boolean): void;
    hint(editor: Editor & Doc, callback: () => {}): void;
    deleteTip(): void;
    handleCursorChange: (editor: CodeMirror.Editor) => void;
    tips(editor: Editor & Doc): void;
    goLineDownOrEmit(editor: Editor & Doc): void;
    goLineUpOrEmit(editor: Editor & Doc): void;
    executeTab(editor: Editor & Doc): void;
    codemirrorValueChanged(doc: Editor, change: EditorChangeLinkedList): void;
    render(): JSX.Element;
}
