<script setup lang="ts">

import {ref} from "vue";
import {PrintDeviceResp} from "@/api/printer";

const listDevice = ref<PrintDeviceResp[]>([])

</script>

<template>
  <a-card
    class="general-card"
    :title="$t('printer.one.device.select')"
    :header-style="{ paddingBottom: '0' }"
    :body-style="{ padding: '12px 12px 20px 20px' }"
  >
    <div style="border: 1px #d7d6d6 solid;border-radius: 5px;">
      <a-select :style="{width:'100%'}" :bordered="false">
        <template #label="{ data }">
          <span><a-tag color="green">1</a-tag>{{data?.label}}</span>
        </template>
        <a-option>Beijing</a-option>
        <a-option>Shanghai</a-option>
        <a-option>Guangzhou</a-option>
        <a-option disabled>Disabled</a-option>
      </a-select>
    </div>


  </a-card>
</template>

<style scoped lang="less">

</style>