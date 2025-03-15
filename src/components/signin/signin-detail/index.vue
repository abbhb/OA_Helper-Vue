<script setup lang="ts">
  import { ref, onMounted, reactive } from 'vue';
  import { IconDown, IconUp } from '@arco-design/web-vue/es/icon';
  import { Message } from '@arco-design/web-vue';

  interface SigninLog {
    id: number;
    log_datetime: string;
    state: number;
    bc_count: number;
    start_end: number;
    log_time: string | null;
    from_log: string | null;
    state_time: number | null;
    user_id: number;
  }

  interface SigninRenewal {
    id: number;
    user_id: number;
    renewal_time: string;
    renewal_reason: string | null;
    create_time: string;
    signin_log_id: string | null;
    renewal_about_act_id: string;
    state: number;
    update_time: string;
  }

  interface AskLeave {
    id: number;
    user_id: number;
    start_time: string;
    end_time: string;
    ask_leave_reason: string | null;
    create_time: string | null;
    ask_leave_about_act_id: string | null;
  }

  // 只接收必要的属性
  const props = defineProps({
    userId: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  });

  // 本地状态
  const attendanceData = reactive({
    date: '',
    workingHours: '',
    attendanceStatus: '',
    totalSeconds: 0,
    remarks: '',
  });

  const punchRecords = ref<any[]>([]);
  const clockingRecords = ref<any[]>([]);
  const supplementRecords = ref<any[]>([]);

  // 控制卡片的折叠状态
  const attendanceCollapsed = ref(false);
  const punchInfoCollapsed = ref(false);
  const clockingDataCollapsed = ref(false);
  const supplementCollapsed = ref(false);

  // 获取考勤数据
  const fetchAttendanceData = async () => {
    try {
      // 这里替换为真实API调用
      // const response = await fetch(`/api/attendance/${props.userId}?date=${props.date}`);
      // const data = await response.json();
      // Object.assign(attendanceData, data);

      // 暂时使用模拟数据
      console.log('获取考勤数据', props.userId, props.date);
      attendanceData.date = `${props.date} 星期五`;
      attendanceData.workingHours = '15:08';
      attendanceData.attendanceStatus = '异常';
      attendanceData.totalSeconds = 49 * 60;
      attendanceData.remarks = '';
    } catch (error) {
      Message.error('获取考勤数据失败');
      console.error(error);
    }
  };

  // 获取打卡信息
  const fetchPunchData = async () => {
    try {
      // 实际API调用
      // const response = await fetch(`/api/punch/${props.userId}?date=${props.date}`);
      // const data = await response.json();
      // punchRecords.value = data;

      // 模拟数据
      console.log('获取打卡信息', props.userId, props.date);
      punchRecords.value = [
        {
          punchInTime: '2023-03-14 09:00',
          punchOutTime: '2023-03-14 09:49',
          duration: '49 分钟',
          supplementStatus: '',
          supplementReason: '',
          attendanceStatus: '异常',
          supplementApplyTime: '',
          supplementApprovalTime: '',
        },
        {
          punchInTime: '2023-03-14 18:30',
          punchOutTime: '2023-03-15 00:54',
          duration: '0 分钟',
          supplementStatus: '',
          supplementReason: '',
          attendanceStatus: '正常',
          supplementApplyTime: '',
          supplementApprovalTime: '',
        },
      ];
    } catch (error) {
      Message.error('获取打卡信息失败');
      console.error(error);
    }
  };

  // 获取打卡数据
  const fetchClockingData = async () => {
    try {
      // 实际API调用
      // const response = await fetch(`/api/clocking/${props.userId}?date=${props.date}`);
      // const data = await response.json();
      // clockingRecords.value = data;

      // 模拟数据
      console.log('获取打卡数据', props.userId, props.date);
      clockingRecords.value = [
        {
          employee: {
            avatar: '',
            name: '',
          },
          punchTime: '2023-03-14 09:49:00',
          attendanceCard: '',
          locationDetail: '网口登入',
          locationInfo: '',
          locationDescription: '',
          deviceInfo: '',
          department: '',
          locationNote: '网口登入',
          creationTime: '2023-03-14 12:00:36',
        },
      ];
    } catch (error) {
      Message.error('获取打卡数据失败');
      console.error(error);
    }
  };

  // 获取补签记录
  const fetchSupplementRecords = async () => {
    try {
      // 实际API调用
      // const response = await fetch(`/api/supplement/${props.userId}?date=${props.date}`);
      // const data = await response.json();
      // supplementRecords.value = data;

      // 模拟空数据
      console.log('获取补签记录', props.userId, props.date);
      supplementRecords.value = [];
    } catch (error) {
      Message.error('获取补签记录失败');
      console.error(error);
    }
  };

  // 获取状态文本
  const getStatusText = (state: number) => {
    switch (state) {
      case 0:
        return '正常';
      case 1:
        return '迟到';
      case 2:
        return '早退';
      default:
        return '未知';
    }
  };

  // 获取补签状态文本
  const getSupplementStateText = (state: number) => {
    switch (state) {
      case 0:
        return '流程中';
      case 1:
        return '已通过';
      case 2:
        return '已拒绝';
      default:
        return '未知';
    }
  };

  // 切换卡片折叠状态
  const toggleAttendance = () => {
    attendanceCollapsed.value = !attendanceCollapsed.value;
  };

  const togglePunchInfo = () => {
    punchInfoCollapsed.value = !punchInfoCollapsed.value;
  };

  const toggleClockingData = () => {
    clockingDataCollapsed.value = !clockingDataCollapsed.value;
  };

  const toggleSupplement = () => {
    supplementCollapsed.value = !supplementCollapsed.value;
  };

  // 在组件挂载时获取数据
  onMounted(() => {
    fetchAttendanceData();
    fetchPunchData();
    fetchClockingData();
    fetchSupplementRecords();
  });
</script>

<template>
  <div class="signin-detail-container">
    <!-- 考勤数据 -->
    <a-card class="detail-card" :bordered="false">
      <template #title>
        <div class="card-header">
          <div class="card-title">
            <div class="title-indicator"></div>
            <span>考勤数据</span>
          </div>
          <a-button type="text" class="collapse-btn" @click="toggleAttendance">
            <IconUp v-if="!attendanceCollapsed" />
            <IconDown v-else />
            <span>{{ !attendanceCollapsed ? '收起' : '展开' }}</span>
          </a-button>
        </div>
      </template>
      <div v-show="!attendanceCollapsed">
        <a-descriptions
          :data="[
            { label: '考勤日期', value: attendanceData.date },
            { label: '工作时长', value: attendanceData.workingHours },
            { label: '考勤状态', value: attendanceData.attendanceStatus },
            {
              label: '总用时长',
              value: `${Math.floor(attendanceData.totalSeconds / 60)} 分钟`,
            },
            { label: '补签状态', value: '' },
            { label: '备注', value: attendanceData.remarks },
          ]"
          layout="inline-horizontal"
          :column="2"
          :label-style="{ 'color': '#86909c', 'font-weight': 'normal' }"
          :value-style="{ color: '#1d2129' }"
          size="medium"
          class="attendance-desc"
        />
      </div>
    </a-card>

    <!-- 打卡信息 -->
    <a-card class="detail-card" :bordered="false">
      <template #title>
        <div class="card-header">
          <div class="card-title">
            <div class="title-indicator"></div>
            <span>打卡信息</span>
          </div>
          <a-button type="text" class="collapse-btn" @click="togglePunchInfo">
            <IconUp v-if="!punchInfoCollapsed" />
            <IconDown v-else />
            <span>{{ !punchInfoCollapsed ? '收起' : '展开' }}</span>
          </a-button>
        </div>
      </template>
      <div v-show="!punchInfoCollapsed">
        <a-table
          :data="punchRecords"
          :bordered="false"
          stripe
          :pagination="false"
          size="medium"
          class="custom-table"
        >
          <template #columns>
            <a-table-column title="起打卡" data-index="punchInTime" />
            <a-table-column title="止打卡" data-index="punchOutTime" />
            <a-table-column title="补签状态" data-index="supplementStatus" />
            <a-table-column title="补签理由" data-index="supplementReason" />
            <a-table-column title="考勤状态·" data-index="attendanceStatus" />
<!--            <a-table-column title="考勤状态" data-index="attendanceStatus" />-->
            <a-table-column
              title="补签申请时间"
              data-index="supplementApplyTime"
            />
            <a-table-column
              title="补签审批时间"
              data-index="supplementApprovalTime"
            />
          </template>
        </a-table>
        <div v-if="punchRecords.length > 0" class="table-summary">
          <span>共 {{ punchRecords.length }} 条</span>
        </div>
      </div>
    </a-card>

    <!-- 打卡数据 -->
    <a-card class="detail-card" :bordered="false">
      <template #title>
        <div class="card-header">
          <div class="card-title">
            <div class="title-indicator"></div>
            <span>打卡数据</span>
          </div>
          <a-button
            type="text"
            class="collapse-btn"
            @click="toggleClockingData"
          >
            <IconUp v-if="!clockingDataCollapsed" />
            <IconDown v-else />
            <span>{{ !clockingDataCollapsed ? '收起' : '展开' }}</span>
          </a-button>
        </div>
      </template>
      <div v-show="!clockingDataCollapsed">
        <a-table
          :data="clockingRecords"
          :bordered="false"
          stripe
          :pagination="false"
          size="medium"
          class="custom-table"
        >
          <template #columns>
            <a-table-column title="员工" data-index="employee">
              <template #cell="{ record }">
                <a-space>
                  <div v-if="record.employee.avatar" class="avatar">
                    <img :src="record.employee.avatar" alt="头像" />
                  </div>
                  <span>{{ record.employee.name }}</span>
                </a-space>
              </template>
            </a-table-column>
            <a-table-column title="打卡日期时间" data-index="punchTime" />
            <a-table-column title="考勤卡号" data-index="attendanceCard" />
            <a-table-column title="签到来源" data-index="locationDetail" />
            <a-table-column title="签到地点" data-index="locationInfo" />
            <a-table-column
              title="签到地点详情"
              data-index="locationDescription"
            />
            <a-table-column title="设备标识" data-index="deviceInfo" />
            <a-table-column title="部门" data-index="department" />
            <a-table-column title="签到来源注释" data-index="locationNote" />
            <a-table-column title="创建时间" data-index="creationTime" />
          </template>
        </a-table>
        <div v-if="clockingRecords.length > 0" class="table-summary">
          <span>共 {{ clockingRecords.length }} 条</span>
        </div>
      </div>
    </a-card>

    <!-- 补签记录 -->
    <a-card class="detail-card" :bordered="false">
      <template #title>
        <div class="card-header">
          <div class="card-title">
            <div class="title-indicator"></div>
            <span>补签记录</span>
          </div>
          <a-button type="text" class="collapse-btn" @click="toggleSupplement">
            <IconUp v-if="!supplementCollapsed" />
            <IconDown v-else />
            <span>{{ !supplementCollapsed ? '收起' : '展开' }}</span>
          </a-button>
        </div>
      </template>
      <div v-show="!supplementCollapsed">
        <a-table
          :data="supplementRecords"
          :bordered="false"
          stripe
          :pagination="false"
          size="medium"
          class="custom-table"
        >
          <template #columns>
            <a-table-column title="补签项" data-index="supplementItem" />
            <a-table-column title="补签理由" data-index="supplementReason" />
            <a-table-column title="备注" data-index="remarks" />
            <a-table-column title="审批状态" data-index="approvalStatus" />
            <a-table-column title="单据来源" data-index="source" />
          </template>
        </a-table>
        <div v-if="supplementRecords.length > 0" class="table-summary">
          <span>共 {{ supplementRecords.length }} 条</span>
        </div>
      </div>
    </a-card>
  </div>
</template>

<style scoped>
  .signin-detail-container {
    padding: 16px;
    background-color: #f2f3f5;
  }

  .detail-card {
    margin-bottom: 16px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    background-color: #fff;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 0;
  }

  .card-title {
    display: flex;
    align-items: center;
    font-weight: 500;
    font-size: 14px;
    color: #1d2129;
  }

  .title-indicator {
    width: 4px;
    height: 16px;
    background-color: #165dff;
    border-radius: 2px;
    margin-right: 8px;
  }

  .collapse-btn {
    color: #86909c;
    font-size: 12px;
    display: flex;
    align-items: center;
  }

  .collapse-btn span {
    margin-left: 4px;
  }

  .attendance-desc {
    padding: 12px 0;
  }

  .custom-table :deep(.arco-table-th) {
    background-color: #f7f8fa;
    font-weight: normal;
    color: #4e5969;
    font-size: 13px;
    padding: 10px 16px;
  }

  .custom-table :deep(.arco-table-td) {
    color: #1d2129;
    font-size: 13px;
    padding: 10px 16px;
  }

  .custom-table :deep(.arco-table-tr:nth-child(even)) {
    background-color: #f7f8fa;
  }

  .table-summary {
    padding: 8px 16px;
    font-size: 12px;
    color: #86909c;
    text-align: left;
    border-top: 1px solid #e5e6eb;
  }

  .avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e5e6eb;
  }

  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
