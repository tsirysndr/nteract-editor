declare const _default: import("styled-components").GlobalStyleComponent<{}, import("styled-components").DefaultTheme>;
/**
 * Note that codemirror hint rendering is only controllable per entry within a list of
 * hints. The styling for our actual hint is in ../components/hint.tsx, but doesn't encompass
 * the .CodeMirror-hints container nor the individual entry .CodeMirror-hint.
 *
 * DOM structure wise, it looks like this:
 *
 * <ul class="CodeMirror-hints">
 *   <li class="CodeMirror-hint CodeMirror-hint-active">
 *     {elementWeControl}
 *   </li>
 *   <li class="CodeMirror-hint CodeMirror-hint-active">
 *     {anotherElementWeControl}
 *   </li>
 * </ul>
 */
export default _default;
