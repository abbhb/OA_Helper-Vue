import {Element} from "bpmn-js/lib/model/Types";
import {ModdleElement} from "bpmn-moddle";
import {getBusinessObject, is} from "bpmn-js/lib/util/ModelUtil";
import {
    createModdleElement,
    getExtensionElementsList
} from "@/components/BpmnJs/utils/BpmnExtensionElementsUtil";
import {modelerStore} from "@/store";
import {without} from "min-dash";

/////// 功能函数
export function getExtensionProperties(element: Element): ModdleElement[] {
    const businessObject = getRelevantBusinessObject(element);

    if (!businessObject) return [];
    return getPropertiesList(businessObject) || [];
}

export function addExtensionProperty(element: Element, property) {
    try {
        const store = modelerStore();

        const modeling = store.getModeling;
        const prefix = store.getProcessEngine;

        const businessObject = getRelevantBusinessObject(element);

        // 判断 extensionElements
        let extensionElements = businessObject.get("extensionElements");
        if (!extensionElements) {
            extensionElements = createModdleElement(
                "bpmn:ExtensionElements",
                {values: []},
                businessObject
            );
            modeling.updateModdleProperties(element, businessObject, {extensionElements});
        }
        // 判断 extensionElements 是否有 properties
        let properties = getProperties(businessObject);
        if (!properties) {
            properties = createModdleElement(`${prefix}:Properties`, {values: []}, extensionElements);
            modeling.updateModdleProperties(element, extensionElements, {
                values: [...extensionElements.get("values"), properties]
            });
        }
        // 创建新属性并添加
        const newProperty = createModdleElement(`${prefix}:Property`, property, properties);
        modeling.updateModdleProperties(element, properties, {
            values: [...properties.get("values"), newProperty]
        });
    } catch (e) {
        console.log(e);
    }
}

export function removeExtensionProperty(element: Element, property: ModdleElement) {
    const businessObject = getRelevantBusinessObject(element);
    const extensionElements = businessObject.get("extensionElements");
    const properties = getProperties(businessObject);
    if (!properties) return;

    const store = modelerStore();
    const modeling = store.getModeling;

    const values = without(properties.get("values"), property as any);
    modeling.updateModdleProperties(element, properties, {values});

    if (!values || !values.length) {
        modeling.updateModdleProperties(element, extensionElements, {
            values: without(extensionElements.get("values"), properties as any)
        });
    }
}

///// helpers
function getRelevantBusinessObject(element: Element) {
    const businessObject = getBusinessObject(element);
    if (is(element, "bpmn:Participant")) {
        return businessObject.get("processRef");
    }
    return businessObject;
}

function getPropertiesList(bo: ModdleElement): [] {
    const properties = getProperties(bo);
    return properties && properties.get("values");
}

function getProperties(bo: ModdleElement): ModdleElement | null {
    return getExtensionElementsList(bo)[0];
}
