import {Element} from 'bpmn-js/lib/model/Types';
import {ModdleElement} from 'bpmn-moddle';
import {getBusinessObject, is} from 'bpmn-js/lib/util/ModelUtil';
import {modelerStore} from '@/store';
import {getServiceTaskLikeBusinessObject} from '@/components/BpmnJs/utils/BpmnImplementationType';
import {getTimerEventDefinition} from '@/components/BpmnJs/utils/BpmnEventDefinitionUtil';
import {isAsync} from '@/components/BpmnJs/utils/BpmnAsyncElement';
import {
    createModdleElement,
    getExtensionElementsList,
} from '@/components/BpmnJs/utils/BpmnExtensionElementsUtil';

//
export function retryTimeCycleVisible(element: Element): boolean {
    const prefix = modelerStore().getProcessEngine;
    const businessObject = getBusinessObject(element);
    return (
        (is(element, `${prefix}:AsyncCapable`) && isAsync(businessObject)) ||
        !!isTimerEvent(element)
    );
}

export function taskPriorityVisible(element: Element): boolean {
    const prefix = modelerStore().getProcessEngine;
    const businessObject = getBusinessObject(element);
    return (
        (is(element, `${prefix}:JobPriorized`) && isAsync(businessObject)) ||
        is(element, 'bpmn:Process') ||
        (is(element, 'bpmn:Participant') && businessObject.get('processRef')) ||
        !!isTimerEvent(element)
    );
}

export function isJobExecutable(element: BpmnElement): boolean {
    return retryTimeCycleVisible(element) || taskPriorityVisible(element);
}

// 任务优先级
export function getExternalTaskValue(element: Element): string | undefined {
    const prefix = modelerStore().getProcessEngine;
    const businessObject = getRelativeBusinessObject(element);
    return businessObject.get(`${prefix}:taskPriority`);
}

export function setExternalTaskValue(
    element: Element,
    value: string | undefined
) {
    const prefix = modelerStore().getProcessEngine;
    const modeling = modelerStore().getModeling;
    const businessObject = getRelativeBusinessObject(element);
    modeling.updateModdleProperties(element, businessObject, {
        [`${prefix}:taskPriority`]: value,
    });
}

// 重试周期
export function getRetryTimeCycleValue(element: Element): string | undefined {
    const prefix = modelerStore().getProcessEngine;
    const businessObject = getBusinessObject(element);
    const failedJobRetryTimeCycle = getExtensionElementsList(
        businessObject,
        `${prefix}:FailedJobRetryTimeCycle`
    )[0];
    return failedJobRetryTimeCycle && failedJobRetryTimeCycle.body;
}

export function setRetryTimeCycleValue(
    element: Element,
    value: string | undefined
) {
    const prefix = modelerStore().getProcessEngine;
    const modeling = modelerStore().getModeling;
    const businessObject = getBusinessObject(element);

    let extensionElements = businessObject.get('extensionElements');
    if (!extensionElements) {
        extensionElements = createModdleElement(
            'bpmn:ExtensionElements',
            {values: []},
            businessObject
        );
        modeling.updateModdleProperties(element, businessObject, {
            extensionElements,
        });
    }

    let failedJobRetryTimeCycle = getExtensionElementsList(
        businessObject,
        `${prefix}:FailedJobRetryTimeCycle`
    )[0];
    if (!failedJobRetryTimeCycle) {
        failedJobRetryTimeCycle = createModdleElement(
            `${prefix}:FailedJobRetryTimeCycle`,
            {},
            extensionElements
        );
        modeling.updateModdleProperties(element, extensionElements, {
            values: [...extensionElements.get('values'), failedJobRetryTimeCycle],
        });
    }

    modeling.updateModdleProperties(element, failedJobRetryTimeCycle, {
        body: value,
    });
}

/////////// helpers
function isExternalTaskLike(element: Element): boolean {
    const prefix = modelerStore().getProcessEngine;
    const bo = getServiceTaskLikeBusinessObject(element);
    const type = bo && bo.get(`${prefix}:type`);
    return (
        bo && is(bo, `${prefix}:ServiceTaskLike`) && type && type === 'external'
    );
}

function getRelativeBusinessObject(element: Element): ModdleElement {
    let businessObject;
    if (is(element, 'bpmn:Participant')) {
        businessObject = getBusinessObject(element).get('processRef');
    } else if (isExternalTaskLike(element)) {
        businessObject = getServiceTaskLikeBusinessObject(element);
    } else {
        businessObject = getBusinessObject(element);
    }
    return businessObject;
}

function isTimerEvent(element): ModdleElement | undefined | false {
    return is(element, 'bpmn:Event') && getTimerEventDefinition(element);
}
