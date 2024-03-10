//
// eslint-disable-next-line max-classes-per-file
declare module 'diagram-js-direct-editing' {
    import {ModuleDefinition} from 'didi';

    const directEditingModule: ModuleDefinition;
    export default directEditingModule;
}
//
declare module 'diagram-js-direct-editing/lib/DirectEditing' {
    import EventBus from 'diagram-js/lib/core/EventBus';
    import Canvas from 'diagram-js/lib/core/Canvas';
    import TextBox from 'diagram-js-direct-editing/lib/TextBox';

    export default class DirectEditing {
        constructor(eventBus: EventBus, canvas: Canvas);

        protected _textbox: TextBox;

        protected _eventBus: EventBus;

        protected _providers: any[];

        registerProvider(provider: any): void;

        isActive(): boolean;

        /**
         * 触发 directEditing. + event 事件
         * @param event
         * @param args
         */
        _fire(event: string, ...args: any[]): void;

        /**
         * 触发 directEditing.deactivate 事件
         */
        close(): void;

        /**
         * 触发 directEditing.complete 事件，并调用 close 关闭
         */
        complete(): void;

        getValue(): string;

        /**
         * Activate direct editing on the given element
         *
         * @param {HTMLElement} element the descriptor for a shape or connection
         * @return {Boolean} true if the activation was possible
         */
        activate(element: HTMLElement): boolean;
    }
}
//
declare module 'diagram-js-direct-editing/lib/TextBox' {
    type TextBoxOptions = {
        container: HTMLElement;
        keyHandler: function;
        resizeHandler: function;
    };

    type TextBoxBounds = {
        x: number;
        y: number;
        width?: number;
        height?: number;
        maxWidth?: number;
        minWidth?: number;
        maxHeight?: number;
        minHeight?: number;
    };

    type Style = {
        fontSize?: number;
        maxWidth?: number;
        minWidth?: number;
        maxHeight?: number;
        minHeight?: number;
    };

    export default class TextBox {
        constructor(options: TextBoxOptions);

        protected container: HTMLElement;

        protected parent: HTMLElement;

        protected content: HTMLElement;

        protected keyHandler: function;

        protected resizeHandler: function;
        // protected autoResize: Function
        // protected handlePaste: Function

        /**
         * 创建具有给定位置、大小、样式和文本内容的文本框
         * @param bounds {TextBoxBounds}
         * @param style {Style | string}
         * @param [value] {string | Object}
         * @param [options] {Object}
         */
        create(
            bounds: TextBoxBounds,
            style: Style | string,
            value?: string | object,
            options?: object
        ): HTMLElement;

        handlePaste(e: Event): void;

        insertText(text: string): void;

        _insertTextIE(text: string): void;

        autoResize(): void;

        resizable(): void;

        destroy(): void;

        getValue(): string;

        getSelection(): Range;

        setSelection(container: HTMLElement | number, offset?: number): void;
    }
}
