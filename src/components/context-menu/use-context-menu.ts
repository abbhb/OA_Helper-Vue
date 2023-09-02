import {onMounted, onUnmounted, ref} from 'vue';

export function useContextMenu(container) {
    const x = ref<number>(0);
    const y = ref<number>(0);
    const showMenu = ref(false);
    const handleContextMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        showMenu.value = true;
        x.value = e.clientX;
        y.value = e.clientY;
    };
    const closeMenu = (e) => {
        showMenu.value = false;
    };
    onMounted(() => {
        container.value.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('click', closeMenu, true);
        window.addEventListener('contextmenu', closeMenu);
    });
    onUnmounted(() => {
        container.value.removeEventListener('contextmenu', closeMenu);
        // 移除window上的事件
    });
    return {x, y, showMenu};
};

export default {useContextMenu}