import { StyledComponent } from "styled-components";
/**
 * This is the <textarea /> we let CodeMirror hijack.
 *
 * This also provides a decent server-side renderable <textarea /> that matches
 * the style of our CodeMirror editor.
 */
export declare const TextArea: StyledComponent<"textarea", any, {
    autoComplete: "off";
}, "autoComplete">;
export { TextArea as InitialTextArea };
