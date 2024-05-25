<script setup lang="ts">
import {ref} from "vue";
import {useRoute} from "vue-router";

const groupId = ref();

const route = useRoute()
  groupId.value = route.query.groupId;
</script>

<template>
<div>
{{groupId}}
</div>
</template>

<style scoped>

</style>