import {addCustomWidgetSchema} from '@/components/FormDesigner/widget-panel/widgetsConfig';
import * as PERegister from '@/components/FormDesigner/setting-panel/propertyRegister';
import * as PEFactory from '@/components/FormDesigner/setting-panel/property-editor-factory';

import CardWidget from '@/components/FormDesigner/extension/samples/card/card-widget.vue';
import CardItem from '@/components/FormDesigner/extension/samples/card/card-item.vue';
import {
    registerCWGenerator,
    registerFWGenerator,
} from '@/components/FormDesigner/utils/sfc-generator';
import {
    cardTemplateGenerator,
    alertTemplateGenerator,
} from '@/components/FormDesigner/extension/samples/extension-sfc-generator';

import {alertSchema} from '@/components/FormDesigner/extension/samples/extension-schema';
import AlertWidget from '@/components/FormDesigner/extension/samples/alert/alert-widget.vue';

// eslint-disable-next-line import/prefer-default-export
export const loadExtension = function (app) {
    /**
     * 加载容器组件步骤：
     * 1. 加载组件Json Schema;
     * 2. 全局注册容器组件，容器组件有两种状态——设计期和运行期，故需要注册两个组件；
     * 3. 全局注册属性编辑器组件（基本属性、高级属性、事件属性）；
     * 4. 注册容器组件的代码生成器；
     * 5. 加载完毕。
     */
    // addContainerWidgetSchema(cardSchema); //加载组件Json Schema
    /* -------------------------------------------------- */
    app.component(CardWidget.name, CardWidget); //注册设计期的容器组件
    app.component(CardItem.name, CardItem); //注册运行期的容器组件
    /* -------------------------------------------------- */
    PERegister.registerCPEditor(
        app,
        'card-folded',
        'card-folded-editor',
        PEFactory.createBooleanEditor('folded', 'extension.setting.cardFolded')
    );

    PERegister.registerCPEditor(
        app,
        'card-showFold',
        'card-showFold-editor',
        PEFactory.createBooleanEditor('showFold', 'extension.setting.cardShowFold')
    );

    PERegister.registerCPEditor(
        app,
        'card-cardWidth',
        'card-cardWidth-editor',
        PEFactory.createInputTextEditor('cardWidth', 'extension.setting.cardWidth')
    );

    const shadowOptions = [
        {label: 'never', value: 'never'},
        {label: 'hover', value: 'hover'},
        {label: 'always', value: 'always'},
    ];
    PERegister.registerCPEditor(
        app,
        'card-shadow',
        'card-shadow-editor',
        PEFactory.createSelectEditor('shadow', 'extension.setting.cardShadow', {
            optionItems: shadowOptions,
        })
    );
    /* -------------------------------------------------- */
    registerCWGenerator('card', cardTemplateGenerator); //注册容器组件的代码生成器
    /* -------------------------------------------------- */
    /* 容器组件加载完毕 end */

    /**
     * 加载字段组件步骤：
     * 1. 加载组件Json Schema;
     * 2. 全局注册字段组件，字段组件设计期和运行期共用，故仅需注册一个组件；
     * 3. 全局注册属性编辑器组件（基本属性、高级属性、事件属性）；
     * 4. 注册字段组件的代码生成器；
     * 5. 加载完毕。
     */
    addCustomWidgetSchema(alertSchema); //加载组件Json Schema
    /* -------------------------------------------------- */
    app.component(AlertWidget.name, AlertWidget); //注册组件
    /* -------------------------------------------------- */
    PERegister.registerCPEditor(
        app,
        'alert-title',
        'alert-title-editor',
        PEFactory.createInputTextEditor('title', 'extension.setting.alertTitle')
    );

    const typeOptions = [
        {label: 'success', value: 'success'},
        {label: 'warning', value: 'warning'},
        {label: 'info', value: 'info'},
        {label: 'error', value: 'error'},
    ];
    // PERegister.registerCPEditor(app, 'alert-type', 'alert-type-editor',
    //     PEFactory.createSelectEditor('type', 'extension.setting.alertType',
    //         {optionItems: typeOptions}))
    /* type属性映射已存在，无须再注册，故只需注册属性编辑器即可！！ */
    app.component(
        'AlertTypeEditor',
        PEFactory.createSelectEditor('type', 'extension.setting.alertType', {
            optionItems: typeOptions,
        })
    );

    PERegister.registerCPEditor(
        app,
        'alert-description',
        'alert-description-editor',
        PEFactory.createInputTextEditor(
            'description',
            'extension.setting.description'
        )
    );

    PERegister.registerCPEditor(
        app,
        'alert-closable',
        'alert-closable-editor',
        PEFactory.createBooleanEditor('closable', 'extension.setting.closable')
    );

    PERegister.registerCPEditor(
        app,
        'alert-closeText',
        'alert-closeText-editor',
        PEFactory.createInputTextEditor('closeText', 'extension.setting.closeText')
    );

    PERegister.registerCPEditor(
        app,
        'alert-center',
        'alert-center-editor',
        PEFactory.createBooleanEditor('center', 'extension.setting.center')
    );

    PERegister.registerCPEditor(
        app,
        'alert-showIcon',
        'alert-showIcon-editor',
        PEFactory.createBooleanEditor('showIcon', 'extension.setting.showIcon')
    );

    const effectOptions = [
        {label: 'light', value: 'light'},
        {label: 'dark', value: 'dark'},
    ];
    PERegister.registerCPEditor(
        app,
        'alert-effect',
        'alert-effect-editor',
        PEFactory.createRadioButtonGroupEditor(
            'effect',
            'extension.setting.effect',
            {
                optionItems: effectOptions,
            }
        )
    );

    PERegister.registerEPEditor(
        app,
        'alert-onClose',
        'alert-onClose-editor',
        PEFactory.createEventHandlerEditor('onClose', [])
    );
    /* -------------------------------------------------- */
    registerFWGenerator('alert', alertTemplateGenerator); //注册字段组件的代码生成器
    /* -------------------------------------------------- */
    /* 字段组件加载完毕 end */
};
