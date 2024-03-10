import {type ModdleElement, type Element} from "bpmn-js/lib/util/ModelUtil";
import {modelerStore} from "@/store";

/**
 * 获取设置的值
 * @param element element The element.
 * @param propKey 属性key
 * @returns 属性值
 */
export function getExPropValue<T>(element: any, propKey: string): T {
    const exPropKey = `${modelerStore().getProcessEngine}:${propKey}`;
    // eslint-disable-next-line no-nested-ternary
    return element && element.get ? element.get(exPropKey) : element ? element[exPropKey] : element;
}

/**
 * 更新设置的值
 * @param element element The element.
 * @param moddleElement moddleElement The model element.
 * @param propKey 属性名称
 * @param propValue 属性值
 */
export const updateExModdleProp = function (
    element: Element,
    moddleElement: ModdleElement,
    propKey: string,
    propValue: unknown
) {
    const modeling = modelerStore().getModeling;
    const exPropKey = `${modelerStore().getProcessEngine}:${propKey}`;
    modeling?.updateModdleProperties(element, moddleElement, {
        [exPropKey]: propValue === "" ? undefined : propValue
    });
};
