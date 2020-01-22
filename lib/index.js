"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const codemirror_1 = __importDefault(require("codemirror"));
const configurable_1 = require("./configurable");
const lodash_debounce_1 = __importDefault(require("lodash.debounce"));
const React = __importStar(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const complete_1 = require("./jupyter/complete");
const tooltip_1 = require("./jupyter/tooltip");
const initial_text_area_1 = require("./components/initial-text-area");
const tooltip_2 = require("./components/tooltip");
const codemirror_2 = __importDefault(require("./vendored/codemirror"));
exports.CodeMirrorCSS = codemirror_2.default;
const show_hint_1 = __importDefault(require("./vendored/show-hint"));
exports.ShowHintCSS = show_hint_1.default;
function normalizeLineEndings(str) {
    if (!str) {
        return str;
    }
    return str.replace(/\r\n|\r/g, "\n");
}
class CodeMirrorEditor extends React.PureComponent {
    constructor(props) {
        super(props);
        this.textareaRef = React.createRef();
        this.tooltipNode = null;
        this.handleCursorChange = (editor) => {
            const cursorCoords = editor.cursorCoords();
            this.setState({ cursorCoords });
        };
        this.hint = this.hint.bind(this);
        this.hint.async = true;
        this.tips = this.tips.bind(this);
        this.deleteTip = this.deleteTip.bind(this);
        this.debounceNextCompletionRequest = true;
        this.state = {
            bundle: null,
            cursorCoords: null
        };
        this.fullOptions = this.fullOptions.bind(this);
        this.cleanMode = this.cleanMode.bind(this);
        // Bind our events to codemirror
        const extraKeys = {
            "Cmd-.": this.tips,
            "Cmd-/": "toggleComment",
            "Ctrl-.": this.tips,
            "Ctrl-/": "toggleComment",
            "Ctrl-Space": (editor) => {
                this.debounceNextCompletionRequest = false;
                return editor.execCommand("autocomplete");
            },
            Down: this.goLineDownOrEmit,
            "Shift-Tab": (editor) => editor.execCommand("indentLess"),
            Tab: this.executeTab,
            Up: this.goLineUpOrEmit,
            Esc: this.deleteTip
        };
        const hintOptions = {
            // In automatic autocomplete mode we don't want override
            completeSingle: false,
            extraKeys: {
                Right: complete_1.pick
            },
            hint: this.hint
        };
        this.defaultOptions = Object.assign({
            extraKeys,
            hintOptions,
            // This sets the class on the codemirror <div> that gets created to
            // cm-s-composition
            theme: "composition",
            lineWrapping: true
        });
    }
    fullOptions(defaults = {}) {
        // Only pass to codemirror the options we support
        return Object.keys(this.props)
            .filter(configurable_1.isConfigurable)
            .reduce((obj, key) => {
            obj[key] = this.props[key];
            return obj;
        }, defaults);
    }
    cleanMode() {
        if (!this.props.mode) {
            return "text/plain";
        }
        if (typeof this.props.mode === "string") {
            return this.props.mode;
        }
        // If the mode comes in as an immutable map, convert it first
        if (typeof this.props.mode === "object" && "toJS" in this.props.mode) {
            return this.props.mode.toJS();
        }
        return this.props.mode;
    }
    componentWillMount() {
        this.componentWillReceiveProps = lodash_debounce_1.default(this.componentWillReceiveProps, 0);
    }
    componentDidMount() {
        require("codemirror/addon/hint/show-hint");
        require("codemirror/addon/hint/anyword-hint");
        require("codemirror/addon/edit/matchbrackets");
        require("codemirror/addon/edit/closebrackets");
        require("codemirror/addon/comment/comment");
        require("codemirror/mode/python/python");
        require("codemirror/mode/ruby/ruby");
        require("codemirror/mode/javascript/javascript");
        require("codemirror/mode/css/css");
        require("codemirror/mode/julia/julia");
        require("codemirror/mode/r/r");
        require("codemirror/mode/clike/clike");
        require("codemirror/mode/shell/shell");
        require("codemirror/mode/sql/sql");
        require("codemirror/mode/markdown/markdown");
        require("codemirror/mode/gfm/gfm");
        require("./mode/ipython");
        const { editorFocused, focusAbove, focusBelow } = this.props;
        // ensure a single tooltip holder exists on document.body
        const tipHolder = document.getElementsByClassName("tip-holder")[0];
        if (!tipHolder) {
            this.tooltipNode = document.createElement("div");
            this.tooltipNode.classList.add("tip-holder");
            document.body.appendChild(this.tooltipNode);
        }
        else {
            this.tooltipNode = tipHolder;
        }
        // Set up the initial options with both our defaults and all the ones we
        // allow to be passed in
        const options = Object.assign(Object.assign(Object.assign({}, this.fullOptions()), this.defaultOptions), { mode: this.cleanMode() });
        this.cm = codemirror_1.default.fromTextArea(this.textareaRef.current, options);
        this.cm.setValue(this.props.value || "");
        // On first load, if focused, set codemirror to focus
        if (editorFocused) {
            this.cm.focus();
        }
        this.cm.on("topBoundary", (editor) => {
            this.deleteTip();
            focusAbove && focusAbove(editor);
        });
        this.cm.on("bottomBoundary", (editor) => {
            this.deleteTip();
            focusBelow && focusBelow(editor);
        });
        this.cm.on("cursorActivity", this.handleCursorChange);
        this.cm.on("focus", this.focusChanged.bind(this, true));
        this.cm.on("blur", this.focusChanged.bind(this, false));
        this.cm.on("change", this.codemirrorValueChanged.bind(this));
        this.completionSubject = new rxjs_1.Subject();
        // tslint:disable no-shadowed-variable
        const [debounce, immediate] = operators_1.partition(ev => ev.debounce === true)(this.completionSubject);
        const mergedCompletionEvents = rxjs_1.merge(immediate, debounce.pipe(operators_1.debounceTime(150), 
        // Upon receipt of an immediate event, cancel anything queued up from
        // debounce. This handles "type chars quickly, then quickly hit
        // Ctrl+Space", ensuring that it generates just one event rather than
        // two.
        operators_1.takeUntil(immediate), operators_1.repeat() // Resubscribe to wait for next debounced event.
        ));
        const completionResults = mergedCompletionEvents.pipe(operators_1.switchMap(ev => {
            const { channels } = this.props;
            if (!channels) {
                throw new Error("Unexpectedly received a completion event when channels were unset");
            }
            return complete_1.codeComplete(channels, ev.editor).pipe(operators_1.map(completionResult => () => ev.callback(completionResult)), 
            // Complete immediately upon next event, even if it's a debounced one
            // https://blog.strongbrew.io/building-a-safe-autocomplete-operator-with-rxjs/
            operators_1.takeUntil(this.completionSubject), operators_1.catchError((error) => {
                console.log(`Code completion error: ${error.message}`);
                return rxjs_1.empty();
            }));
        }));
        this.completionEventsSubscriber = completionResults.subscribe(callback => callback());
    }
    componentDidUpdate(prevProps) {
        if (!this.cm) {
            return;
        }
        const { editorFocused, theme } = this.props;
        if (prevProps.theme !== theme) {
            this.cm.refresh();
        }
        if (prevProps.editorFocused !== editorFocused) {
            editorFocused ? this.cm.focus() : this.cm.getInputField().blur();
        }
        if (prevProps.cursorBlinkRate !== this.props.cursorBlinkRate) {
            this.cm.setOption("cursorBlinkRate", this.props.cursorBlinkRate);
            if (editorFocused) {
                // code mirror doesn't change the blink rate immediately, we have to
                // move the cursor, or unfocus and refocus the editor to get the blink
                // rate to update - so here we do that (unfocus and refocus)
                this.cm.getInputField().blur();
                this.cm.focus();
            }
        }
        if (prevProps.mode !== this.props.mode) {
            this.cm.setOption("mode", this.cleanMode());
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.cm &&
            nextProps.value !== undefined &&
            normalizeLineEndings(this.cm.getValue()) !==
                normalizeLineEndings(nextProps.value)) {
            if (this.props.preserveScrollPosition) {
                const prevScrollPosition = this.cm.getScrollInfo();
                this.cm.setValue(nextProps.value);
                this.cm.scrollTo(prevScrollPosition.left, prevScrollPosition.top);
            }
            else {
                this.cm.setValue(nextProps.value);
            }
        }
        for (const optionName in nextProps) {
            if (!configurable_1.isConfigurable(optionName)) {
                continue;
            }
            if (nextProps[optionName] !== this.props[optionName]) {
                this.cm.setOption(optionName, nextProps[optionName]);
            }
        }
    }
    componentWillUnmount() {
        if (this.cm) {
            this.cm.toTextArea();
        }
        this.completionEventsSubscriber.unsubscribe();
    }
    focusChanged(focused) {
        if (this.props.onFocusChange) {
            this.props.onFocusChange(focused);
        }
    }
    hint(editor, callback) {
        const { completion, channels } = this.props;
        const debounceThisCompletionRequest = this
            .debounceNextCompletionRequest;
        this.debounceNextCompletionRequest = true;
        if (completion && channels) {
            const el = {
                editor,
                callback,
                debounce: debounceThisCompletionRequest
            };
            this.completionSubject.next(el);
        }
    }
    deleteTip() {
        this.setState({ bundle: null });
    }
    tips(editor) {
        const { tip, channels } = this.props;
        if (this.state.bundle) {
            return this.deleteTip();
        }
        if (tip) {
            tooltip_1.tool(channels, editor).subscribe((resp) => {
                const bundle = Object.keys(resp.dict).length > 0 ? resp.dict : null;
                this.setState({ bundle });
            });
        }
    }
    goLineDownOrEmit(editor) {
        const cursor = editor.getCursor();
        const lastLineNumber = editor.lastLine();
        const lastLine = editor.getLine(lastLineNumber);
        if (cursor.line === lastLineNumber &&
            cursor.ch === lastLine.length &&
            !editor.somethingSelected()) {
            codemirror_1.default.signal(editor, "bottomBoundary");
        }
        else {
            editor.execCommand("goLineDown");
        }
    }
    goLineUpOrEmit(editor) {
        const cursor = editor.getCursor();
        if (cursor.line === 0 && cursor.ch === 0 && !editor.somethingSelected()) {
            codemirror_1.default.signal(editor, "topBoundary");
        }
        else {
            editor.execCommand("goLineUp");
        }
    }
    executeTab(editor) {
        editor.somethingSelected()
            ? editor.execCommand("indentMore")
            : editor.execCommand("insertSoftTab");
    }
    codemirrorValueChanged(doc, change) {
        if (this.props.onChange &&
            // When the change came from us setting the value, don't trigger another change
            change.origin !== "setValue") {
            this.props.onChange(doc.getValue(), change);
        }
    }
    render() {
        const { bundle, cursorCoords } = this.state;
        const tooltipNode = this.tooltipNode;
        return (React.createElement(React.Fragment, null,
            React.createElement(initial_text_area_1.InitialTextArea, { ref: this.textareaRef, defaultValue: this.props.value }),
            tooltipNode
                ? react_dom_1.default.createPortal(React.createElement(tooltip_2.Tooltip, { bundle: bundle, cursorCoords: cursorCoords, deleteTip: this.deleteTip }), tooltipNode)
                : null));
    }
}
exports.default = CodeMirrorEditor;
CodeMirrorEditor.defaultProps = {
    value: "",
    channels: null,
    completion: true,
    editorFocused: false,
    kernelStatus: "not connected",
    theme: "light",
    tip: false,
    autofocus: false,
    // CodeMirror specific options for defaults
    matchBrackets: true,
    indentUnit: 4,
    lineNumbers: false,
    cursorBlinkRate: 530,
    editorType: "codemirror"
};
