<template>
  <a-carousel
    indicator-type="slider"
    show-arrow="hover"
    auto-play
    style="width: 100%; height: 170px; border-radius: 4px; overflow: hidden"
  >
    <a-carousel-item v-for="(src, idx) in imageSrc" :key="idx">
      <div>
        <a-image fit="fill" :src="src" width="100%" style="width: 100%" />
      </div>
    </a-carousel-item>
  </a-carousel>
</template>

<script lang="ts">

  export default {
      props: {
          imageSrc: {
              type: Array,
              default: () => []
          }
      },
  }

</script>
