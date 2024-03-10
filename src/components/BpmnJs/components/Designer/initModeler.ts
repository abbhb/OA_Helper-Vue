import {markRaw, Ref} from "vue";
import Modeler from "bpmn-js/lib/Modeler";
import eventBus from "@/utils/eventBus";
import {modelerStore} from "@/store";
import type {BaseViewerOptions} from "bpmn-js/lib/BaseViewer";
import type {ModulesAndModdles} from "@/components/BpmnJs/components/Designer/modulesAndModdle";

export default async function (
    designer: Ref<HTMLElement | null>,
    modelerModules: ModulesAndModdles,
    emit
) {
    const store = modelerStore();

    const options: BaseViewerOptions = {
        container: designer.value as HTMLElement,
        additionalModules: modelerModules[0] || [],
        moddleExtensions: modelerModules[1] || {},
        ...modelerModules[2]
    };

    if (store.getModeler) {
        // 清除旧 modeler
        store.getModeler.destroy();
        await store.setModeler(undefined);
    }
    const modeler: Modeler = new Modeler(options);
    await store.setModeler(markRaw(modeler));


    eventBus.emit("modelerInit", {modeler});
    modeler.on('commandStack.changed', async (event) => {
        try {
            const {xml} = await modeler.saveXML({format: true});
            emit("update:xml", xml);
            emit("command-stack-changed", event);
        } catch (error) {
            console.error(error);
        }
    });
}
