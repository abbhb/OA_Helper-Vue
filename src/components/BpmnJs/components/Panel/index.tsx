import {Component, defineComponent, markRaw, onBeforeUnmount, onMounted, ref,} from 'vue';
import debounce from 'lodash.debounce';
import eventBus from '@/utils/eventBus';
import {modelerStore} from '@/store';

import getBpmnIconType from '@/components/BpmnJs/bpmn-icons/getIconType';
import bpmnIcons from '@/components/BpmnJs/bpmn-icons';

import {isCanbeConditional, isExtendStartEvent,} from '@/components/BpmnJs/bo-utils/conditionUtil';
import {customTranslate} from '@/components/BpmnJs/overwrite-modules/Translate';
import {isAsynchronous} from '@/components/BpmnJs/bo-utils/asynchronousContinuationsUtil';
import {isExecutable} from '@/components/BpmnJs/bo-utils/executionListenersUtil';
import {isJobExecutable} from '@/components/BpmnJs/bo-utils/jobExecutionUtil';
import {isStartInitializable, isUserAssignmentSupported,} from '@/components/BpmnJs/bo-utils/initiatorUtil';
import Modeler from 'bpmn-js/lib/Modeler';
import BpmnIcon from './components/sub/BpmnIcon.vue';

import ElementGenerations from './components/ElementGenerations.vue';
import ElementDbTable from './components/ElementDbTable.vue';
import ElementConditional from './components/ElementConditional.vue';
import ElementExecutionListeners from './components/ElementExecutionListeners.vue';
import ElementExtensionProperties from './components/ElementExtensionProperties.vue';
import ElementAsyncContinuations from './components/ElementAsyncContinuations.vue';
import ElementJobExecution from './components/ElementJobExecution.vue';
import ElementService from './components/ElementService.vue';
import ElementStartInitiator from './components/ElementStartInitiator.vue';
import ElementForm from './components/ElementForm.vue';
import UserAssignment from './components/UserAssignment.vue';

const Panel = defineComponent({
    name: 'PropertiesPanel',
    setup() {
        const modeler = modelerStore();
        const panel = ref<HTMLDivElement | null>(null);
        const currentElementId = ref<string | undefined>(undefined);
        const currentElementType = ref<string | undefined>(undefined);
        const bpmnIconName = ref<string>('Process');
        const bpmnElementName = ref<string>('Process');
        const renderComponents = markRaw<Component[]>([]);
        /**
         * 更新组件
         * @param element 当前节点
         */
        const setCurrentComponents = (element: BpmnElement) => {
            // 清空
            renderComponents.splice(0, renderComponents.length);
            // 添加组件
            renderComponents.push(ElementGenerations); // 基本信息
            element.type === 'bpmn:Process' && renderComponents.push(ElementDbTable); // 数据库配置
            isExtendStartEvent(element) && renderComponents.push(ElementForm); // 是否是开始节点
            isCanbeConditional(element) && renderComponents.push(ElementConditional);
            isJobExecutable(element) && renderComponents.push(ElementJobExecution);
            renderComponents.push(ElementExtensionProperties);
            isAsynchronous(element) &&
            renderComponents.push(ElementAsyncContinuations);
            isStartInitializable(element) &&
            renderComponents.push(ElementStartInitiator);
            isUserAssignmentSupported(element) &&
            renderComponents.push(UserAssignment);
            isUserAssignmentSupported(element) && renderComponents.push(ElementForm);
            element.type === 'bpmn:ServiceTask' && renderComponents.push(ElementService);
            isExecutable(element) && renderComponents.push(ElementExecutionListeners);
        };

        /**
         * 设置选中元素，更新 store
         */
        const setCurrentElement = debounce(
            (activatedElement: BpmnElement | undefined) => {
                let activatedElementTypeName = '';

                if (!activatedElement) {
                    activatedElement = modeler.getElRegistry?.find(
                        (el) =>
                            el.type === 'bpmn:Process' || el.type === 'bpmn:Collaboration'
                    );

                    if (!activatedElement) {
                        return console.log('No Element found!');
                    }
                }
                if (activatedElement.type === 'label') {
                    return;
                }
                activatedElementTypeName = getBpmnIconType(activatedElement);

                modeler.setElement(markRaw(activatedElement));
                currentElementId.value = activatedElement.id;
                // eslint-disable-next-line prefer-destructuring
                currentElementType.value = activatedElement.type.split(':')[1];

                bpmnIconName.value = bpmnIcons[activatedElementTypeName];
                bpmnElementName.value = activatedElementTypeName;

                setCurrentComponents(activatedElement);
                eventBus.emit('elementUpdate', activatedElement);
            },
            100
        );

        /**
         * 初始化
         */
        eventBus.on('modelerInit', ({modeler}: { modeler: Modeler }) => {
            // 导入完成后默认选中 process 节点
            // @ts-ignore
            modeler.on('import.done', () => {
                setCurrentElement(null);
            });
            // 监听选择事件，修改当前激活的元素以及表单
            // @ts-ignore
            modeler.on('selection.changed', ({newSelection}) => {
                setCurrentElement(newSelection[0] || null);
                setTimeout(() => {
                    eventBus.emit('elementInit');
                }, 200);
            });
            // 节点表单修改时触发
            // @ts-ignore
            modeler.on('element.changed', ({element}) => {
                // 保证 修改 "默认流转路径" 等类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
                if (element && element.id === currentElementId.value) {
                    setCurrentElement(element);
                }
            });
        });

        /**
         * 初始化
         */
        onMounted(() => {
            !currentElementId.value && setCurrentElement(null);
        });

        /**
         * 销毁事件，防止重复触发
         */
        onBeforeUnmount(() => {
            eventBus.all.clear();
        });

        return () => (
            <div ref={panel} class="panel">
                <div class="panel-header">
                    <BpmnIcon name={bpmnIconName.value}></BpmnIcon>
                    <div class="panel-title">
                        <p>{bpmnElementName.value}</p>
                        <p>{customTranslate(currentElementType.value || 'Process')}</p>
                    </div>
                </div>

                <div>
                    {renderComponents.map((component) => (
                        <component is={component}></component>
                    ))}
                </div>
            </div>
        );
    },
});

export default Panel;
