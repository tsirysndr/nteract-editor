import { EditorConfiguration } from "codemirror";
declare type FullEditorConfiguration = EditorConfiguration & {
    showHint?: boolean;
    hintOptions?: any;
    matchBrackets?: boolean;
};
export { FullEditorConfiguration };
export declare const configurableCodeMirrorOptions: {
    [k in keyof FullEditorConfiguration]: boolean;
};
export declare function isConfigurable(option: any): option is keyof EditorConfiguration;
