import { DirectiveBinding } from 'vue';
import hljs from 'highlight.js';

function highlight(el: HTMLElement, binding: DirectiveBinding) {
  const blocks = el.querySelectorAll('pre code');
  blocks.forEach((block) => {
    hljs.highlightBlock(<HTMLElement>block);
  });
}

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    highlight(el, binding);
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    highlight(el, binding);
  },
};
