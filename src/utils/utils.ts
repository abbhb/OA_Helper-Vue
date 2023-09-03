export function setChildrenUndefined(data: any[]) {
    for (let i = 0; i < data.length; i += 1) {
        const item = data[i];
        if (item.children && item.children.length > 0) {
            setChildrenUndefined(item.children);
        } else {
            item.children = undefined;
        }
    }
}

export default {setChildrenUndefined}