<template>
  <container-item-wrapper :widget="widget">
    <div v-show="!widget.options.hidden" :key="widget.id" class="tab-container">
      <el-tabs
        :ref="widget.id"
        v-model="activeTabName"
        :type="widget.displayType"
        :class="[customClass]"
      >
        <el-tab-pane
          v-for="(tab, index) in visibleTabs"
          :key="index"
          :label="tab.options.label"
          :disabled="tab.options.disabled"
          :name="tab.options.name"
        >
          <template v-for="(subWidget, swIdx) in tab.widgetList">
            <template v-if="'container' === subWidget.category">
              <component
                :is="getComponentByContainer(subWidget)"
                :key="swIdx"
                :widget="subWidget"
                :parent-list="tab.widgetList"
                :index-of-parent-list="swIdx"
                :parent-widget="widget"
              >
                <!-- 递归传递插槽！！！ -->
                <template v-for="slot in Object.keys($slots)" #[slot]="scope">
                  <slot :name="slot" v-bind="scope"/>
                </template>
              </component>
            </template>
            <template v-else>
              <component
                :is="subWidget.type + '-widget'"
                :key="swIdx"
                :field="subWidget"
                :parent-list="tab.widgetList"
                :index-of-parent-list="swIdx"
                :parent-widget="widget"
              >
                <!-- 递归传递插槽！！！ -->
                <template v-for="slot in Object.keys($slots)" #[slot]="scope">
                  <slot :name="slot" v-bind="scope"/>
                </template>
              </component>
            </template>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
  </container-item-wrapper>
</template>

<script>
import emitter from '@/components/FormDesigner/utils/emitter';
import i18n from '@/components/FormDesigner/utils/i18n';
import refMixin from '@/components/FormDesigner/form-render/refMixin';
import FieldComponents from '@/components/FormDesigner/form-widget/field-widget/index';
import ContainerItemWrapper from './container-item-wrapper.vue';
import containerItemMixin from './containerItemMixin';

export default {
  name: 'TabItem',
  componentName: 'ContainerItem',
  components: {
    ContainerItemWrapper,
    ...FieldComponents,
  },
  mixins: [emitter, i18n, refMixin, containerItemMixin],
  inject: ['refList', 'sfRefList', 'globalModel'],
  props: {
    widget: Object,
  },
  data() {
    return {
      activeTabName: '',
    };
  },
  computed: {
    visibleTabs() {
      return this.widget.tabs.filter((tp) => {
        return !tp.options.hidden;
      });
    },
  },
  created() {
    this.initRefList();
  },
  mounted() {
    this.initActiveTab();
  },
  beforeUnmount() {
    this.unregisterFromRefList();
  },
  methods: {
    initActiveTab() {
      if (this.widget.type === 'tab' && this.widget.tabs.length > 0) {
        const activePanes = this.widget.tabs.filter((tp) => {
          return tp.options.active === true;
        });
        if (activePanes.length > 0) {
          this.activeTabName = activePanes[0].options.name;
        } else {
          this.activeTabName = this.widget.tabs[0].options.name;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
