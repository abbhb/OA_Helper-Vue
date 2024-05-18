<template>

  <!--  <el-icon v-if="!isFirstLetterLowercase(toPascalCase(iconClass))">-->
  <!--    <component :is="toPascalCase(iconClass)"></component>-->
  <!--  </el-icon>-->
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName"></use>
    <title v-if="!!title">{{ title }}</title>
  </svg>
</template>

<script>
import utils from '@/utils/utils';

export default {
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true,
    },
    className: {
      type: String,
    },
    title: {
      type: String,
      default: '',
    },
  },
  computed: {
    iconName() {
      return `#icon-${this.iconClass}`;
    },
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className;
      } else {
        return 'svg-icon';
      }
    },
  },
  methods: {
    isFirstLetterLowercase(str) {
      if (!str) {
        return false;
      }
      if (str.length === 0) return false; // 空字符串处理
      const firstChar = str.charAt(0);
      console.log(firstChar >= 'a' && firstChar <= 'z')
      return firstChar >= 'a' && firstChar <= 'z';
    },
    getPlusName(str2) {
      const names = utils.nameMap.get(str2);
      if (names) {
        return names;
      }
      return str2;

    },
    toPascalCase(str) {
      if (!str) {
        return str;
      }
      if (!str.startsWith('el-')) {
        return str;
      }
      const str2 = str.split('el-')[1];
      const str3 = str2
        .split('-') // 将字符串按 '-' 分割成数组
        .map(
          (
            word // 遍历数组中的每个单词
          ) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ) // 将每个单词的首字母转换为大写，其他字母转换为小写
        .join('');
      // 兼容处理
      return this.getPlusName(str3); // 将数组重新连接成字符串
    }

  },
};
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 1.1em;
  height: 1.1em;
  margin-left: 0.35em;
  margin-right: 0.35em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  display: inline-block;
}
</style>
