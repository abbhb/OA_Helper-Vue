import {is} from 'bpmn-js/lib/util/ModelUtil';
import {Element} from 'bpmn-js/lib/model/Types';
import {ModdleElement} from 'bpmn-moddle';
import {isArray} from 'min-dash';
import {modelerStore} from '@/store';

/**
 * Get extension elements of business object. Optionally filter by type.
 */
export function getExtensionElementsList(
    businessObject: ModdleElement,
    type?: string
): ModdleElement[] {
    const extensionElements = businessObject?.get('extensionElements');
    if (!extensionElements) return [];
    const values = extensionElements.get('values');
    if (!values || !values.length) return [];

    if (type) return values.filter((value) => is(value, type));

    return values;
}

/**
 * Add one or more extension elements. Create bpmn:ExtensionElements if it doesn't exist.
 */
export function addExtensionElements(
    element: Element,
    businessObject: ModdleElement,
    extensionElementToAdd: ModdleElement
) {
    const modeling = modelerStore().getModeling;
    let extensionElements = businessObject.get('extensionElements');

    // (1) create bpmn:ExtensionElements if it doesn't exist
    if (!extensionElements) {
        // eslint-disable-next-line no-use-before-define
        extensionElements = createModdleElement(
            'bpmn:ExtensionElements',
            {values: []},
            businessObject
        );
        modeling.updateModdleProperties(element, businessObject, {
            extensionElements,
        });
    }
    extensionElementToAdd.$parent = extensionElements;

    // (2) add extension element to list
    modeling.updateModdleProperties(element, extensionElements, {
        values: [...extensionElements.get('values'), extensionElementToAdd],
    });
}

/**
 * Remove one or more extension elements. Remove bpmn:ExtensionElements afterwards if it's empty.
 */
export function removeExtensionElements(
    element: Element,
    businessObject: ModdleElement,
    extensionElementsToRemove: ModdleElement | ModdleElement[]
) {
    if (!isArray(extensionElementsToRemove)) {
        extensionElementsToRemove = [extensionElementsToRemove];
    }

    const extensionElements = businessObject.get('extensionElements');
    const values = extensionElements
        .get('values')
        .filter((value) => !extensionElementsToRemove.includes(value));

    const modeling = modelerStore().getModeling;
    modeling.updateModdleProperties(element, extensionElements, {values});
}

export function createModdleElement(
    elementType: string,
    properties: Record<string, any>,
    parent?: Element | ModdleElement
): ModdleElement {
    const moddle = modelerStore().getModdle;
    const element = moddle!.create(elementType, properties);
    // eslint-disable-next-line no-unused-expressions
    parent && (element.$parent = parent);
    return element;
}
