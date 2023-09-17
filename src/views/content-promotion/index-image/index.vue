<script lang="ts" setup>
import {h, reactive, ref} from 'vue';
import {IconSearch} from '@arco-design/web-vue/es/icon';
import {Message} from '@arco-design/web-vue';
import {useAppStore} from '@/store';
import {addIndexImage, deleteIndexImage, IndexImage, listIndexImage, updateIndexImage,} from '@/api/index-image';
import {setChildrenUndefined} from '@/utils/utils';
import ImagePreview from "@/components/image/ImagePreview.vue";
import ImageUpload from "@/components/image/ImageUpload.vue";

const appStore = useAppStore();

interface statuEI {
  clickLoading: boolean;
  model?: boolean;
  modelTitle?: string;
  modelType?: string;
}

const statuEs = ref<statuEI>({
  clickLoading: false,
  model: false,
  modelTitle: '图片通知',
  modelType: 'add',
});
const tableData = ref<IndexImage[]>([]);

const form = reactive({
  id: '',
  label: '',
  image: '',
  sort: 1,
  extra: '',
});

const initData = async () => {
  statuEs.value.clickLoading = true;
  const {data} = await listIndexImage();
  setChildrenUndefined(data);
  tableData.value = data;
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
  form.image = record.image;
  form.extra = record.extra;
  statuEs.value.model = true;
};

const cleanForm = () => {
  form.id = '';
  form.sort = 1;
  form.label = '';
  form.image = '';
  form.extra = '';
};
const delHandel = async (record) => {
  const {data} = await deleteIndexImage(record.id);
  Message.success(data);
  initData();
};

const update = async (done) => {
  const forms = ref<IndexImage>({
    id: form.id,
    sort: Number(form.sort),
    label: form.label,
    image: form.image,
    extra: form.extra
  });
  try {
    const {data} = await updateIndexImage(forms.value);
    Message.success(data);
    done(true);
    initData();
  } catch (e) {
    done(false);
  }
};
const add = async (done) => {
  const forms = ref<IndexImage>({
    sort: Number(form.sort),
    label: form.label,
    image: form.image,
    extra: form.extra
  });
  try {
    const {data} = await addIndexImage(forms.value);
    Message.success(data);
    done(true);
    initData();
  } catch (e) {
    done(false);
  }
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

const handleSuccess = (data) => {
  // r为data
  if (data.indexOf('http') !== -1) {
    // eslint-disable-next-line prefer-destructuring
    form.image = data.split('aistudio/')[1];
  } else {
    form.image = data;
  }
  Message.success('上传成功!');
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
            <a-divider class="split-line" style="margin: 3px"/>
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
            :title="$t(`syscenter.index-image.image`)"
            :width="500"
          >
            <template #cell="{ record }">
              <ImagePreview :key="record.image" :img="record.image" :width="100"></ImagePreview>
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
          <a-table-column
            :title="$t(`syscenter.index-image.extra`)"
            :width="300"
          >
            <template #cell="{ record }">
              {{ record.extra }}
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
      :width="700"
      unmount-on-close
      @close="handleCancel()"
      @before-ok="handelOk"
    >
      <a-form :model="form">
        <div>
          <div>
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
          </div>
        </div>
        <div>
          <div>
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
          </div>
          <div>
            <a-form-item
              :label="$t('syscenter.index-image.extra')"
              field="extra"
              label-col-flex="80px"
            >
              <a-input
                v-model="form.extra"
                :max-length="40"
                :placeholder="$t('syscenter.index-image.tip.extra')"
              ></a-input>
            </a-form-item>
          </div>
          <div>
            <a-form-item
              :label="$t('syscenter.index-image.image')"
              field="key"
              label-col-flex="80px"
            >
              <ImageUpload
                :draggable="true"
                :image="form.image"
                url="./api/common/uploadimage"
                @on-success="handleSuccess"
              />
              <a-input v-model="form.image" disabled></a-input>
            </a-form-item>
          </div>
        </div>
      </a-form>
    </a-modal>
  </a-card>
</template>

<style lang="less" scoped></style>
