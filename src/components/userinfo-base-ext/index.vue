<script setup lang="ts">
  import ImageUpload from '@/components/image/ImageUpload.vue';
  import { computed, reactive, ref, onMounted, onActivated } from 'vue';
  import { useUserStore } from '@/store';
  import {
    approvalUserinfoExtData,
    updataUserInfoBaseExt,
    UserInfoBaseExt,
    UserInfoBaseExtStateResp,
    userinfoExtMy,
    userinfoExtMyWthdraw,
  } from '@/api/user';
  import { ElMessage } from 'element-plus';
  import { pcaTextArr, pcTextArr } from 'element-china-area-data';
  import { useI18n } from 'vue-i18n';
  import { ArrowRight } from '@element-plus/icons-vue';
  
  // 定义接口
  export interface UserFormData {
    zsxm: string; // 真实姓名
    csd1: string; // 出生地省
    csd2: string; // 出生地市
    csd3: string; // 出生地区
    zzmm: string; // 政治面貌
    jg1: string; // 籍贯省W
    jg2: string; // 籍贯市
    jg3: string; // 籍贯区
    syd1: string; // 生源地省
    syd2: string; // 生源地市
    sex: string; // 性别
    mz: string; // 民族
    csrq: string; // 出生日期
    studentId?: string | undefined; // 学号
    phone?: string | undefined; // 手机号
    idPhoto: string; // 证件照
    detailAddress: string; // 详细地址
    sfzLx: string; // 身份证件类型
    sfzId: string; // 身份证号
  }

  interface ApiResponse<T> {
    data: T;
    msg: string;
    code: number;
  }
  const { t } = useI18n();
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

  // 优化变量命名
  const birthplaceOptions = ref();
  const hometownOptions = ref();
  const originPlaceOptions = ref();
  const birthplaceOptionsForReview = ref();
  const hometownOptionsForReview = ref();
  const originPlaceOptionsForReview = ref();
  const reviewStatus = ref(1); // 1个人未审核可以编辑，2个人审核中预览，3审核组件
  const reviewTaskId = ref('');
  const politicalStatusOptions = ['群众', '共青团员', '预备党员', '中共党员'];
  const ethnicityOptions = [
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
  const idTypeOptions = ['身份证', '护照', '军官证', '其他']; // 身份证件类型选项
  const userInfoExtState = ref<UserInfoBaseExtStateResp>();
  const loading = ref(false);
  const userForm:UserFormData = reactive<UserFormData>({
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
  
  // 存储原始表单数据，用于比较是否有修改
  const originalFormData = ref<UserFormData | null>(null);
  
  // 计算属性：检查表单是否有修改
  const formDataChanged = computed(() => {
    if (!originalFormData.value) return false;
    
    // 检查所有字段是否有变化
    for (const key in userForm) {
      if (userForm[key] !== originalFormData.value[key]) {
        return true;
      }
    }
    
    return false;
  });

  if (props.privie) {
    reviewStatus.value = 3;
    // eslint-disable-next-line vue/no-setup-props-destructure
    reviewTaskId.value = props.taskId;
  }

  // 表单引用
  const formRef = ref();

  // 优化表单校验规则，确保与必填项一致
  const formRules = {
    zsxm: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
    sex: [
      { required: true, message: '请选择性别', trigger: 'change' },
    ],
    phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
    studentId: [{ required: true, message: '请输入学号', trigger: 'blur' }],
    sfzLx: [
      {
        required: true,
        message: '请选择证件类型',
        trigger: 'change',
      },
    ],
    sfzId: [{ required: true, message: '请输入证件号', trigger: 'blur' }],
    idPhoto: [{ required: true, message: '请上传证件照', trigger: 'change' }],
    csrq: [
      {
        required: true,
        message: '请选择出生日期',
        trigger: 'change',
      },
    ],
    detailAddress: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
    zzmm: [
      {
        required: true,
        message: '请选择政治面貌',
        trigger: 'change',
      },
    ],
    mz: [
      { required: true, message: '请选择民族', trigger: 'change' },
    ],
    // 使用计算属性验证级联选择器
    csd1: [
      { required: true, message: '请选择出生地', trigger: 'change' },
    ],
    jg1: [
      { required: true, message: '请选择籍贯', trigger: 'change' },
    ],
    syd1: [
      { required: true, message: '请选择生源地', trigger: 'change' },
    ],
  };

  // 监听Element UI组件变更并手动触发表单验证
  const validateField = (fieldName) => {
    if (formRef.value) {
      formRef.value.validateField(fieldName);
    }
  };

  const handleElementSelect = (field) => {
    validateField(field);
  };

  const isCommit = ref(false);
  const submitLoading = ref(false); // 添加提交按钮的加载状态

  // 数据转换函数 - 转换为API请求格式
  const convertFormToApiFormat = (formData: UserFormData): UserInfoBaseExt => {
    // 这里直接返回formData，因为目前的数据结构已经与API匹配
    // 如果未来API结构变化，可以在这里进行转换
    return formData as UserInfoBaseExt;
  };

  // 数据转换函数 - 从API响应转换为前端使用格式
  const convertApiToFormFormat = (apiData: any): UserFormData => {
    // 同样，目前直接返回，未来可在此处理数据格式差异
    return {
      zsxm: apiData?.zsxm || '',
      csd1: apiData?.csd1 || '',
      csd2: apiData?.csd2 || '',
      csd3: apiData?.csd3 || '',
      zzmm: apiData?.zzmm || '',
      jg1: apiData?.jg1 || '',
      jg2: apiData?.jg2 || '',
      jg3: apiData?.jg3 || '',
      syd1: apiData?.syd1 || '',
      syd2: apiData?.syd2 || '',
      sex: apiData?.sex || '',
      mz: apiData?.mz || '',
      csrq: apiData?.csrq || '',
      studentId: apiData?.studentId || '',
      phone: apiData?.phone || '',
      idPhoto: apiData?.idPhoto || '',
      detailAddress: apiData?.detailAddress || '',
      sfzLx: apiData?.sfzLx || '',
      sfzId: apiData?.sfzId || '',
    };
  };

  // vs 打印文件转换节点优化，异常捕获
  const userStore = useUserStore();

  // 优化表单提交，使用手动提交替代表单自动提交
  const handleFormSubmit = async (e: Event) => {
    // 阻止表单默认提交行为
    e.preventDefault();

    submitLoading.value = true;

    try {
      // 手动验证表单
      await formRef.value.validate((valid, fields) => {
        if (!valid) {
          submitLoading.value = false;
          return false;
        }
      });

      // 转换数据为API格式
      const apiData = convertFormToApiFormat(userForm);
      const response = await updataUserInfoBaseExt(apiData);
      // 类型断言为我们定义的API响应格式
      const res = response as unknown as ApiResponse<any>;
      ElMessage.success(res.msg);
      await userStore.info();
      await initData();
      isCommit.value = true;
    } catch (e) {
      // 表单验证错误或其他错误
      ElMessage.error(
        typeof e === 'object' && e !== null
          ? e.toString()
          : '提交失败，请检查表单'
      );
      console.error('Form submission error:', e);
    } finally {
      submitLoading.value = false;
    }
  };

  const initSelect = () => {
    const originPlace = [];
    originPlace.push(userForm.syd1);
    originPlace.push(userForm.syd2);
    originPlaceOptions.value = originPlace;

    const birthplace = [];
    birthplace.push(userForm.csd1);
    birthplace.push(userForm.csd2);
    birthplace.push(userForm.csd3);
    birthplaceOptions.value = birthplace;

    const hometown = [];
    hometown.push(userForm.jg1);
    hometown.push(userForm.jg2);
    hometown.push(userForm.jg3);
    hometownOptions.value = hometown;

    if (reviewStatus.value === 2) {
      const originPlaceForReview = [];
      originPlaceForReview.push(userInfoExtState.value.newInfo.syd1);
      originPlaceForReview.push(userInfoExtState.value.newInfo.syd2);
      originPlaceOptionsForReview.value = originPlaceForReview;

      const birthplaceForReview = [];
      birthplaceForReview.push(userInfoExtState.value.newInfo.csd1);
      birthplaceForReview.push(userInfoExtState.value.newInfo.csd2);
      birthplaceForReview.push(userInfoExtState.value.newInfo.csd3);
      birthplaceOptionsForReview.value = birthplaceForReview;

      const hometownForReview = [];
      hometownForReview.push(userInfoExtState.value.newInfo.jg1);
      hometownForReview.push(userInfoExtState.value.newInfo.jg2);
      hometownForReview.push(userInfoExtState.value.newInfo.jg3);
      hometownOptionsForReview.value = hometownForReview;
    }
  };

  const resetForm = () => {
    userForm.phone = '';
    userForm.studentId = '';
    userForm.detailAddress = '';
    userForm.sfzLx = '';
    userForm.csrq = '';
    userForm.csd1 = '';
    userForm.csd2 = '';
    userForm.csd3 = '';
    userForm.zzmm = '';
    userForm.jg1 = '';
    userForm.jg2 = '';
    userForm.jg3 = '';
    userForm.syd1 = '';
    userForm.syd2 = '';
    userForm.sex = '';
    userForm.mz = '';
    userForm.sfzId = '';
    userForm.idPhoto = '';
    userForm.zsxm = '';
  };

  const handleBirthplaceChange = (newVal) => {
    // eslint-disable-next-line prefer-destructuring
    userForm.csd1 = newVal[0];
    // eslint-disable-next-line prefer-destructuring
    userForm.csd2 = newVal[1];
    // eslint-disable-next-line prefer-destructuring
    userForm.csd3 = newVal[2];
    // 手动触发验证
    validateField('csd1');
  };

  const handleOriginPlaceChange = (newVal) => {
    // eslint-disable-next-line prefer-destructuring
    userForm.syd1 = newVal[0];
    // eslint-disable-next-line prefer-destructuring
    userForm.syd2 = newVal[1];
    // 手动触发验证
    validateField('syd1');
  };

  const handleHometownChange = (newVal) => {
    // eslint-disable-next-line prefer-destructuring
    userForm.jg1 = newVal[0];
    // eslint-disable-next-line prefer-destructuring
    userForm.jg2 = newVal[1];
    // eslint-disable-next-line prefer-destructuring
    userForm.jg3 = newVal[2];
    // 手动触发验证
    validateField('jg1');
  };

  const cancelEdit = async () => {
    // 取消修改
    const response = await userinfoExtMyWthdraw();
    // 类型断言为我们定义的API响应格式
    const data = response as unknown as ApiResponse<any>;
    ElMessage.success(data.msg);
    // 重置提交状态，允许再次编辑和提交
    isCommit.value = false;
    await initData();
  };

  const initData = async () => {
    loading.value = true;
    resetForm();
    if (reviewStatus.value !== 3) {
      const response = await userinfoExtMy();
      userInfoExtState.value = response.data;

      if (!userInfoExtState.value.state) {
        reviewStatus.value = 1;
        // 当状态为可编辑时，重置提交状态
        isCommit.value = false;
      } else {
        reviewStatus.value = 2;
      }

      // 从API响应数据转换为表单数据
      if (userInfoExtState.value.currentInfo) {
        const formData = convertApiToFormFormat(
          userInfoExtState.value.currentInfo
        );
        // 将转换后的数据应用到表单
        Object.assign(userForm, formData);
        
        // 保存原始数据的副本，用于比较是否有修改
        originalFormData.value = JSON.parse(JSON.stringify(formData));
      }
    } else {
      reviewStatus.value = 3;
      const response = await approvalUserinfoExtData(reviewTaskId.value);
      // 从API响应数据转换为表单数据
      const formData = convertApiToFormFormat(response.data);
      // 将转换后的数据应用到表单
      Object.assign(userForm, formData);
      
      // 保存原始数据的副本，用于比较是否有修改
      originalFormData.value = JSON.parse(JSON.stringify(formData));
    }

    initSelect();
    loading.value = false;
  };

  // 组件挂载时刷新数据
  onMounted(() => {
    initData();
  });

  // 组件每次被激活时刷新数据
  onActivated(() => {
    initData();
  });

  const handleSuccess = (data) => {
    if (data.indexOf('http') !== -1) {
      // eslint-disable-next-line prefer-destructuring
      userForm.idPhoto = data.split('aistudio/')[1];
    } else {
      userForm.idPhoto = data;
    }
    ElMessage.success('上传成功!');
  };
</script>

<template>
  <el-skeleton v-if="loading" :rows="5" animated />
  <div v-else class="safe-center">
    <el-space direction="vertical" size="large" style="width: 100%">
      <div class="header-section">
        <span class="title">
          个人基础信息
          <span v-if="reviewStatus === 2" class="status-tag status-reviewing">[审核中]</span>
          <span v-else-if="reviewStatus === 1" class="status-tag status-editable">[修改需要审核]</span>
        </span>
        <span
          v-if="reviewStatus === 2"
          class="cancel-btn"
          @click="cancelEdit"
          >撤回修改</span
        >
      </div>
      <div class="form-container">
        <div class="form-wrapper primary-form" :class="{ 'grid-form': reviewStatus === 1 }">
          <el-tag v-if="reviewStatus === 2" size="large" class="form-tag">当前</el-tag>

          <el-form
            ref="formRef"
            :disabled="reviewStatus !== 1"
            :rules="formRules"
            :model="userForm"
            class="info-form"
            :class="{ 'grid-layout': reviewStatus === 1 }"
          >
            <el-form-item prop="zsxm" label="真实姓名" required>
              <el-input
                v-model="userForm.zsxm"
                :placeholder="t('workplace.safe-center.please') + '真实姓名'"
                class="form-input"
                @blur="validateField('zsxm')"
              />
            </el-form-item>
            <el-form-item
              prop="sex"
              :label="t('workplace.safe-center.sex')"
              required
            >
              <el-select
                v-model="userForm.sex"
                class="form-select"
                :placeholder="
                  t('workplace.safe-center.please') +
                  t('workplace.safe-center.sex')
                "
                @change="validateField('sex')"
              >
                <el-option value="男" label="男" />
                <el-option value="女" label="女" />
                <el-option value="保密" label="保密" />
              </el-select>
            </el-form-item>
            <el-form-item
              prop="phone"
              :label="t('workplace.safe-center.phone')"
              required
            >
              <el-input
                v-model="userForm.phone"
                :placeholder="
                  t('workplace.safe-center.please') +
                  t('workplace.safe-center.phone')
                "
                class="form-input"
                @blur="validateField('phone')"
              />
            </el-form-item>
            <el-form-item
              prop="studentId"
              :label="t('workplace.safe-center.studentId')"
              required
            >
              <el-input
                v-model="userForm.studentId"
                :placeholder="
                  t('workplace.safe-center.please') +
                  t('workplace.safe-center.studentId')
                "
                class="form-input"
                @blur="validateField('studentId')"
              />
            </el-form-item>
            <el-form-item label="籍贯" prop="jg1" required>
              <el-cascader
                v-model="hometownOptions"
                :disabled="reviewStatus !== 1"
                size="large"
                placeholder="请选择籍贯"
                :options="pcaTextArr"
                @change="handleHometownChange"
                class="form-cascader"
              >
              </el-cascader>
            </el-form-item>
            <el-form-item label="出生地" prop="csd1" required>
              <el-cascader
                v-model="birthplaceOptions"
                :disabled="reviewStatus !== 1"
                placeholder="请选择出生地"
                size="large"
                :options="pcaTextArr"
                @change="handleBirthplaceChange"
                class="form-cascader"
              >
              </el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" prop="detailAddress" required>
              <el-input
                v-model="userForm.detailAddress"
                :disabled="reviewStatus !== 1"
                type="textarea"
                @blur="validateField('detailAddress')"
                class="form-textarea"
                rows="3"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="生源地" prop="syd1" required>
              <el-cascader
                v-model="originPlaceOptions"
                placeholder="请选择生源地"
                :disabled="reviewStatus !== 1"
                size="large"
                :options="pcTextArr"
                @change="handleOriginPlaceChange"
                class="form-cascader"
              >
              </el-cascader>
            </el-form-item>
            <el-form-item label="政治面貌" prop="zzmm" required>
              <el-select
                v-model="userForm.zzmm"
                placeholder="请选择政治面貌"
                :disabled="reviewStatus !== 1"
                size="large"
                filterable
                class="form-select"
                @change="() => validateField('zzmm')"
              >
                <el-option
                  v-for="item in politicalStatusOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="民族" prop="mz" required>
              <el-select
                v-model="userForm.mz"
                placeholder="请选择民族"
                :disabled="reviewStatus !== 1"
                size="large"
                filterable
                class="form-select"
                @change="() => validateField('mz')"
              >
                <el-option
                  v-for="item in ethnicityOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="证件类型" prop="sfzLx" required>
              <el-select
                v-model="userForm.sfzLx"
                placeholder="请选择证件类型"
                size="large"
                :disabled="reviewStatus !== 1"
                filterable
                class="form-select"
                @change="() => validateField('sfzLx')"
              >
                <el-option
                  v-for="item in idTypeOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="证件号" prop="sfzId" required>
              <el-input
                v-model="userForm.sfzId"
                :placeholder="
                  t('workplace.safe-center.please') +
                  t('workplace.safe-center.sfz_id')
                "
                class="form-input"
                @blur="validateField('sfzId')"
              />
            </el-form-item>
            <el-form-item prop="idPhoto" label="证件照" required>
              <ImageUpload
                :readonly="reviewStatus !== 1"
                :draggable="true"
                :image="userForm.idPhoto"
                url="./api/common/uploadimage"
                @on-success="handleSuccess"
                class="image-upload"
              />
            </el-form-item>
            <el-form-item prop="csrq" label="出生日期" required>
              <el-date-picker
                v-model="userForm.csrq"
                :disabled="reviewStatus !== 1"
                type="date"
                placeholder="选择出生日期"
                value-format="YYYY-MM-DD"
                size="large"
                @change="() => validateField('csrq')"
                class="form-date-picker"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                v-if="reviewStatus === 1"
                :disabled="isCommit || !formDataChanged"
                :loading="submitLoading"
                type="primary"
                size="large"
                class="submit-button"
                @click="handleFormSubmit($event)"
              >
                {{ t('workplace.safe-center.submit') }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 添加数据迁移动画 -->
        <div v-if="reviewStatus === 2" class="migration-animation">
          <div class="transfer-icon-container">
            <el-icon class="transfer-icon-item"><ArrowRight /></el-icon>
            <el-icon class="transfer-icon-item delay1"><ArrowRight /></el-icon>
            <el-icon class="transfer-icon-item delay2"><ArrowRight /></el-icon>
          </div>
          <div class="migration-text">数据审核中</div>
        </div>

        <div v-if="reviewStatus === 2" class="form-wrapper review-form">
          <el-tag size="large" class="form-tag review-tag">修改成功后</el-tag>
          <el-form
            disabled
            :model="userInfoExtState.newInfo"
            class="info-form"
          >
            <el-form-item prop="zsxm" label="真实姓名" required>
              <el-input
                v-model="userInfoExtState.newInfo.zsxm"
                :placeholder="t('workplace.safe-center.please') + '真实姓名'"
                class="form-input"
              />
            </el-form-item>
            <el-form-item
              prop="sex"
              :label="t('workplace.safe-center.sex')"
              required
            >
              <el-select
                v-model="userInfoExtState.newInfo.sex"
                class="form-select"
                :placeholder="
                  t('workplace.safe-center.please') +
                  t('workplace.safe-center.sex')
                "
              >
                <el-option value="男" label="男" />
                <el-option value="女" label="女" />
                <el-option value="保密" label="保密" />
              </el-select>
            </el-form-item>
            <el-form-item
              prop="phone"
              :label="t('workplace.safe-center.phone')"
              required
            >
              <el-input
                v-model="userInfoExtState.newInfo.phone"
                :placeholder="
                  t('workplace.safe-center.please') +
                  t('workplace.safe-center.phone')
                "
                class="form-input"
              />
            </el-form-item>
            <el-form-item
              prop="studentId"
              :label="t('workplace.safe-center.studentId')"
              required
            >
              <el-input
                v-model="userInfoExtState.newInfo.studentId"
                :placeholder="
                  t('workplace.safe-center.please') +
                  t('workplace.safe-center.studentId')
                "
                class="form-input"
              />
            </el-form-item>
            <el-form-item label="籍贯" prop="jg1" required>
              <el-cascader
                v-model="hometownOptionsForReview"
                disabled
                size="large"
                placeholder="请选择籍贯"
                :options="pcaTextArr"
                class="form-cascader"
              >
              </el-cascader>
            </el-form-item>
            <el-form-item label="出生地" prop="csd1" required>
              <el-cascader
                v-model="birthplaceOptionsForReview"
                disabled
                placeholder="请选择出生地"
                size="large"
                :options="pcaTextArr"
                class="form-cascader"
              >
              </el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" prop="detailAddress" required>
              <el-input
                v-model="userInfoExtState.newInfo.detailAddress"
                disabled
                type="textarea"
                class="form-textarea"
                rows="3"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="生源地" prop="syd1" required>
              <el-cascader
                v-model="originPlaceOptionsForReview"
                placeholder="请选择生源地"
                disabled
                size="large"
                :options="pcTextArr"
                class="form-cascader"
              >
              </el-cascader>
            </el-form-item>
            <el-form-item label="政治面貌" prop="zzmm" required>
              <el-select
                v-model="userInfoExtState.newInfo.zzmm"
                placeholder="请选择政治面貌"
                disabled
                size="large"
                filterable
                class="form-select"
              >
                <el-option
                  v-for="item in politicalStatusOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="民族" prop="mz" required>
              <el-select
                v-model="userInfoExtState.newInfo.mz"
                placeholder="请选择民族"
                disabled
                size="large"
                filterable
                class="form-select"
              >
                <el-option
                  v-for="item in ethnicityOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="证件类型" prop="sfzLx" required>
              <el-select
                v-model="userInfoExtState.newInfo.sfzLx"
                placeholder="请选择证件类型"
                size="large"
                disabled
                filterable
                class="form-select"
              >
                <el-option
                  v-for="item in idTypeOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="证件号" prop="sfzId" required>
              <el-input
                v-model="userInfoExtState.newInfo.sfzId"
                :placeholder="
                  t('workplace.safe-center.please') +
                  t('workplace.safe-center.sfz_id')
                "
                class="form-input"
              />
            </el-form-item>
            <el-form-item prop="idPhoto" label="证件照" required>
              <ImageUpload
                :key="userInfoExtState.newInfo.idPhoto"
                readonly
                :draggable="true"
                :image="userInfoExtState.newInfo.idPhoto"
                url="./api/common/uploadimage"
                @on-success="handleSuccess"
                class="image-upload"
              />
            </el-form-item>
            <el-form-item prop="csrq" label="出生日期" required>
              <el-date-picker
                v-model="userInfoExtState.newInfo.csrq"
                disabled
                type="date"
                placeholder="选择出生日期"
                value-format="YYYY-MM-DD"
                size="large"
                class="form-date-picker"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-space>
  </div>
</template>

<style scoped>
  .safe-center {
    background-color: var(--el-bg-color);
    padding: 24px;
    border-radius: 8px;
    box-shadow: none;
    max-width: 1400px;
    margin: 0 auto;
  }
  
  .header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--el-border-color);
  }
  
  .title {
    font-size: 22px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .status-tag {
    font-size: 14px;
    font-weight: normal;
    padding: 2px 8px;
    border-radius: 4px;
  }
  
  .status-reviewing {
    color: var(--el-color-danger);
    background-color: var(--el-color-danger-light-9);
  }
  
  .status-editable {
    color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
  }
  
  .cancel-btn {
    color: var(--el-color-primary);
    font-size: 14px;
    cursor: pointer;
    padding: 4px 12px;
    border-radius: 4px;
    transition: all 0.3s;
  }
  
  .cancel-btn:hover {
    background-color: var(--el-color-primary-light-9);
  }
  
  .form-container {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
  
  .form-wrapper {
    flex: 1;
    min-width: 320px;
    max-width: 600px;
    position: relative;
    padding: 24px;
    border-radius: 8px;
    background-color: var(--el-bg-color);
    box-shadow: none;
  }
  
  .primary-form {
    border: 1px solid var(--el-border-color);
  }
  
  .review-form {
    background-color: var(--el-color-success-light-9);
    border: 1px dashed var(--el-border-color);
  }
  
  .form-tag {
    position: absolute;
    top: -12px;
    left: 24px;
    z-index: 1;
  }
  
  .review-tag {
    background-color: var(--el-color-success);
    color: white;
  }
  
  .info-form {
    margin-top: 12px;
    width: 100%;
  }
  
  .form-input,
  .form-select,
  .form-cascader,
  .form-date-picker {
    width: 100%;
  }
  
  .form-textarea {
    width: 100%;
    min-height: 80px;
  }
  
  .image-upload {
    width: 100%;
  }
  
  .submit-button {
    margin-top: 16px;
    width: 120px;
    height: 40px;
  }
  
  /* 数据迁移动画样式 */
  .migration-animation {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    margin: 0 5px;
  }
  
  .transfer-icon-container {
    display: flex;
    margin-bottom: 8px;
  }
  
  .transfer-icon-item {
    font-size: 24px;
    color: var(--el-color-primary);
    margin: 0 -8px;
    animation: pulse 1.5s infinite;
  }
  
  .delay1 {
    animation-delay: 0.2s;
  }
  
  .delay2 {
    animation-delay: 0.4s;
  }
  
  .migration-text {
    font-size: 14px;
    color: var(--el-color-primary);
    font-weight: bold;
  }
  
  @keyframes pulse {
    0% {
      opacity: 0.3;
      transform: scale(0.8);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
    100% {
      opacity: 0.3;
      transform: scale(0.8);
    }
  }
  
  /* 响应式调整 */
  @media (max-width: 1200px) {
    .form-container {
      flex-direction: column;
      align-items: center;
    }
    
    .form-wrapper {
      width: 100%;
      max-width: 800px;
    }
    
    .migration-animation {
      transform: rotate(90deg);
      margin: 20px 0;
    }
  }

  /* 表单左对齐样式 */
  :deep(.el-form-item__label) {
    text-align: left;
    justify-content: flex-start;
    padding-right: 0;
    width: 100px !important;
    color: var(--el-text-color-primary);
    font-weight: normal;
  }

  :deep(.el-form--default .el-form-item) {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 20px;
  }

  :deep(.el-form-item__content) {
    margin-left: 0 !important;
    flex: 1;
  }

  :deep(.el-form-item__label-wrap) {
    width: 100px;
    margin-right: 12px;
  }

  :deep(.el-input__wrapper),
  :deep(.el-select),
  :deep(.el-cascader),
  :deep(.el-date-picker) {
    text-align: left;
    width: 100%;
  }

  :deep(.el-select .el-input) {
    text-align: left;
  }

  :deep(.el-form-item) {
    text-align: left;
    margin-bottom: 20px;
  }
  
  /* 确保表单内容左对齐 */
  :deep(.el-input__inner) {
    text-align: left;
  }

  :deep(.el-textarea__inner) {
    text-align: left;
  }

  :deep(.el-cascader__label) {
    text-align: left;
  }

  :deep(.el-date-editor .el-input__inner) {
    text-align: left;
  }

  /* 确保选择器中的内容左对齐 */
  :deep(.el-select__popper .el-select-dropdown__item) {
    text-align: left;
  }

  /* 设置表单为左对齐布局 */
  :deep(.el-form--label-top .el-form-item__label) {
    display: flex;
    align-items: flex-start;
    margin-bottom: 8px;
  }

  /* 必填项红色星号样式 */
  :deep(.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before) {
    color: var(--el-color-danger);
    content: "* ";
    margin-right: 4px;
  }

  /* 表单整体布局 */
  .info-form {
    padding: 10px;
  }

  /* 控制表单项间距，确保整齐 */
  :deep(.el-form-item + .el-form-item) {
    margin-top: 16px;
  }

  /* 添加编辑状态下的表单网格布局，使表单项按照固定高度排列，并向右和向下流动 */
  .grid-layout {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: start;
    padding: 15px 30px;
    position: relative;
  }
  
  /* 表单项在网格布局中的样式 */
  .grid-layout :deep(.el-form-item) {
    width: calc(50% - 60px);
    margin-right: 0;
    margin-bottom: 0;
    height: 70px;
    overflow: visible;
    margin-top: 0;
  }
  
  /* 创建两栏布局并添加中间分隔 */
  .grid-layout :deep(.el-form-item:nth-child(odd)) {
    margin-right: 60px;
    position: relative;
  }
  
  .grid-layout :deep(.el-form-item:nth-child(odd)):after {
    content: '';
    position: absolute;
    right: -30px;
    top: 5px;
    bottom: 5px;
    width: 1px;
    background-color: #dcdfe6;
  }
  
  /* 特殊情况处理 - 占据整行的元素 */
  .grid-layout :deep(.el-form-item[prop="idPhoto"]),
  .grid-layout :deep(.el-form-item[prop="detailAddress"]),
  .grid-layout :deep(.el-form-item:last-child) {
    width: 100%;
    margin-right: 0;
  }
  
  .grid-layout :deep(.el-form-item[prop="idPhoto"]):after,
  .grid-layout :deep(.el-form-item[prop="detailAddress"]):after,
  .grid-layout :deep(.el-form-item:last-child):after {
    display: none;
  }
  
  /* 特殊情况处理的高度 */
  .grid-layout :deep(.el-form-item[prop="idPhoto"]) {
    height: auto;
    min-height: 220px;
  }
  
  .grid-layout :deep(.el-form-item[prop="detailAddress"]) {
    height: auto;
    min-height: 120px;
  }
  
  /* 为需要更多高度的元素设置合适的高度 */
  .grid-layout :deep(.el-form-item[prop="jg1"]),
  .grid-layout :deep(.el-form-item[prop="csd1"]),
  .grid-layout :deep(.el-form-item[prop="syd1"]) {
    height: 90px;
  }
  
  /* 提交按钮容器占满整行 */
  .grid-layout :deep(.el-form-item:last-child) {
    text-align: center;
    margin-top: 20px;
    height: auto;
    border-top: 1px solid #ebeef5;
    padding-top: 20px;
  }
  
  /* 提交按钮样式 */
  .grid-layout .submit-button {
    width: 180px;
    margin: 0 auto;
  }
  
  /* 为网格布局下的表单容器添加样式 */
  .grid-form {
    max-width: 100% !important;
    width: 100% !important;
    min-width: 100% !important;
  }
  
  .grid-form .info-form {
    padding: 15px;
  }
  
  /* 确保表单内容在网格中正确对齐 */
  .grid-layout :deep(.el-form-item__content) {
    display: flex;
    align-items: center;
  }
  
  /* 确保网格布局下表单项的标签占用合适的宽度 */
  .grid-layout :deep(.el-form-item__label) {
    width: 90px !important;
    flex-shrink: 0;
  }
  
  /* 响应式调整网格布局 */
  @media (max-width: 992px) {
    .grid-layout :deep(.el-form-item) {
      width: 100%;
      margin-right: 0;
    }
    
    .grid-layout :deep(.el-form-item:nth-child(odd)):after {
      display: none;
    }
    
    .grid-layout :deep(.el-form-item) {
      height: auto;
      min-height: 70px;
    }
    
    .grid-layout :deep(.el-form-item[prop="jg1"]),
    .grid-layout :deep(.el-form-item[prop="csd1"]),
    .grid-layout :deep(.el-form-item[prop="syd1"]) {
      height: auto;
      min-height: 80px;
    }
  }
</style>
