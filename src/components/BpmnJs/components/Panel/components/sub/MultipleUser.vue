<!-- 多选用户组件 -->
<template>
  <div class="select-container">
    <div class="tag-input">
      <el-tag
        v-for="(tag, index) in selectUserList"
        :key="tag.id"
        closable
        @close="handleDel(index)"
      >
        {{ tag.name }}
      </el-tag>
    </div>
    <el-button type="primary" @click="handleOpen">
      <el-icon>
        <Edit />
      </el-icon>
      选择
    </el-button>
  </div>
  <el-dialog
    v-model="open"
    title="选择人"
    width="1200px"
    append-to-body
    :destroy-on-close="true"
    :before-close="submit"
  >
    <select-user ref="selectUser" :list="selectUserList" @ok="multipleUserOk"/>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="submit">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { reactive, ref, watch } from 'vue';
  import { listForSelectUser } from '@/api/user';
  import SelectUser from '@/components/select-user/index.vue';

  const props = defineProps({
    list: {
      type: Array,
      default: () => [],
    },
  });

  const selectUser = ref();

  // 选择的用户信息
  const selectUserList = ref<any[]>([]);

  watch(
    () => props.list,
    async () => {
      selectUserList.value = props.list;
    },
    { deep: true, immediate: true }
  );

  // 查询参数
  const queryForm = reactive({
    name: '',
    pageNo: 1,
    pageSize: 10,
  });
  // 列表内容数量
  const total = ref(0);
  const daterange = ref([]);
  // 列表是否加载
  const loading = ref(true);
  // 列表返回值
  // eslint-disable-next-line vue/no-dupe-keys
  const list = ref<any[]>([]);
  // 是否打开弹出框
  const open = ref(false);

  /**
   * 打开选择器
   */
  const handleOpen = () => {
    // await getList();
    open.value = true;
  };

  // /**
  //  * 查询列表
  //  */
  // const getList = async () => {
  //   loading.value = true;
  //   const { data } = await listForSelectUser({
  //     pageNum: queryForm.pageNo,
  //     pageSize: queryForm.pageSize,
  //     name: queryForm.name,
  //   });
  //   addSelectUserList();
  //   list.value = data.records;
  //
  //   total.value = Number(data.total);
  //   loading.value = false;
  //
  //   reloadTableSelect();
  // };

  // /**
  //  * 添加到selectUserList
  //  */
  // const addSelectUserList = () => {
  //   tableSelectionList.value.forEach((item) => {
  //     const selectIndex = selectUserList.value.findIndex(
  //       (t) => t.id === item.id
  //     );
  //     if (selectIndex === -1) {
  //       selectUserList.value.push({
  //         id: item.id,
  //         name: item.name,
  //       });
  //     }
  //   });
  // };

  /**
   * 多选用户选择完成
   * @param list 选择的数据
   */
  const multipleUserOk = (list: any[]) => {
    // handleSelectionChange(list);
    selectUserList.value = list;
    emit('ok', selectUserList.value);
  };



  /**
   * 删除
   * @param index 下标
   */
  function handleDel(index: number) {
    const row: any = selectUserList.value.splice(index, 1);
    emit('ok', selectUserList.value);
  }

  /**
   * 提交数据
   */
  function submit() {
    // addSelectUserList();
    emit('ok', selectUserList.value);
    open.value = false;
  }

  defineExpose({
    handleOpen,
  });

  const emit = defineEmits<{
    (event: 'ok', list: any[]): void;
  }>();
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
