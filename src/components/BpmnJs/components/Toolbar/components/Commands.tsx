import {defineComponent} from 'vue';
import eventBus from '@/utils/eventBus';
import type Modeler from 'bpmn-js/lib/Modeler';
import type CommandStack from 'diagram-js/lib/command/CommandStack';
import {createNewDiagram} from '@/components/BpmnJs/utils/index';
import {ElMessageBox} from 'element-plus';

const Commands = defineComponent({
    name: 'Commands',
    setup() {
        let command: CommandStack | null = null;

        eventBus.on('modelerInit', ({modeler}: { modeler: Modeler }) => {
            command = modeler.get<CommandStack>('commandStack');
        });

        const undo = () => {
            // eslint-disable-next-line no-unused-expressions
            command && command.canUndo() && command.undo();
        };

        const redo = () => {
            // eslint-disable-next-line no-unused-expressions
            command && command.canRedo() && command.redo();
        };

        const restart = async () => {
            await ElMessageBox.confirm('确定要擦除重做吗?', '提示');
            // eslint-disable-next-line no-unused-expressions
            command && command.clear();
            createNewDiagram();
        };

        return () => (
            <el-button-group>
                <el-button onClick={undo}>撤销</el-button>
                <el-button onClick={redo}>恢复</el-button>
                <el-button onClick={restart}>擦除重做</el-button>
            </el-button-group>
        );
    },
});

export default Commands;
