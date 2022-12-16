<template>
  <a-drawer :visible="visible"
            :width="500"
            class="blockly-doc"
            title="blockly说明文档"
            placement="right"
            @update:visible="(val) => $emit('update:visible', val)">
    <h2 class="">
      基本流程和按钮介绍
    </h2>
    <p class="content">
      draft版本, 暂只能编写单个程序<br />
      1. 连接JOYO，点击“connect JOYO”<br />
      2. 编写代码, 在workspace下编写, 并参照"block 介绍"<br />
      3. 运行代码, 点击“Run”<br />
      4. 保存代码, 点击“Save”<br />
      5. 加载已保存代码, 点击“Load Saved”<br />
      6. 查看游戏示例, 点击“spy game”, 或者"puzzle boy"<br />
      7. 清除已有代码（加载空程序）, 点击 “clear all”<br />
    </p>
    <h2 class="">
      block 介绍
    </h2>
    <p class="content">
      1. setup开始程序: <br />
      点击运行后只执行一次，一般用于初始化参数<br />
      <img class="docs-img"
           style="width: 200px"
           src="~@/assets/setup.png" />
      2. When_JOYO_Read: OID变化事件：<br />
      每次识别到的OID变化时候，都会触发执行的事件，变量value即为识别到的码值<br />
      码值对应贴纸上的数字
      <img class="docs-img"
           src="~@/assets/oid.jpeg" />
      3. 控制JOYO灯效<br />
      a. 设置所有灯效为某个颜色：<br />
      <img class="docs-img"
           src="~@/assets/setLight.png" />
      b. 用数组为灯效设置颜色：<br />
      <span style="display: inline-block;width: 100%;overflow: auto;">
        <img class="docs-img"
             style="width: 900px"
             src="~@/assets/setLightArr.png" />
      </span>

      4. 控制JOYO音效<br />
      <img class="docs-img"
           style="width: 200px"
           src="~@/assets/audio.png" />
      5. 延时
      <img class="docs-img"
           style="width: 200px"
           src="~@/assets/wait.png" />
      6. 随机数
      <img class="docs-img"
           src="~@/assets/radom.png" />
    </p>
  </a-drawer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HelloWorld',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:visible'],
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.blockly-doc {
  width: 400px;
  p {
    font-size: 18px;
  }
  .docs-img {
    display: block;
    width: 400px;
    height: auto;
  }
}
</style>
