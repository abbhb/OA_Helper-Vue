<template>
  <a-carousel
    indicator-type="slider"
    show-arrow="hover"
    auto-play
    style="width: 100%; height: 100%; border-radius: 4px; overflow: hidden"
  >
    <a-carousel-item v-for="(indexImage, idx) in imageSrc?.data" :key="idx">
      <div class="parent-div">
        <div class="child1">
          <a-image
            :src="indexImage.image"
            :fit="'scale-down'"
            height="360px"
            style="width: 100%"
            width="100%"
          >
          </a-image>
        </div>
        <div v-if="indexImage.extra" class="child2">
          <span class="extra-text-title">额外:</span>
          <span class="extra-text">{{ indexImage.extra }}</span>
        </div>
      </div>
    </a-carousel-item>
  </a-carousel>
</template>

<script lang="ts">
  export default {
    props: {
      imageSrc: {
        default: () => {},
      },
    },
  };
</script>

<style scoped>
  .actions {
    display: flex;
    align-items: center;
  }

  .action {
    padding: 5px 4px;
    font-size: 14px;
    margin-left: 12px;
    border-radius: 2px;
    line-height: 1;
    cursor: pointer;
  }

  .action:first-child {
    margin-left: 0;
  }

  .action:hover {
    background: rgba(0, 0, 0, 0.5);
  }

  .actions-outer {
    .action {
      &:hover {
        color: #ffffff;
      }
    }
  }

  .parent-div {
    display: flex;
    position: relative;
    height: 200px;
  }

  .child1 {
    position: absolute;
    width: 100%;
    height: 100px;
  }

  .child2 {
    position: absolute;
    bottom: -160px;
    left: 0;
    width: 100%;
    height: 60px;
    //background-color: rgba(217, 216, 216, 0.5);
    z-index: 1;
    word-wrap: break-word;
    padding: 3px 1px 1px 3px;
    border-radius: 3px;
  }

  .extra-text {
    color: var(--color-text-1);
    font-size: 16px;
    font-family: 黑体;
  }

  .extra-text-title {
    color: var(--color-text-1);
    font-size: 18px;
    font-family: 黑体;
    font-weight: 800;
  }
</style>
