<template>

  <div>
    <div>不包含子部门！请手动选择所需要的所有部门</div>
    <a-button-group style="margin-bottom: 20px">
      <a-button type="primary" @click="toggleExpanded">
        {{ deptExpandedKeys?.length ? '折叠' : '展开全部' }}
      </a-button>
    </a-button-group>
    <a-tree
      v-model:checked-keys="statusE.noticeDepts"
      v-model:expanded-keys="deptExpandedKeys"
      v-model:selected-keys="deptSelectedKeys"
      @change="changes"
      :data="deptTreeData"
      style="overflow-y: scroll; height: 20rem"
      :check-strictly="true"
      :checkable="true"
      :field-names="{
          key: 'id',
          title: 'deptName',
          children: 'children',
        }"
    >
    </a-tree>

  </div>

</template>

<script setup lang="ts">
  import { reactive, ref, watch } from 'vue';
  import {deptListTree} from "@/api/dept";

  const props = defineProps({
    list: {
      type: Array,
      default: () => [],
    },
    ignoreList: {
      type: Boolean,
      default: false,
    },
  });

  export interface SelectGroupType {
    id?: string;
    name?: string;
  }
  const emit = defineEmits<{
    (event: 'ok', list: any[]): void;
  }>();

  type StatuE = {
    noticeDepts: any;
  };
  const deptTreeData = ref([]);
  const deptAllCheckedKeys = ref([]);
  const deptAllExpandedKeys = ref([]);

  const deptSelectedKeys = ref([]);
  const deptExpandedKeys = ref([]);
  const statusE = ref<StatuE>({

    noticeDepts: [],

  });
  const getAllId = (yuan) => {
    if (yuan) {
      for (let i = 0; i < yuan.length; i += 1) {
        deptAllExpandedKeys.value.push(yuan[i].id);
        if (yuan[i].children) {
          if (yuan[i].children.length > 0) {
            getAllId(yuan[i].children);
          }
        }
      }
    }
  };
  const initData = async () => {
    const { data } = await deptListTree();
    deptTreeData.value = data;
    getAllId(data);
    deptAllCheckedKeys.value = deptAllExpandedKeys.value;
    if (deptExpandedKeys.value?.length === 0) {
      toggleExpanded();
    }

  };

  initData();
  const changes = () =>{
    console.log(statusE.value.noticeDepts)

    emit('ok',statusE.value.noticeDepts.map((value)=>{
      return {id:value,name:''}
    }));

  }
  const toggleChecked = () => {
    statusE.value.noticeDepts = statusE.value.noticeDepts?.length
      ? []
      : deptAllCheckedKeys.value;
  };
  const toggleExpanded = () => {
    deptExpandedKeys.value = deptExpandedKeys?.value.length
      ? []
      : deptAllExpandedKeys.value;
  };


  watch(
    () => props.list,
    async () => {
      // @ts-ignore
      deptSelectedKeys.value = props.list.map((value)=>{return value.id});
      // @ts-ignore
      statusE.value.noticeDepts = props.list.map((value)=>{return value.id});
      changes()
    },
    { deep: true, immediate: true }
  );

  // 列表是否加载
  const loading = ref(true);



</script>

<style scoped>
  .select-container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .tag-input {
    margin-right: 10px;
    min-height: 32px;
    width: 100%;
    border-radius: 5px;
    padding: 2px 10px;
    box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color))
      inset;
  }

  .tag-input > span {
    margin-right: 5px;
  }
</style>
