<script setup lang="ts">
  import ImageUpload from '@/components/image/ImageUpload.vue';
  import {computed, reactive, ref} from 'vue';
  import { useUserStore } from '@/store';
  import {
    approvalUserinfoExtData,
    updataUserInfoBaseExt,
    UserInfoBaseExt,
    UserInfoBaseExtStateResp,
    userinfoExtMy, userinfoExtMyWthdraw
  } from '@/api/user';
  import { Message } from '@arco-design/web-vue';
  import { pcaTextArr, pcTextArr } from 'element-china-area-data';

  const props = defineProps({
    privie: {
      type: Boolean,
      default: false,
    },
    taskId: {
      type: String,
      default: '',
    },
  });

  const csdselectedOptions = ref();
  const jgselectedOptions = ref();
  const sydselectedOptions = ref();
  const csdselectedOptionsR = ref();
  const jgselectedOptionsR = ref();
  const sydselectedOptionsR = ref();
  const yanshizhuangtai = ref(1);// 1个人未审核可以编辑，2个人审核中预览，3审核组件
  const yanshizhuangtaiTaskId = ref('');
  const zzmmoptions = ['群众', '共青团员', '预备党员', '中共党员'];
  const mzoptions = [
    '汉族',
    '蒙古族',
    '回族',
    '藏族',
    '维吾尔族',
    '苗族',
    '彝族',
    '壮族',
    '布依族',
    '朝鲜族',
    '满族',
    '瑶族',
    '白族',
    '哈尼族',
    '哈萨克族',
    '傣族',
    '黎族',
    '傈僳族',
    '佤族',
    '畲族',
    '高山族',
    '拉祜族',
    '水族',
    '东乡族',
    '纳西族',
    '景颇族',
    '柯尔克孜族',
    '土族',
    '达斡尔族',
    '仫佬族',
    '羌族',
    '布朗族',
    '撒拉族',
    '毛南族',
    '仡佬族',
    '锡伯族',
    '阿昌族',
    '普米族',
    '塔吉克族',
    '怒族',
    '乌孜别克族',
    '俄罗斯族',
    '鄂温克族',
    '德昂族',
    '保安族',
    '裕固族',
    '京族',
    '塔塔尔族',
    '独龙族',
    '鄂伦春族',
    '赫哲族',
    '门巴族',
    '珞巴族',
  ];
  const sfzlxOptions = ['身份证', '护照', '军官证', '其他']; // Example options for 身份证件类型
  const userinfo_base_ext_state = ref<UserInfoBaseExtStateResp>();
  const loading = ref(false);
  const form = reactive<UserInfoBaseExt>({
    zsxm: '',
    csd1: '',
    csd2: '',
    csd3: '',
    zzmm: '',
    jg1: '',
    jg2: '',
    jg3: '',
    syd1: '',
    syd2: '',
    sex: '',
    mz: '',
    csrq: '',
    studentId: undefined,
    phone: undefined,
    idPhoto: '', // 证件照
    detailAddress: '', // 详细地址
    sfzLx: '', // 身份证件类型
    sfzId: '', // 身份证号
  });
  if (props.privie){
    yanshizhuangtai.value = 3;
    // eslint-disable-next-line vue/no-setup-props-destructure
    yanshizhuangtaiTaskId.value = props.taskId;
  }

  const rules = {
    sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
    phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
    studentId: [{ required: true, message: '请输入学号', trigger: 'blur' }],
    sfzId: [{ required: true, message: '请输入证件号', trigger: 'change' }],
    csdselectedOptions: [{ required: true, message: '请选择出生地', trigger: 'change' }],
    jgselectedOptions: [{ required: true, message: '请选择籍贯', trigger: 'change' }],
    sydselectedOptions: [{ required: true, message: '请选择生源地', trigger: 'change' }],
    zzmm: [{ required: true, message: '请选择政治面貌', trigger: 'change' }],
    mz: [{ required: true, message: '请选择民族', trigger: 'change' }],
  };
  const isCommit = ref(false);
  // vs 打印文件转换节点优化，异常捕获
  const userStore = useUserStore();
  const handleSubmit = async (data) => {

    if (!form.sfzLx || !form.sfzId) {
      Message.error('证件类型和证件号必须填写');
      return;
    }
    if (!form.zsxm || !form.sex || !form.phone || !form.studentId || !form.detailAddress || !form.sfzLx || !form.sfzId || !form.idPhoto || !form.csrq) {
      Message.error('请检查必填项！');
      return;
    }

    try {
      const res = await updataUserInfoBaseExt(form);
      Message.success(res.msg);
      await userStore.info();
      await initData();
      isCommit.value = true;
    } catch (e) {
      Message.error(e);
    }
  };
  const initSelect = ()=>{
    const sydS = [];
    sydS.push(form.syd1)
    sydS.push(form.syd2)
    sydselectedOptions.value = sydS;

    const csdS = [];
    csdS.push(form.csd1)
    csdS.push(form.csd2)
    csdS.push(form.csd3)
    csdselectedOptions.value = csdS;

    const jg = [];
    jg.push(form.jg1)
    jg.push(form.jg2)
    jg.push(form.jg3)
    jgselectedOptions.value = jg;

    if (yanshizhuangtai.value===2){
      const sydS = [];
      sydS.push(userinfo_base_ext_state.value.newInfo.syd1)
      sydS.push(userinfo_base_ext_state.value.newInfo.syd2)
      sydselectedOptionsR.value = sydS;

      const csdS = [];
      csdS.push(userinfo_base_ext_state.value.newInfo.csd1)
      csdS.push(userinfo_base_ext_state.value.newInfo.csd2)
      csdS.push(userinfo_base_ext_state.value.newInfo.csd3)
      csdselectedOptionsR.value = csdS;

      const jg = [];
      jg.push(userinfo_base_ext_state.value.newInfo.jg1)
      jg.push(userinfo_base_ext_state.value.newInfo.jg2)
      jg.push(userinfo_base_ext_state.value.newInfo.jg3)
      jgselectedOptionsR.value = jg;
    }


  }
  const cleanForm = () => {
    form.phone = '';
    form.studentId = '';
    form.detailAddress = '';
    form.sfzLx = '';
    form.csrq = '';
    form.csd1 = '';
    form.csd2 = '';
    form.csd3 = '';
    form.zzmm = '';
    form.jg1 = '';
    form.jg2 = '';
    form.jg3 = '';
    form.syd1 = '';
    form.syd2 = '';
    form.sex = '';
    form.mz = '';
    form.sfzId = '';
    form.idPhoto = '';
    form.zsxm = '';

  }

  const csdChange = (newVal) => {
    // eslint-disable-next-line prefer-destructuring
    form.csd1 = newVal[0];
    // eslint-disable-next-line prefer-destructuring
    form.csd2 = newVal[1];
    // eslint-disable-next-line prefer-destructuring
    form.csd3 = newVal[2];
  };
  const sydChange = (newVal) => {
    // eslint-disable-next-line prefer-destructuring
    form.syd1 = newVal[0];
    // eslint-disable-next-line prefer-destructuring
    form.syd2 = newVal[1];
  };
  const jgChange = (newVal) => {
    // eslint-disable-next-line prefer-destructuring
    form.jg1 = newVal[0];
    // eslint-disable-next-line prefer-destructuring
    form.jg2 = newVal[1];
    // eslint-disable-next-line prefer-destructuring
    form.jg3 = newVal[2];
  };

  const cancelEdit = async () => {
    // 取消修改
    const data = await userinfoExtMyWthdraw();
    Message.success(data.msg);
    await initData();
  }
  const initData = async () => {
    loading.value = true;
    cleanForm();
    if (yanshizhuangtai.value!==3){
      const {data} = await userinfoExtMy()

      userinfo_base_ext_state.value = data;
      if (!userinfo_base_ext_state.value.state){
        yanshizhuangtai.value = 1;

        // 正在审核
        // eslint-disable-next-line no-useless-concat

      }
      else {
        yanshizhuangtai.value = 2;

      }
      form.zsxm = userinfo_base_ext_state.value.currentInfo?.zzmm || ''
      form.csd1 = userinfo_base_ext_state.value.currentInfo?.csd1 || '';
      form.csd2 = userinfo_base_ext_state.value.currentInfo?.csd2 || '';
      form.csd3 = userinfo_base_ext_state.value.currentInfo?.csd3 || '';
      // eslint-disable-next-line no-useless-concat
      form.zzmm = userinfo_base_ext_state.value.currentInfo?.zzmm || ''
      form.jg1 = userinfo_base_ext_state.value.currentInfo?.jg1 || '';
      form.jg2 = userinfo_base_ext_state.value.currentInfo?.jg2 || '';
      form.jg3 = userinfo_base_ext_state.value.currentInfo?.jg3 || '';
      form.syd1 = userinfo_base_ext_state.value.currentInfo?.syd1 || '';
      form.syd2 = userinfo_base_ext_state.value.currentInfo?.syd2 || '';
      form.sex = userinfo_base_ext_state.value.currentInfo?.sex || '';
      form.mz = userinfo_base_ext_state.value.currentInfo?.mz || '';
      form.csrq = userinfo_base_ext_state.value.currentInfo?.csrq || '';
      form.studentId = userinfo_base_ext_state.value.currentInfo?.studentId || '';
      // eslint-disable-next-line no-useless-concat
      form.phone = userinfo_base_ext_state.value.currentInfo?.phone || ''
      form.idPhoto = userinfo_base_ext_state.value.currentInfo?.idPhoto || '';
      form.detailAddress = userinfo_base_ext_state.value.currentInfo?.detailAddress || '';
      form.sfzLx = userinfo_base_ext_state.value.currentInfo?.sfzLx || '';
      form.sfzId = userinfo_base_ext_state.value.currentInfo?.sfzId || '';
    }else {
      yanshizhuangtai.value = 3;
      const {data} = await approvalUserinfoExtData(yanshizhuangtaiTaskId.value);
      form.zsxm = data?.zsxm || ''
      form.csd1 = data?.csd1 || '';
      form.csd2 = data?.csd2 || '';
      form.csd3 = data?.csd3 || '';
      // eslint-disable-next-line no-useless-concat
      form.zzmm = data?.zzmm || ''
      form.jg1 = data?.jg1 || '';
      form.jg2 = data?.jg2 || '';
      form.jg3 = data?.jg3 || '';
      form.syd1 = data?.syd1 || '';
      form.syd2 = data?.syd2 || '';
      form.sex = data?.sex || '';
      form.mz = data?.mz || '';
      form.csrq = data?.csrq || '';
      form.studentId = data?.studentId || '';
      // eslint-disable-next-line no-useless-concat
      form.phone = data?.phone || ''
      form.idPhoto = data?.idPhoto || '';
      form.detailAddress = data?.detailAddress || '';
      form.sfzLx = data?.sfzLx || '';
      form.sfzId = data?.sfzId || '';
    }
    initSelect();


    loading.value = false;
  }
  initData();
  const handleSuccess = (data) => {
    if (data.indexOf('http') !== -1) {
      // eslint-disable-next-line prefer-destructuring
      form.idPhoto = data.split('aistudio/')[1];
    } else {
      form.idPhoto = data;
    }
    Message.success('上传成功!');
  };
</script>

<template>
  <el-skeleton v-if="loading" :rows="5" animated />
  <div v-else class="safe-center">
    <a-space direction="vertical" size="large" :style="{ width: '600px' }">
      <span class="title">
        个人基础信息
        <span style="color: red" v-if="yanshizhuangtai===2">[审核中]</span>
        <span v-else-if="yanshizhuangtai===1">[修改需要审核]</span>
        <span style="color: dodgerblue;font-size: 12px;cursor: pointer" v-if="yanshizhuangtai===2" @click="cancelEdit">撤回修改</span>
      </span>
      <div style="display: flex">
        <div style="padding: 10px 10px 10px 10px;margin-right: 3rem" :style="yanshizhuangtai===1||yanshizhuangtai===3?'width:700px;':'width:350px;'">
          <el-tag size="large" v-if="yanshizhuangtai===2">当前</el-tag>

          <a-form :disabled="yanshizhuangtai!==1" ref="formRef" :rules="rules" :model="yanshizhuangtai===2?userinfo_base_ext_state.currentInfo:form" :style="{ width:yanshizhuangtai!==2?'700px': '300px' }" @submit="handleSubmit">
            <a-form-item field="zsxm" label="真实姓名">
              <a-input
                v-model="form.zsxm"
                :placeholder="
              $t('workplace.safe-center.please') +
              '真实姓名'
            "
              />
            </a-form-item>
            <a-form-item field="sex" :label="$t('workplace.safe-center.sex')">
              <a-select
                v-model="form.sex"
                :style="{ width: '320px' }"
                :placeholder="
              $t('workplace.safe-center.please') +
              $t('workplace.safe-center.sex')
            "
              >
                <a-option>男</a-option>
                <a-option>女</a-option>
                <a-option>保密</a-option>
              </a-select>
            </a-form-item>
            <a-form-item field="phone" :label="$t('workplace.safe-center.phone')">
              <a-input
                v-model="form.phone"
                :placeholder="
              $t('workplace.safe-center.please') +
              $t('workplace.safe-center.phone')
            "
              />
            </a-form-item>
            <a-form-item
              field="studentId"
              :label="$t('workplace.safe-center.studentId')"
            >
              <a-input
                v-model="form.studentId"
                :placeholder="
              $t('workplace.safe-center.please') +
              $t('workplace.safe-center.studentId')
            "
              />
            </a-form-item>
            <a-form-item label="籍贯" field="jg">
              <el-cascader
                :disabled="yanshizhuangtai!==1"
                v-model="jgselectedOptions"
                size="large"
                placeholder="请选择籍贯"
                :options="pcaTextArr"
                @change="jgChange"
              >
              </el-cascader>
            </a-form-item>
            <a-form-item label="出生地" field="csd">
              <el-cascader
                :disabled="yanshizhuangtai!==1"

                v-model="csdselectedOptions"
                placeholder="请选择出生地"
                size="large"
                :options="pcaTextArr"
                @change="csdChange"
              >
              </el-cascader>
            </a-form-item>
            <a-form-item label="详细地址" field="detailAddress">
              <el-input             v-model:model-value="form.detailAddress"
                                    :disabled="yanshizhuangtai!==1" :type="'textarea'">
              </el-input>
            </a-form-item>
            <a-form-item label="生源地" field="syd">
              <el-cascader
                v-model="sydselectedOptions"
                placeholder="请选择生源地"
                :disabled="yanshizhuangtai!==1"
                size="large"
                :options="pcTextArr"
                @change="sydChange"
              >
              </el-cascader>
            </a-form-item>
            <a-form-item label="政治面貌">
              <el-select
                v-model="form.zzmm"
                placeholder="请选择政治面貌"
                :disabled="yanshizhuangtai!==1"
                size="large"
                filterable
                style="width: 240px"
              >
                <el-option
                  v-for="item in zzmmoptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </a-form-item>
            <a-form-item label="民族">
              <el-select
                v-model="form.mz"
                placeholder="请选择民族"
                :disabled="yanshizhuangtai!==1"
                size="large"
                filterable
                style="width: 240px"
              >
                <el-option
                  v-for="item in mzoptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </a-form-item>
            <a-form-item label="证件类型" field="sfz_lx" required>
              <el-select
                v-model="form.sfzLx"
                placeholder="请选择证件类型"
                size="large"
                :disabled="yanshizhuangtai!==1"
                filterable
                style="width: 240px"
              >
                <el-option
                  v-for="item in sfzlxOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </a-form-item>
            <a-form-item label="证件号" field="sfz_id">
              <a-input
                v-model="form.sfzId"
                :placeholder="
              $t('workplace.safe-center.please') +
              $t('workplace.safe-center.sfz_id')
            "
              />
            </a-form-item>
            <a-form-item field="idPhoto" label="证件照">
              <ImageUpload
                :readonly="yanshizhuangtai!==1"
                :draggable="true"
                :image="form.idPhoto"
                url="./api/common/uploadimage"
                @on-success="handleSuccess"
              />
            </a-form-item>
            <a-form-item field="csrq" label="出生日期">
              <el-date-picker
                :disabled="yanshizhuangtai!==1"
                v-model="form.csrq"
                type="date"
                placeholder="选择出生日期"
                value-format="YYYY-MM-DD"
                :size="'large'"
              />
            </a-form-item>
            <a-form-item>
              <a-button :disabled="isCommit" type="primary" html-type="submit">{{
                  $t('workplace.safe-center.submit')
                }}</a-button>
            </a-form-item>
          </a-form>

        </div>
        <div style="width: 350px;" v-if="yanshizhuangtai===2">
          <el-tag size="large">修改成功后</el-tag>
          <a-form :disabled="yanshizhuangtai!==1" ref="formRef" :rules="rules" :model="userinfo_base_ext_state.newInfo" :style="{ width: '300px' }">
            <a-form-item field="zsxm" label="真实姓名" >
              <a-input
                v-model="userinfo_base_ext_state.newInfo.zsxm"
                :placeholder="
              $t('workplace.safe-center.please') +
              '真实姓名'
            "
              />
            </a-form-item>
            <a-form-item field="sex" :label="$t('workplace.safe-center.sex')">
              <a-select
                v-model="userinfo_base_ext_state.newInfo.sex"
                :style="{ width: '320px' }"
                :placeholder="
              $t('workplace.safe-center.please') +
              $t('workplace.safe-center.sex')
            "
              >
                <a-option>男</a-option>
                <a-option>女</a-option>
                <a-option>保密</a-option>
              </a-select>
            </a-form-item>
            <a-form-item field="phone" :label="$t('workplace.safe-center.phone')">
              <a-input
                v-model="userinfo_base_ext_state.newInfo.phone"
                :placeholder="
              $t('workplace.safe-center.please') +
              $t('workplace.safe-center.phone')
            "
              />
            </a-form-item>
            <a-form-item
              field="studentId"
              :label="$t('workplace.safe-center.studentId')"
            >
              <a-input
                v-model="userinfo_base_ext_state.newInfo.studentId"
                :placeholder="
              $t('workplace.safe-center.please') +
              $t('workplace.safe-center.studentId')
            "
              />
            </a-form-item>
            <a-form-item label="籍贯" field="jg">
              <el-cascader
                :disabled="yanshizhuangtai!==1"
                v-model="jgselectedOptionsR"
                size="large"
                placeholder="请选择籍贯"
                :options="pcaTextArr"
                @change="jgChange"
              >
              </el-cascader>
            </a-form-item>
            <a-form-item label="出生地" field="csd">
              <el-cascader
                :disabled="yanshizhuangtai!==1"

                v-model="csdselectedOptionsR"
                placeholder="请选择出生地"
                size="large"
                :options="pcaTextArr"
                @change="csdChange"
              >
              </el-cascader>
            </a-form-item>
            <a-form-item label="详细地址" field="detailAddress">
              <el-input             v-model:model-value="userinfo_base_ext_state.newInfo.detailAddress"
                                    :disabled="yanshizhuangtai!==1"
                                    :type="'textarea'">
              </el-input>
            </a-form-item>
            <a-form-item label="生源地" field="syd">
              <el-cascader
                v-model="sydselectedOptionsR"
                placeholder="请选择生源地"
                :disabled="yanshizhuangtai!==1"
                size="large"
                :options="pcTextArr"
                @change="sydChange"
              >
              </el-cascader>
            </a-form-item>
            <a-form-item label="政治面貌">
              <el-select
                v-model="userinfo_base_ext_state.newInfo.zzmm"
                placeholder="请选择政治面貌"
                :disabled="yanshizhuangtai!==1"
                size="large"
                filterable
                style="width: 240px"
              >
                <el-option
                  v-for="item in zzmmoptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </a-form-item>
            <a-form-item label="民族">
              <el-select
                v-model="userinfo_base_ext_state.newInfo.mz"
                placeholder="请选择民族"
                :disabled="yanshizhuangtai!==1"
                size="large"
                filterable
                style="width: 240px"
              >
                <el-option
                  v-for="item in mzoptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </a-form-item>
            <a-form-item label="证件类型" field="sfz_lx" required>
              <el-select
                v-model="userinfo_base_ext_state.newInfo.sfzLx"
                placeholder="请选择证件类型"
                size="large"
                :disabled="yanshizhuangtai!==1"
                filterable
                style="width: 240px"
              >
                <el-option
                  v-for="item in sfzlxOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </a-form-item>
            <a-form-item label="证件号" field="sfz_id" required>
              <a-input
                v-model="userinfo_base_ext_state.newInfo.sfzId"
                :placeholder="
              $t('workplace.safe-center.please') +
              $t('workplace.safe-center.sfz_id')
            "
              />
            </a-form-item>
            <a-form-item field="idPhoto" label="证件照">
              <ImageUpload
                :readonly="yanshizhuangtai!==1"
                :draggable="true"
                :key="userinfo_base_ext_state.newInfo.idPhoto"
                :image="userinfo_base_ext_state.newInfo.idPhoto"
                url="./api/common/uploadimage"
                @on-success="handleSuccess"
              />
            </a-form-item>
            <a-form-item field="csrq" label="出生日期">
              <el-date-picker
                :disabled="yanshizhuangtai!==1"
                v-model="userinfo_base_ext_state.newInfo.csrq"
                type="date"
                placeholder="选择出生日期"
                value-format="YYYY-MM-DD"
                :size="'large'"
              />
            </a-form-item>

          </a-form>

        </div>
      </div>
    </a-space>
  </div>
</template>

<style scoped>
  .safe-center {
    background-color: var(--color-bg-2);
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    .title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 20px;
      color: var(--color-text-1);
    }
  }
</style>
