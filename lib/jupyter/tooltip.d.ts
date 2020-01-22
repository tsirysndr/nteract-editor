import { Channels, JupyterMessage } from "@nteract/messaging";
import { Doc, Editor } from "codemirror";
export declare function tooltipObservable(channels: Channels, _editor: Editor & Doc, message: JupyterMessage): any;
export declare function tooltipRequest(code: string, cursorPos: number): JupyterMessage<"inspect_request", any>;
export declare function tool(channels: Channels, editor: Editor & Doc): any;
