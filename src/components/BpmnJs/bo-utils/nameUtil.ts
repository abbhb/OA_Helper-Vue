import {modelerStore} from "@/store";
import {Element} from "bpmn-js/lib/model/Types";
import {ModdleElement} from "bpmn-moddle";
import {getBusinessObject, is} from "bpmn-js/lib/util/ModelUtil";
import {isAny} from "bpmn-js/lib/features/modeling/util/ModelingUtil";
import {add as collectionAdd} from "diagram-js/lib/util/Collections";
import BpmnFactory from "bpmn-js/lib/features/modeling/BpmnFactory";

// 根据元素获取 name 属性
export function getNameValue(element: Element): string | undefined {
    if (isAny(element, ["bpmn:Collaboration", "bpmn:DataAssociation", "bpmn:Association"])) {
        return undefined;
    }
    if (is(element, "bpmn:TextAnnotation")) {
        return element.businessObject.text;
    }
    if (is(element, "bpmn:Group")) {
        const businessObject: ModdleElement = getBusinessObject(element);
        const categoryValueRef = businessObject?.categoryValueRef;
        return categoryValueRef?.value;
    }
    return element?.businessObject.name;
}

// 根据输入内容设置 name 属性
export function setNameValue(element: Element, value: string): void {
    const store = modelerStore();

    const modeling = store.getModeling;
    const canvas = store.getCanvas;
    const bpmnFactory: BpmnFactory | undefined = store.getModeler?.get("bpmnFactory");

    if (isAny(element, ["bpmn:Collaboration", "bpmn:DataAssociation", "bpmn:Association"])) {
        return undefined;
    }
    if (is(element, "bpmn:TextAnnotation")) {
        return modeling?.updateModdleProperties(element, element.businessObject, {text: value});
    }
    if (is(element, "bpmn:Group")) {
        const businessObject = getBusinessObject(element);
        const {categoryValueRef} = businessObject;
        if (!categoryValueRef) {
            initializeCategory(businessObject, canvas?.getRootElement(), bpmnFactory);
        }
        return modeling?.updateLabel(element, value);
    }
    modeling?.updateModdleProperties(element, element.businessObject, {name: value});
}

////////////////  helpers

function createCategoryValue(definitions, bpmnFactory): ModdleElement {
    const categoryValue = bpmnFactory.create("bpmn:CategoryValue");
    const category = bpmnFactory.create("bpmn:Category", {
        categoryValue: [categoryValue]
    });
    collectionAdd(definitions.get("rootElements"), category);
    getBusinessObject(category).$parent = definitions;
    getBusinessObject(categoryValue).$parent = category;

    return categoryValue;
}

function initializeCategory(businessObject, rootElement, bpmnFactory) {
    const definitions = getBusinessObject(rootElement).$parent;

    businessObject.categoryValueRef = createCategoryValue(definitions, bpmnFactory);
}
