<script lang="ts" setup>
  import { h, reactive, ref } from 'vue';
  import { IconSearch } from '@arco-design/web-vue/es/icon';
  import { Message } from '@arco-design/web-vue';
  import { useAppStore } from '@/store';
  import {
    addIndexImage,
    deleteIndexImage,
    IndexImage, IndexImageAddReq,
    listIndexImage,
    updateIndexImage,
  } from '@/api/index-image';
  import { setChildrenUndefined } from '@/utils/utils';
  import ImagePreview from '@/components/image/ImagePreview.vue';
  import ImageUpload from '@/views/dashboard/workplace/components/index-image-upload.vue';
  import {deptListTree} from "@/api/dept";

  const appStore = useAppStore();

  interface statuEI {
    clickLoading: boolean;
    model?: boolean;
    modelTitle?: string;
    modelType?: string;
    deptFuziliandong: boolean;

  }

  const statuEs = ref<statuEI>({
    clickLoading: false,
    model: false,
    modelTitle: '图片通知',
    modelType: 'add',
    deptFuziliandong:false,
  });
  const tableData = ref<IndexImage[]>([]);
  const deptTreeData = ref([]);
  const deptAllCheckedKeys = ref([]);
  const deptAllExpandedKeys = ref([]);

  const deptSelectedKeys = ref([]);
  const deptExpandedKeys = ref([]);

  const form = reactive({
    id: '',
    label: '',
    sort: 1,
    data: [
      {
        image: '',
        extra: '',
      },
    ],
    visibility:1,// 默认全体成员可见
  });
  const depts = ref([])

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
  const initDataDept = async () => {
    const {data} = await deptListTree();
    deptTreeData.value = data;
    getAllId(data);
    deptAllCheckedKeys.value = deptAllExpandedKeys.value;
    if (deptExpandedKeys.value?.length === 0) {
      toggleExpanded();
    }
  }
  const initData = async () => {
    statuEs.value.clickLoading = true;
    const { data } = await listIndexImage();
    setChildrenUndefined(data);
    tableData.value = data;
    await initDataDept();
    statuEs.value.clickLoading = false;

  };
  initData();


  const addHandel = (record) => {
    statuEs.value.modelTitle = '添加图片';
    statuEs.value.modelType = 'add';
    statuEs.value.model = true;
  };

  const editHandel = (record) => {
    statuEs.value.modelTitle = '编辑图片';
    statuEs.value.modelType = 'edit';
    form.id = record.id;
    form.label = record.label;
    form.sort = record.sort;
    form.data = record.data;
    depts.value = record.depts ? record.depts : [];
    form.visibility = record.visibility;
    statuEs.value.model = true;
  };

  const cleanForm = () => {
    form.id = '';
    form.sort = 1;
    form.label = '';
    form.visibility = 1;
    depts.value = [];
    form.data = [
      {
        image: '',
        extra: '',
      },
    ];
  };
  const delHandel = async (record) => {
    const { data } = await deleteIndexImage(record.id);
    Message.success(data);
    initData();
  };

  const update = async (done) => {
    const forms = ref<IndexImageAddReq>({
      indexImage:{
        id: form.id,
        sort: Number(form.sort),
        label: form.label,
        data: form.data,
        visibility:form.visibility
      },
      deptIds:depts.value
    });
    try {
      const { data } = await updateIndexImage(forms.value);
      Message.success(data);
      done(true);
      initData();
    } catch (e) {
      done(false);
    }
  };
  const add = async (done) => {
    const forms = ref<IndexImageAddReq>({
      indexImage:{
        sort: Number(form.sort),
        label: form.label,
        data: form.data,
        visibility:form.visibility
      },
      deptIds:depts.value
    });
    try {
      console.log('上传');
      console.log(forms.value);
      const { data } = await addIndexImage(forms.value);
      Message.success(data);
      done(true);
      initData();
    } catch (e) {
      done(false);
    }
  };

  const toggleChecked = () => {
    depts.value = depts.value?.length ? [] : deptAllCheckedKeys.value;
  };
  const toggleExpanded = () => {
    deptExpandedKeys.value = deptExpandedKeys?.value.length
      ? []
      : deptAllExpandedKeys.value;
  };

  const handelOk = (done) => {
    // 根据form加上statuEs判断
    if (statuEs.value.modelType !== 'add') {
      update(done);
    } else {
      add(done);
    }
  };

  const handleCancel = () => {
    cleanForm();
  };

  const handleSuccess = (data, index) => {
    // r为data
    if (data.indexOf('http') !== -1) {
      // eslint-disable-next-line prefer-destructuring
      form.data[index].image = data.split('aistudio/')[1];
    } else {
      form.data[index].image = data;
    }
    Message.success('上传成功!');
  };
  const removeBlock = (index) => {
    // 从数组中移除指定索引的块
    form.data.splice(index, 1);
  };
  const addBlock = () => {
    form.data.push({
      image: '',
      extra: '',
    });
  };
</script>

<template>
  <a-card>
    <a-space>
      <a-table
        :bordered="false"
        :data="tableData"
        :loading="statuEs.clickLoading"
        :pagination="false"
        :size="'medium'"
        row-key="id"
      >
        <template #columns>
          <a-space direction="vertical">
            <a-space direction="vertical">
              <a-button
                :loading="statuEs.clickLoading"
                type="primary"
                @click="addHandel"
              >
                {{ $t('syscenter.index-image.control.add') }}
              </a-button>
            </a-space>
            <a-divider class="split-line" style="margin: 3px" />
          </a-space>

          <a-table-column
            :filterable="{
              filter: (value, record) => record.label.includes(value),
              slotName: 'locale-filter',
              icon: () => h(IconSearch),
            }"
            :title="$t(`syscenter.index-image.label`)"
            :width="200"
          >
            <template #cell="{ record }">
              {{ $t(record.label) }}
            </template>
          </a-table-column>

          <a-table-column
            title="可见性"
            :width="100"
          >
            <template #cell="{ record }">
              <el-tag v-if="record.visibility===1" :type="'success'">全体可见</el-tag>
              <el-tag v-else :type="'danger'">仅部门可见</el-tag>
            </template>
          </a-table-column>
          <a-table-column title="列表" :width="500">
            <template #cell="{ record }">
              <div
                style="
                  display: flex;
                  flex-direction: row;
                  align-items: flex-end;
                "
              >
                <div
                  v-for="(ds, index) in record.data"
                  :key="index"
                  style="
                    margin-right: 10px;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                  "
                >
                  <!-- ImagePreview 组件需要能够处理其尺寸 -->
                  <ImagePreview
                    :key="ds.image"
                    :img="ds.image"
                    :width="100"
                    style="object-fit: cover; height: auto"
                  />
                  <div style="margin-top: 8px">
                    <a-tag>额外信息</a-tag>{{ ds.extra }}
                  </div>
                </div>
              </div>
            </template>
          </a-table-column>
          <a-table-column
            :sortable="{
              sortDirections: ['ascend', 'descend'],
            }"
            :title="$t(`syscenter.index-image.sort`)"
            :width="100"
          >
            <template #cell="{ record }">
              {{ record.sort }}
            </template>
          </a-table-column>
          <a-table-column :title="$t(`syscenter.index-image.control`)">
            <template #cell="{ record }">
              <a-button @click="editHandel(record)"
                >{{ $t('syscenter.index-image.control.edit') }}
              </a-button>
              <a-popconfirm
                content="危险！将会删除该图片且不可恢复，确认删除?"
                @ok="delHandel(record)"
              >
                <a-button
                  >{{ $t('syscenter.index-image.control.delete') }}
                </a-button>
              </a-popconfirm>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-space>
    <a-modal
      v-model:visible="statuEs.model"
      :draggable="false"
      :fullscreen="appStore.modelFullscreen"
      :hide-cancel="false"
      :title="statuEs.modelTitle"
      :title-align="'start'"
      :width="1200"
      unmount-on-close
      @close="handleCancel()"
      @before-ok="handelOk"
    >
      <a-form :model="form">

        <div style="display: flex;flex-direction: row;">
          <div style="min-width: 400px;">
            <a-form-item
              :label="$t('syscenter.index-image.label')"
              field="label"
              label-col-flex="80px"
            >
              <a-input
                v-model="form.label"
                :placeholder="$t('syscenter.index-image.tip.label')"
              ></a-input>
            </a-form-item>
            <a-form-item
              :label="$t('syscenter.index-image.sort')"
              field="sort"
              label-col-flex="80px"
            >
              <a-input-number
                v-model="form.sort"
                :max="100"
                :min="1"
              ></a-input-number>
            </a-form-item>
            <a-form-item
              label="可见性"
              tooltip="通知谁可见"
              field="visibility"
              label-col-flex="80px"
            >
              <a-select
                v-model:model-value="form.visibility"
                :scrollbar="true"
                :style="{ width: '140px' }"
                placeholder="请选择可见模式"
              >
                <a-option :value="1"> 全体成员 </a-option>
                <a-option :value="2"> 指定部门可见 </a-option>
              </a-select>
            </a-form-item>
            <div v-if="form.visibility === 2">
              <div> 不包含子部门！请手动选择所需要的所有部门</div>
              <a-button-group style="margin-bottom: 20px">
                <a-button type="primary" @click="toggleChecked">
                  {{ depts?.length ? '反全选' : '全选' }}
                </a-button>
                <a-button type="primary" @click="toggleExpanded">
                  {{ deptExpandedKeys?.length ? '折叠' : '展开全部' }}
                </a-button>
              </a-button-group>

              <a-tree
                v-model:checked-keys="depts"
                v-model:expanded-keys="deptExpandedKeys"
                v-model:selected-keys="deptSelectedKeys"
                style="overflow-y: scroll; height: 20rem"
                :check-strictly="!statuEs.deptFuziliandong"
                :checkable="true"
                :data="deptTreeData"
                :field-names="{
              key: 'id',
              title: 'deptName',
              children: 'children',
            }"
              >
              </a-tree>
            </div>
          </div>
          <div>
            <!--            <a-form-item-->
            <!--              :label="$t('syscenter.index-image.extra')"-->
            <!--              field="extra"-->
            <!--              label-col-flex="80px"-->
            <!--            >-->
            <!--              <a-input-->
            <!--                v-model="form.extra"-->
            <!--                :max-length="40"-->
            <!--                :placeholder="$t('syscenter.index-image.tip.extra')"-->
            <!--              ></a-input>-->
            <!--            </a-form-item>-->
          </div>

          <div style="overflow-y: auto;height: 600px;min-width: 400px;">
            <div
              v-for="(block, index) in form.data"
              :key="index"
              class="form-block box-item"
            >
              <span class="titles">第{{index+1}}个</span>
              <a-form-model-item label="图片上传">
                <div>
                  <a-form-item
                    :label="$t('syscenter.index-image.image')"
                    field="key"
                    label-col-flex="80px"
                  >
                    <ImageUpload
                      :draggable="true"
                      :image="block.image"
                      :sddex="index"
                      url="./api/common/uploadimage"
                      @on-success="handleSuccess"
                    />
                  </a-form-item>
                </div>
              </a-form-model-item>
              <a-form-model-item label="输入框">
                <a-input v-model="block.extra" placeholder="请输入内容" />
              </a-form-model-item>
              <a-button type="danger" @click="removeBlock(index)">删除</a-button>
            </div>
          </div>
          <!-- 动态创建的表单项块 -->


          <!-- 添加按钮 -->
          <a-button type="primary" @click="addBlock">添加块</a-button>
        </div>
      </a-form>
    </a-modal>
  </a-card>
</template>

<style lang="less" scoped>
.box-item {
  position: relative;
  border: 1px solid #dcdcdc; /* 浅色细边框 */
  padding: 20px;
  margin: 10px;
}
.box-item .titles {
  content: "标题"; /* 这里写你的标题 */
  position: absolute;
  top: -10px; /* 根据边框宽度调整这个值 */
  left: 10px; /* 根据需要调整标题的左右位置 */
  background: white; /* 背景色与包裹框相同 */
  padding: 0 5px;
  font-weight: bold;
  /* 其他样式，如字体大小、颜色等 */
}

</style>
