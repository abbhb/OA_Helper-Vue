<template>
  <div class="timeline">
    <div v-for="(rule, index) in rules" :key="index" class="shift">

      <!-- 警告标志 -->
      <div v-if="isOverlap(rule)" class="warning-icon" @mouseover="showTooltip(index)" @mouseleave="hideTooltip">
        ⚠️
        <div v-if="tooltipIndex === index" class="tooltip">
          {{ getOverlappingDetails(rule) }}
        </div>
      </div>
      <!-- 警告标志 -->
      <div v-for="(overlap,key) in getOverlapSegments(rule)" :key="key" :style="getOverlapStyle(overlap)" class="warning-overlay"></div>
      <!-- 前置允许时间 -->
      <div class="allowed-time" :style="getAllowedTimeStyle(rule, 'before')"></div>
      <!-- 班次时间段 -->
      <div
        :class="['rule', { overlap: isOverlap(rule) }]"
        :style="getRuleStyle(rule)"
      >
        <span>{{ formatTime(rule.sbTime) }} - {{ formatTime(rule.xbTime) }}</span>
        <span class="shift-description">第 {{ rule.count }} 班</span>
      </div>
      <!-- 后置允许时间 -->
      <div class="allowed-time" :style="getAllowedTimeStyle(rule, 'after')"></div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'Timeline',
  props: {
    rules: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      tooltipIndex: null,
    };
  },
  methods: {
    formatTime(time) {
      return moment(time, 'HH:mm:ss').format('HH:mm');
    },
    getRuleStyle(rule) {
      const start = moment(rule.sbTime, 'HH:mm:ss');
      const end = moment(rule.xbTime, 'HH:mm:ss');
      const totalMinutes = 24 * 60;
      const startMinutes = start.hours() * 60 + start.minutes();
      const endMinutes = end.hours() * 60 + end.minutes();
      const width = ((endMinutes - startMinutes) / totalMinutes) * 100;
      return {
        left: `${(startMinutes / totalMinutes) * 100}%`,
        width: `${width}%`,
      };
    },
    getAllowedTimeStyle(rule, type) {
      const totalMinutes = 24 * 60;
      const start = moment(rule.sbTime, 'HH:mm:ss');
      const end = moment(rule.xbTime, 'HH:mm:ss');
      if (type === 'before') {
        const allowedStartMinutes = start.hours() * 60 + start.minutes() - rule.sbStartTime;
        const width = (rule.sbStartTime / totalMinutes) * 100;
        return {
          left: `${(allowedStartMinutes / totalMinutes) * 100}%`,
          width: `${width}%`,
          backgroundColor: 'orange',
        };
      } else if (type === 'after') {
        const endMinutes = end.hours() * 60 + end.minutes();
        const width = (rule.xbEndTime / totalMinutes) * 100;
        return {
          left: `${(endMinutes / totalMinutes) * 100}%`,
          width: `${width}%`,
          backgroundColor: 'blue',
        };
      }
    },
    getOverlapSegments(rule) {
      const overlapSegments = [];
      const ruleStart = moment(rule.sbTime, 'HH:mm:ss').subtract(rule.sbStartTime, 'minutes');
      const ruleEnd = moment(rule.xbTime, 'HH:mm:ss').add(rule.xbEndTime, 'minutes');

      this.rules.forEach((r) => {
        if (r === rule) return;

        const rStart = moment(r.sbTime, 'HH:mm:ss').subtract(r.sbStartTime, 'minutes');
        const rEnd = moment(r.xbTime, 'HH:mm:ss').add(r.xbEndTime, 'minutes');

        if (ruleStart.isBefore(rEnd) && ruleEnd.isAfter(rStart)) {
          const overlapStart = moment.max(ruleStart, rStart);
          const overlapEnd = moment.min(ruleEnd, rEnd);
          overlapSegments.push({ start: overlapStart, end: overlapEnd });
        }
      });

      return overlapSegments;
    },
    getOverlapStyle(overlap) {
      const totalMinutes = 24 * 60;
      const startMinutes = overlap.start.hours() * 60 + overlap.start.minutes();
      const endMinutes = overlap.end.hours() * 60 + overlap.end.minutes();
      const width = ((endMinutes - startMinutes) / totalMinutes) * 100;
      return {
        left: `${(startMinutes / totalMinutes) * 100}%`,
        width: `${width}%`,
      };
    },
    isOverlap(rule) {
      const ruleStart = moment(rule.sbTime, 'HH:mm:ss').subtract(rule.sbStartTime, 'minutes');
      const ruleEnd = moment(rule.xbTime, 'HH:mm:ss').add(rule.xbEndTime, 'minutes');

      return this.rules.some(
        (r) => {
          if (r === rule) return false;

          const rStart = moment(r.sbTime, 'HH:mm:ss').subtract(r.sbStartTime, 'minutes');
          const rEnd = moment(r.xbTime, 'HH:mm:ss').add(r.xbEndTime, 'minutes');

          return ruleStart.isBefore(rEnd) && ruleEnd.isAfter(rStart);
        }
      );
    },
    getOverlappingDetails(rule) {
      const overlappingDetails = [];
      const ruleStart = moment(rule.sbTime, 'HH:mm:ss').subtract(rule.sbStartTime, 'minutes');
      const ruleEnd = moment(rule.xbTime, 'HH:mm:ss').add(rule.xbEndTime, 'minutes');

      this.rules.forEach((r) => {
        if (r === rule) return;

        const rStart = moment(r.sbTime, 'HH:mm:ss').subtract(r.sbStartTime, 'minutes');
        const rEnd = moment(r.xbTime, 'HH:mm:ss').add(r.xbEndTime, 'minutes');

        if (ruleStart.isBefore(rEnd) && ruleEnd.isAfter(rStart)) {
          const overlaps = [];
          if (ruleStart.isBefore(moment(r.xbTime, 'HH:mm:ss')) && ruleEnd.isAfter(moment(r.sbTime, 'HH:mm:ss'))) {
            overlaps.push('上下班时间');
          }
          if (ruleStart.isBefore(moment(r.xbTime, 'HH:mm:ss')) && ruleEnd.isAfter(moment(r.xbTime, 'HH:mm:ss').add(r.xbEndTime, 'minutes'))) {
            overlaps.push('下班宽限期');
          }
          if (ruleStart.isBefore(moment(r.sbTime, 'HH:mm:ss').subtract(r.sbStartTime, 'minutes')) && ruleEnd.isAfter(moment(r.sbTime, 'HH:mm:ss'))) {
            overlaps.push('上班宽限期');
          }
          overlappingDetails.push(`第 ${r.count} 班: ${this.formatTime(r.sbTime)} - ${this.formatTime(r.xbTime)} (${overlaps.join(', ')})`);
        }
      });

      return overlappingDetails.join('; ');
    },

    showTooltip(index) {
      this.tooltipIndex = index;
    },
    hideTooltip() {
      this.tooltipIndex = null;
    },
  },
};
</script>

<style scoped>
.timeline {
  position: relative;
  width: 100%;
  border: 1px solid #ccc;
}
.shift {
  position: relative;
  width: 100%;
  height: 40px;
  margin-bottom: 5px;
}
.rule {
  position: absolute;
  height: 100%;
  background-color: lightblue;
  border: 1px solid #000;
}
.rule.overlap {
  background-color: lightblue;
}
.allowed-time {
  position: absolute;
  height: 100%;
  opacity: 0.5;
}
.shift-description {
  display: block;
  font-size: 12px;
  color: black;
}
.warning-icon {
  position: absolute;
  left: 0;
  top: 0;
  font-size: 16px;
  cursor: pointer;
}
.tooltip {
  position: absolute;
  top: 20px;
  left: 0;
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 5px;
  border-radius: 3px;
  z-index: 10;
  white-space: nowrap;
}
.warning-overlay {
  position: absolute;
  height: 100%;
  animation: breathe 2s infinite; /* 呼吸动画 */

  z-index: 1; /* 置于前面 */
}
@keyframes breathe {
  0% {
    background-color: rgba(255, 0, 0, 1);
    filter: blur(5px);
  }
  50% {
    background-color: rgba(255, 0, 0, 0.3);
    filter: blur(0px);
  }
  100% {
    background-color: rgba(255, 0, 0, 1);
    filter: blur(5px);
  }
}
</style>
