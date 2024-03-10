import {defineComponent, ref} from "vue";
import type Modeler from "bpmn-js/lib/Modeler";
import type Canvas from "diagram-js/lib/core/Canvas";
import eventBus from "@/utils/eventBus";

const Scales = defineComponent({
    name: "Scales",
    setup() {
        const currentScale = ref(1);
        let canvas: Canvas | null = null;

        eventBus.on("modelerInit", ({modeler}: { modeler: Modeler }) => {
            try {
                canvas = modeler.get<Canvas>("canvas");
                currentScale.value = canvas.zoom();
            } finally {
                modeler.on("canvas.viewbox.changed", ({viewbox}: any) => {
                    currentScale.value = viewbox.scale;
                });
            }
        });

        const zoomReset = (newScale: number | "fit-viewport") => {
            // eslint-disable-next-line no-unused-expressions
            canvas && canvas.zoom(newScale, newScale === "fit-viewport" ? undefined : {x: 0, y: 0});
        };

        const zoomOut = (newScale?: number) => {
            currentScale.value = newScale || Math.floor(currentScale.value * 100 - 0.1 * 100) / 100;
            zoomReset(currentScale.value);
        };

        const zoomIn = (newScale?: number) => {
            currentScale.value = newScale || Math.floor(currentScale.value * 100 + 0.1 * 100) / 100;
            zoomReset(currentScale.value);
        };

        return () => (
            <el-button-group>
                <el-button onClick={() => zoomOut()}>
                    <el-icon>
                        <zoom-out/>
                    </el-icon>
                </el-button>
                <el-button onClick={() => zoomReset("fit-viewport")}>
                    {Math.floor(currentScale.value * 10) * 10 + "%"}
                </el-button>
                <el-button onClick={() => zoomIn()}>
                    <el-icon>
                        <zoom-in/>
                    </el-icon>
                </el-button>
            </el-button-group>
        );
    }
});

export default Scales;
