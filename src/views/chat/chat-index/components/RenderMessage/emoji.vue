<script setup lang="ts">
import {ref} from 'vue'
import {EmojiBody} from "@/types/chat";

defineProps<{ body: EmojiBody }>()

const hasLoadError = ref(false)
const isLoading = ref(true)

const handleError = () => {
  isLoading.value = false
  hasLoadError.value = true
}
</script>

<template>
  <div class="image emoji">
    <div v-if="hasLoadError" class="image-slot">
      <icon-poweroff icon="dazed" :size="36" colorful />
      加载失败
    </div>
    <template v-else>
      <img v-if="body?.url" :src="body?.url" @error="handleError" />
    </template>
  </div>
</template>
