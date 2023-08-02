import {defineStore} from 'pinia';
import {modelType, PrintState} from './types';

const usePrintStore = defineStore('print', {
    state: (): PrintState => ({
        model: 1, // 默认单文件打印
    }),

    getters: {
        getModel(): modelType {
            return this.model;
        },
    },

    actions: {
        set(model: modelType) {
            this.model = model;
        },
        reset() {
            this.model = 1;
        },
    },
});

export default usePrintStore;
