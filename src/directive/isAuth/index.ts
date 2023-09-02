import {DirectiveBinding} from 'vue';
import {useUserStore} from '@/store';
import {getToken} from '@/utils/auth';

function checkIsAuth(el: HTMLElement, binding: DirectiveBinding) {
    const {value} = binding;
    const userStore = useUserStore();
    const {id} = userStore;

    if (!value) {
        /* empty */
    } else if (!id || !getToken()) {
        if (el.parentNode) {
            el.parentNode.removeChild(el);
        }
    }
}

export default {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        checkIsAuth(el, binding);
    },
    updated(el: HTMLElement, binding: DirectiveBinding) {
        checkIsAuth(el, binding);
    },
};
