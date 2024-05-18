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

export function getQueryVariable(variable: string): string {
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=');
        // eslint-disable-next-line eqeqeq
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return '';
}

const nameMap = new Map<string, string>();

nameMap.set('MoveUp', 'ArrowUp');
nameMap.set('MoveDown', 'ArrowDown');
nameMap.set('MoveLeft', 'ArrowLeft');
nameMap.set('MoveRight', 'ArrowRight');

export default {setChildrenUndefined, getQueryVariable, nameMap};
