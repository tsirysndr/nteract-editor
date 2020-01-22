/// <reference types="react" />
import { StyledComponent } from "styled-components";
interface TypeIconProps {
    type?: "module" | "keyword" | "statement" | "function" | "instance" | "null" | "class" | string;
}
interface HintProps {
    text: string;
    type?: TypeIconProps["type"];
    displayText?: string;
    [other: string]: any;
}
export declare function Hint(props: HintProps): JSX.Element;
/**
 * An Icon to show before a code hint to show the type
 * (e.g. Module, Keyword, etc.)
 */
export declare const TypeIcon: StyledComponent<"span", any, TypeIconProps>;
export {};
