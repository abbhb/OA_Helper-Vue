import EmptyXML from "@/components/BpmnJs/utils/EmptyXML";
import {EditorSettings} from "@/components/BpmnJs/types/editor/settings";
import {modelerStore} from "@/store";

// eslint-disable-next-line import/prefer-default-export
export const createNewDiagram = async function (newXml?: string, settings?: EditorSettings) {
    try {
        const store = modelerStore();
        const timestamp = Date.now();
        const {processId, processName} = settings || {};
        const newId: string = processId || `Process_${timestamp}`;
        const newName: string = processName || `新建流程_${timestamp}`;
        const xmlString = newXml || EmptyXML(newId, newName);
        const {warnings} = await store.getModeler.importXML(xmlString);
        store.getCanvas.zoom("fit-viewport", {x: 0, y: 0});
        // console.log("bpmb warnings->", warnings);
    } catch (e) {
        console.error(`[Process Designer Warn]: ${typeof e === "string" ? e : (e as Error)?.message}`);
    }
};
