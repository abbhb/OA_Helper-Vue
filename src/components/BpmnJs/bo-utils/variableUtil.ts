import {modelerStore} from '@/store';

// @ts-ignore
import {excludeWidget} from '@/utils/Widget';
import {WidgetList} from '@/store/modules/modeler';

export type NodeWidget = {
    activityId: string;
    activityName: string;
    widgetList: WidgetList[];
};

/**
 * 获取全部组件树形结构
 * @returns
 */
export const getWidgetTree = (): NodeWidget[] => {
    const nodeWidgets: NodeWidget[] = [];
    // @ts-ignore
    const elements: any[] = modelerStore().getElRegistry?._elements;

    modelerStore().getFormJsonList.forEach((item) => {
        const widgetList: any[] = [];
        item.formJson.widgetList.forEach((widget) => {
            buildTreeToList(widget, widgetList);
        });
        if (widgetList.length !== 0 && elements[item.activityId]) {
            nodeWidgets.push({
                activityId: item.activityId,
                activityName: elements[item.activityId].element.businessObject.name,
                widgetList,
            });
        }
    });

    // 过滤一些组件
    nodeWidgets.forEach((item) => {
        item.widgetList = item.widgetList.filter((t1) => {
            return excludeWidget.every((t2) => {
                return t1.type !== t2;
            });
        });
    });

    return nodeWidgets;
};

/**
 * 生成树节点
 * @param widget 当前节点
 * @param treeNode 全部节点
 */
export const buildTreeToList = (widget, treeNode) => {
    treeNode.push(widget);

    if (widget.category === undefined) {
        return;
    }

    if (widget.type === 'grid') {
        widget.cols.map((col) => {
            treeNode.push(col);
            col.widgetList.map((wChild) => {
                buildTreeToList(wChild, treeNode);
            });
        });
    } else if (widget.type === 'table') {
        //TODO: 需要考虑合并单元格！！
        widget.rows.map((row) => {
            // treeNode.push(row);
            row.cols.map((cell) => {
                if (cell.merged) {
                    //跳过合并单元格！！
                    return;
                }
                treeNode.push(cell);
                cell.widgetList.map((wChild) => {
                    buildTreeToList(wChild, treeNode);
                });
            });
        });
    } else if (widget.type === 'tab') {
        widget.tabs.map((tab) => {
            treeNode.push(tab);
            tab.widgetList.map((wChild) => {
                buildTreeToList(wChild, treeNode);
            });
        });
    } else if (widget.type === 'sub-form') {
        widget.widgetList.map((wChild) => {
            buildTreeToList(wChild, treeNode);
        });
    } else if (widget.category === 'container') {
        //自定义容器
        widget.widgetList.map((wChild) => {
            buildTreeToList(wChild, treeNode);
        });
    }
};
