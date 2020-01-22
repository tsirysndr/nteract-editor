/// <reference types="react" />
import { MediaBundle } from "@nteract/commutable";
interface CursorCoords {
    top: number;
    left: number;
    bottom?: number;
}
interface Props {
    bundle: MediaBundle | null;
    cursorCoords: CursorCoords | null;
    deleteTip(): void;
}
export declare function Tooltip({ bundle, cursorCoords, deleteTip }: Props): JSX.Element | null;
export {};
