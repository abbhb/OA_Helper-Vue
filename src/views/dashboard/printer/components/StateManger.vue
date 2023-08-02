<script lang="ts" setup>
import usePrintStore from "@/store/modules/print";


const printState = usePrintStore()

</script>

<template>
  <a-card
    :body-style="{ padding: '12px 10px 10px 10px' }"
    :header-style="{ paddingBottom: '0' }"
    :title="$t('printer.one.StateManger.title')"
    class="general-card"
  >
    <div :style="{ marginTop: '20px' }">
      <a-radio-group v-model:model-value="printState.model">
        <a-radio :value="1">
          <template #radio="{ checked }">
            <a-space
              :class="{ 'custom-radio-card-checked': checked }"
              align="start"
              class="custom-radio-card"
            >
              <div className="custom-radio-card-mask">
                <div className="custom-radio-card-mask-dot"/>
              </div>
              <div>
                <div className="custom-radio-card-title">
                  单文件打印
                </div>
                <a-typography-text type="secondary">
                  稳定、可靠
                </a-typography-text>
              </div>
            </a-space>
          </template>
        </a-radio>
        <a-radio :value="9">
          <template #radio="{ checked }">
            <a-space
              :class="{ 'custom-radio-card-checked': checked }"
              align="start"
              class="custom-radio-card"
            >
              <div className="custom-radio-card-mask">
                <div className="custom-radio-card-mask-dot"/>
              </div>
              <div>
                <div className="custom-radio-card-title">
                  多文件打印
                </div>
                <a-typography-text type="secondary">
                  测试阶段
                </a-typography-text>
              </div>
            </a-space>
          </template>
        </a-radio>
      </a-radio-group>
    </div>
  </a-card>
</template>

<style lang="less" scoped>
.custom-radio-card {
  padding: 10px 16px;
  border: 1px solid var(--color-border-2);
  border-radius: 4px;
  width: 240px;
  box-sizing: border-box;
}

.custom-radio-card-mask {
  height: 14px;
  width: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  border: 1px solid var(--color-border-2);
  box-sizing: border-box;
}

.custom-radio-card-mask-dot {
  width: 8px;
  height: 8px;
  border-radius: 100%;
}

.custom-radio-card-title {
  color: var(--color-text-1);
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
}

.custom-radio-card:hover,
.custom-radio-card-checked,
.custom-radio-card:hover .custom-radio-card-mask,
.custom-radio-card-checked .custom-radio-card-mask {
  border-color: rgb(var(--primary-6));
}

.custom-radio-card-checked {
  background-color: var(--color-primary-light-1);
}

.custom-radio-card:hover .custom-radio-card-title,
.custom-radio-card-checked .custom-radio-card-title {
  color: rgb(var(--primary-6));
}

.custom-radio-card-checked .custom-radio-card-mask-dot {
  background-color: rgb(var(--primary-6));
}
</style>
