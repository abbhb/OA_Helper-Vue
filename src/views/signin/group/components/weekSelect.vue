<template>
  <div class="week-selector">
    <button
      v-for="(day, index) in days"
      :key="index"
      :class="{ active: selected.includes(day) }"
      @click="toggleSelection(day)"
    >
      {{ day }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'WeekSelector',
  props: {
    value: {
      type: Array
    },
    index: {
      type: Number,
      default: 1,
    },

  },
  data() {
    return {
      days: ['1', '2', '3', '4', '5', '6', '7'],
      selected: [],
    };
  },
  created() {
    if (this.value) {
      this.selected = this.value
    }
  },
  watch: {
    value: {
      handler(newVal) {
        this.selected = newVal;
      },
    },
  },
  methods: {
    toggleSelection(day) {
      const index = this.selected.indexOf(day);
      const copyas = this.selected;
      if (index !== -1) {
        // If the day is already selected, deselect it
        copyas.splice(index, 1);
      } else {

        copyas.push(day);
        copyas.sort();
      }
      this.$emit('input', copyas, this.index);
    },
  },
};
</script>

<style scoped>
.week-selector {
  display: flex;
}

.week-selector button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 5px;
  background-color: white;
  color: black;
  border: 1px solid black;
  cursor: pointer;
}

.week-selector button.active {
  background-color: blue;
  color: white;
}
</style>
