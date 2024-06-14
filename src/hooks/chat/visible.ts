// src/directives/visible.js
export default {
  mounted(el, binding) {
    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          binding.value(true);
        } else {
          binding.value(false);
        }
      });
    };

    const observer = new IntersectionObserver(callback, {
      threshold: 0.1, // Adjust this threshold to control when the element is considered visible
    });

    observer.observe(el);
  },
};
