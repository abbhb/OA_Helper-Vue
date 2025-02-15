<template>
  <div class="number" :style="style" @click="clickItem(item)">
    <div
      class="appear"
      :class="{
        adding: adding,
        ['level' + item.number]: true,
      }"
    >
      {{ item.number }}
    </div>
  </div>
</template>

<script setup>
  import {
    ref,
    toRefs,
    computed,
    defineProps,
    defineEmits,
    nextTick,
    watch,
  } from 'vue';

  // props
  const props = defineProps({
    item: Object,
  });
  // 两种方式都可以
  // const item = toRef(props, 'item').value;
  // eslint-disable-next-line vue/no-dupe-keys
  const item = toRefs(props).item.value;

  // data
  const adding = ref(false);
  const zIndex = ref(1);

  const style = computed(() => {
    const transform = `translate(${item.y * 110}px,${item.x * 110}px)`;
    return {
      transform,
      zIndex: item.number/2 + zIndex.value,
    };
  });

  const emit = defineEmits(['remove', 'bclick']);
  const clickItem = (item) => {
    // eslint-disable-next-line vue/custom-event-name-casing
    emit('bclick', item);
  };
  watch(
    () => item.number,
    () => {
      adding.value = true;
      nextTick(() => {
        setTimeout(() => {
          adding.value = false;
        }, 200);
      });
    }
  );

  watch(
    // eslint-disable-next-line no-underscore-dangle
    () => item._delete,
    (val) => {
      if (val) {
        zIndex.value = 0;
        nextTick(() => {
          setTimeout(() => {
            console.log('方块被删除');
            emit('remove');
          }, 200);
        });
      }
    }
  );
</script>

<style scoped>
  .number {
    width: 100px;
    height: 100px;
    background: #ccc1b4;
    border-radius: 5px;
    position: absolute;
    left: 0;
    right: 0;
    transition: all 0.2s;
    overflow: hidden;
  }

  .appear {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 44px;
    color: #fff;
    font-weight: bold;
    font-family: Arial, Helvetica, sans-serif;
    transform-origin: center center;
    animation: zoom 0.1s 0.2s backwards;
  }

  @keyframes zoom {
    0% {
      opacity: 0;
      transform: scale(0);
    }

    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  .appear.adding {
    animation: zoom 0.1s 0.2s backwards, pop 0.2s ease backwards;
  }

  @keyframes pop {
    0% {
      transform: scale(0);
    }

    50% {
      transform: scale(1.2);
    }

    100% {
      transform: scale(1);
    }
  }

  .appear.level1 {
    background: #eee3da;
    color: #776e65;
  }

  .appear.level2 {
    background: #eedfca;
    color: #776e65;
  }

  .appear.level4 {
    background: #f3b17d;
    color: #f8f6f2;
  }

  .appear.level8 {
    background: #f79667;
    color: #f8f6f2;
  }

  .appear.level16 {
    background: #f87d63;
    color: #f8f6f2;
  }

  .appear.level32 {
    background: #f95f40;
    color: #f8f6f2;
  }

  .appear.level64 {
    background: #edcf72;
    color: #f8f6f2;
  }

  .appear.level128 {
    background: #edcc61;
    color: #f8f6f2;
  }

  .appear.level256 {
    background: #edc850;
    color: #f8f6f2;
  }

  .appear.level512 {
    background: #edc53f;
    color: #f8f6f2;
  }

  .appear.level1024 {
    background: #edc22e;
    color: #f8f6f2;
  }

  .appear.level2048 {
    background: #202124;
    color: #f8f6f2;
  }
</style>
