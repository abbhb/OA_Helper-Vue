// 打印模式：默认单文件打印模式:1 多文件打印模式为9
export type modelType = 1 | 9;

export interface PrintState {
    model: modelType;
}
