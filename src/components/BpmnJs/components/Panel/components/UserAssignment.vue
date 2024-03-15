<template>
  <el-card shadow="never">
    <el-divider content-position="left">用户分配</el-divider>
    <el-form label-width="80px">
      <el-form-item label="类型">
        <el-radio-group
          v-model="UAForm.userType"
          @change="updateUserAssignProp('userType', $event)"
        >
          <el-radio-button
            v-for="item in userType"
            :key="item.value"
            :label="item.value"
          >{{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="UAForm.userType === 'assignee'" label="代理人">
        <!-- 单选用户 -->
        <SingleUser :user="singleUserData" @ok="singleUserOk"/>
      </el-form-item>

      <el-form-item v-if="UAForm.userType === 'candidateUsers'" label="候选人">
        <!-- 多选用户 -->
        <MultipleUser :list="multipleUserList" @ok="multipleUserOk"/>
      </el-form-item>

      <el-form-item v-if="UAForm.userType === 'candidateGroups'" label="候选组">
        <!-- 多选部门 -->
        <MultipleDept :list="multipleDeptList" @ok="multipleDeptOk"/>
      </el-form-item>

      <!-- 暂时用不到 -->
      <!--      <el-form-item label="到期日">-->
      <!--        <el-input v-model="UAForm.dueDate" @change="updateUserAssignProp('dueDate', $event)" />-->
      <!--      </el-form-item>-->

      <!--      <el-form-item label="跟进日期">-->
      <!--        <el-input v-model="UAForm.followUpDate" @change="updateUserAssignProp('followUpDate', $event)" />-->
      <!--      </el-form-item>-->

      <!--      <el-form-item label="优先">-->
      <!--        <el-input v-model="UAForm.priority" @change="updateUserAssignProp('priority', $event)" />-->
      <!--      </el-form-item>-->
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {getBusinessObject, type ModdleElement,} from 'bpmn-js/lib/util/ModelUtil';
import eventBus from '@/utils/eventBus';
import {getExPropValue, updateExModdleProp,} from '@/components/BpmnJs/bo-utils/popsUtils';
import {modelerStore} from '@/store';
import MultipleUser from './sub/MultipleUser.vue';
import SingleUser from './sub/SingleUser.vue';
import MultipleDept from './sub/MultipleDept.vue';

const modeler = modelerStore();

// element The element.
let scopedElement: Element;

// moddleElement The model element.
let moddleElement: ModdleElement;

// 表单参数
type UserAssigneeProp =
  | 'userType'
  | 'assignee'
  | 'candidateUsers'
  | 'candidateGroups'
  | 'identityLinkNames'
  | 'dueDate'
  | 'followUpDate'
  | 'priority';
const PROP_KEYS: UserAssigneeProp[] = [
  'userType',
  'assignee',
  'candidateUsers',
  'candidateGroups',
  'identityLinkNames',
  'dueDate',
  'followUpDate',
  'priority',
];

// eslint-disable-next-line no-return-assign
const EmptyUAForm = PROP_KEYS.reduce((a, b) => (a[b] = '') || a, {});
// 表单
const UAForm = ref(EmptyUAForm as Record<UserAssigneeProp, string>);

// 用户类型
const userType = ref<any>([
  {
    label: '发起人',
    value: 'initiator',
  },
  {
    label: '代理人',
    value: 'assignee',
  },
  {
    label: '候选人',
    value: 'candidateUsers',
  },
  {
    label: '候选组',
    value: 'candidateGroups',
  },
]);

// 单选用户 选择的数据
const singleUserData = ref<any>({});

// 多选用户 选择的数据
const multipleUserList = ref<any[]>([]);

// 多选部门 选择的数据
const multipleDeptList = ref<any[]>([]);

/**
 * 更新表单值
 * @param key 表单属性key
 * @param value 表单值
 */
const updateUserAssignProp = (key: UserAssigneeProp, value: string) => {
  // 类型改变时清空之前填写的值,代理人、候选人、候选组
  if (key === 'userType') {
    userType.value.forEach((item) => {
      updateExModdleProp(scopedElement, moddleElement, item.value, '');
    });
    // 重置变量
    singleUserData.value = {};
    multipleUserList.value = [];
    multipleDeptList.value = [];
    updateUserAssignProp('identityLinkNames', '');

    // 如果设置的是发起人
    if (value === 'initiator') {
      // eslint-disable-next-line no-template-curly-in-string
      updateUserAssignProp('assignee', '${initiator}');
    }
  }
  // 更新组件
  updateExModdleProp(scopedElement, moddleElement, key, value);
  // 获取节点数据
  getElementData();
};

/**
 * 获取节点数据
 */
const getElementData = () => {
  // eslint-disable-next-line no-restricted-syntax
  for (const key of PROP_KEYS) {
    UAForm.value[key] = getExPropValue(moddleElement, key) || '';
  }
};

/**
 * 单选用户选择完成
 * @param user 用户信息
 */
const singleUserOk = (user: any) => {
  updateUserAssignProp('assignee', user.id);
  updateUserAssignProp('identityLinkNames', user.name);
};

/**
 * 多选用户选择完成
 * @param list 选择的数据
 */
const multipleUserOk = (list: any[]) => {
  multipleUserList.value = list;
  const userIds = multipleUserList.value.map((item) => {
    return item.id;
  });
  const userNames = multipleUserList.value.map((item) => {
    return item.name;
  });
  updateUserAssignProp('candidateUsers', userIds.join(','));
  updateUserAssignProp('identityLinkNames', userNames.join(','));
};

/**
 * 多选部门选择完成
 * @param list 选择的数据
 */
const multipleDeptOk = (list: any[]) => {
  multipleDeptList.value = list;
  const deptIds = multipleDeptList.value.map((item) => {
    return item.id;
  });
  const deptNames = multipleDeptList.value.map((item) => {
    return item.deptName;
  });
  updateUserAssignProp('candidateGroups', deptIds.join(','));
  updateUserAssignProp('identityLinkNames', deptNames.join(','));
};

// 点击用户节点，初始化用
eventBus.on('elementInit', function () {
  scopedElement = modeler.getActive;
  moddleElement = getBusinessObject(scopedElement);
  getElementData();

  // 重置变量
  singleUserData.value = {};
  multipleUserList.value = [];
  multipleDeptList.value = [];

  // 还原代理人选择项
  if (UAForm.value.userType === 'assignee' && UAForm.value.assignee !== '') {
    singleUserData.value.assignee = UAForm.value.assignee;
    singleUserData.value.name = UAForm.value.identityLinkNames;
  }
  // 还原候选人选择项
  if (
    UAForm.value.userType === 'candidateUsers' &&
    UAForm.value.candidateUsers !== ''
  ) {
    const candidateUsers = UAForm.value.candidateUsers.split(',');
    const userNames = UAForm.value.identityLinkNames.split(',');
    for (let i = 0; i < candidateUsers.length; i++) {
      multipleUserList.value.push({
        id: candidateUsers[i],
        name: userNames[i],
      });
    }
  }
  // 还原候选组选择项
  if (
    UAForm.value.userType === 'candidateGroups' &&
    UAForm.value.candidateGroups !== ''
  ) {
    const candidateGroups = UAForm.value.candidateGroups.split(',');
    const deptNames = UAForm.value.identityLinkNames.split(',');
    for (let i = 0; i < candidateGroups.length; i++) {
      multipleDeptList.value.push({
        id: candidateGroups[i],
        deptName: deptNames[i],
      });
    }
  }

  // 如果一个都没有选择
  if (UAForm.value.userType === '') {
    UAForm.value.userType = 'initiator';
    updateUserAssignProp('userType', 'initiator');
    // eslint-disable-next-line no-template-curly-in-string
    updateUserAssignProp('assignee', '${initiator}');
  }
});
</script>

<style scoped>
:deep(.el-tab-pane) {
  height: 100% !important;
  overflow: auto;
}
</style>
