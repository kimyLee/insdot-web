<template>
  <a-drawer :visible="visible"
            :width="700"
            class="blockly-doc"
            title="游戏开发指南"
            placement="right"
            @update:visible="(val) => $emit('update:visible', val)">
    <h2 class="">
      以Puzzle Boy为例, 介绍一个游戏开发的流程和重要问题
    </h2>
    <p class="content">
      1. 游戏逻辑提取<br />
      2. 如何实现识别ID逻辑<br />
      3. 如何记录、调整各种信息和“状态”<br />
      4. 如何实现声光反馈<br />
      5. 如何实现游戏状态的“检查”<br />
      6. 游戏的结束和重新开始"<br />
    </p>
    <hr />
    <h2 class="">
      游戏核心逻辑提取
    </h2>
    <p class="content">
      第一步我们先抽取我们游戏的核心逻辑，比如puzzle boy的核心交互可以拆解为: <br />
      1. 识别卡片，进入关卡，播放开始音效，显示对应密码长度的灯<br />
      2. 逐次扫描0-9卡片，记录输入答案<br />
      3. 扫描时，JOYO做出声光反馈<br />
      4. 当录入答案数字长度达标时，检查答案，并做出声光反馈<br />
    </p>
    <hr />
    <h2 class="">
      如何实现识别ID逻辑
    </h2>
    <p class="content">
      JOYO"识别"的核心逻辑在于"When_JOYO_Read"(识别到)事件 <br />
      <img class="docs-img"
           src="~@/assets/oid.jpeg" />
      该block会在每次JOYO识别到的id变化时候，立刻执行该block里面内容，并且变量value值即为此时OID识别到的值<br />
      举例：以下表示识别1-16编号的卡片，便播放开始音效的逻辑<br />
      <span style="display: inline-block;width: 100%;overflow: auto;">
        <img class="docs-img"
             style="width: 700px"
             src="~@/assets/game-1.png" />
      </span>
      在这基础上，如果我们用30-39表示数字 0-9, 将对应贴纸贴在数字token牌上，那么这个逻辑就会变成
      <span style="display: inline-block;width: 100%;overflow: auto;">
        <img class="docs-img"
             style="width: 700px"
             src="~@/assets/game2.png" />
      </span>
      (dosomething 是一个函数，这里表示我们暂不定义具体动作)
    </p>
    <hr />
    <h2 class="">
      如何记录、应用识别的信息
    </h2>
    <p class="content">
      游戏开发过程中最复杂的点，主要是状态的处理，比如玩家当前输入什么, 血量多少, 答对了几道题, 坐标位置等等··· <br />
      <br />
      解决这系列状态问题，主要靠设置“变量”来解决<br />
      <br />
      比如在puzzle boy的游戏里面，我们需要跟踪的状态主要有两个 <br />
      1. 当前题目的正确答案. <br />2. 玩家数输入的答案密码串<br />
      在实际开发中，我们需要这么处理<br />
      1. 在识别题目卡片时候, 设置“正确答案”状态为对应的值 <br />
      2. 在玩家逐步识别数字卡片时候，不断更新用户输入的答案密码串状态 （比如从“5”，到“58”，到“583”，到“5834”）<br /><br />
      我们对应的实现如下：<br />
      1. 先创建一个变量, 叫做answer，用来保存我们当前题目的正确答案，再创建一个变量叫“inputCode”, 表示用户的回答密码串

      <span style="display: inline-block;width: 100%;overflow: auto;">
        <img class="docs-img"
             style="width: 700px"
             src="~@/assets/game5.png" />
      </span>
      <span style="display: inline-block;width: 100%;overflow: auto;">
        <img class="docs-img"
             style="width: 700px"
             src="~@/assets/game6.png" />
      </span>
      <span style="display: inline-block;width: 100%;overflow: auto;">
        <img class="docs-img"
             style="width: 700px"
             src="~@/assets/game7.png" />
      </span>

      2. 在识别到1-16的题目卡片时候，初始化当前的答案answer的值

      <span style="display: inline-block;width: 100%;overflow: auto;">
        <img class="docs-img"
             style="width: 700px"
             src="~@/assets/game3.png" />
      </span>
      值得注意的是，这里初始化答案的操作我们用了“函数”概念，它可以很方便地将一些复杂或者重复的逻辑包装起来，方便我们在需要的时候调用<br /><br />

      3. 在识别到用户输入时候，我们更新用户输入的值

      <span style="display: inline-block;width: 100%;overflow: auto;">
        <img class="docs-img"
             style="width: 700px"
             src="~@/assets/game8.png" />
      </span>

      "createText with" 在这里表示拼接字符串，如以下会产生“abc”的字符串
      <img class="docs-img"
           src="~@/assets/game9.png" />
      由于我们每次扫描只能获取到一个数字，我们需要拼接扫描的数字构成最终答案。直到用户输入数字长度和答案长度一致时，我们会触发校验。<br />我们会在“检查”这一步实现此逻辑 <br />

      4. 在了解如何改变状态后，下一步就是基于状态的值，我们去做“检查”逻辑，比如判定游戏何时结束，玩家不同操作的反馈等等，<br />
      详情请继续了解下面流程
    </p>
    <hr />
    <h2 class="">
      如何实现声光反馈
    </h2>
    <p class="content">
      声光反馈是游戏里面最重要的“输出”，它决定了玩家的用户体验，如信息展示、行动反馈、胜利反馈、失败反馈等等 <br />
      <br />
      1 游戏的音效反馈，目前只支持内置音效，使用相对简单<br />
      <img class="docs-img"
           style="width: 200px"
           src="~@/assets/audio.png" />
      <br />
      2 控制游戏灯效有多种方式，比如简单控制所有灯光、用数组控制灯光、或者使用预制动画等<br />
      ）控制所有灯光同一颜色
      <img class="docs-img"
           src="~@/assets/setLight.png" />
      ）使用预制动画
      <span style="display: inline-block;width: 100%;overflow: auto;">
        <img class="docs-img"
             style="width: 700px"
             src="~@/assets/game10.png" />
      </span>
      ）使用数组控制灯光<br />
      JOYO支持以数组方式精细控制灯光, 比如以下是：“每当用户扫描一个数字, JOYO亮一盏灯“的逻辑实现<br />
      a. 首先创建一个长度12的数组，用来代表JOYO的每一个灯（前面8位为顶部灯，最后4位为底部灯）<br />
      b. 初始我们把每个元素设置为“#000000”, 表示熄灭状态<br />
      c. 每次识别到一个数字时候，让数组从第一个元素开始修改颜色，表示逐步更改灯颜色<br />
      d. 最后亮起四个灯时候，数组的状态应该对应为 “#ffffff, #ffffff, #ffffff, #ffffff, #000000, #000000···”，长度保持12不变<br />

      <span style="display: inline-block;width: 100%;overflow: auto;">
        <img class="docs-img"
             style="width: 700px"
             src="~@/assets/game12.png" />
      </span>
    </p>
    <hr />
    <h2 class="">
      如何实现游戏状态的“检查”
    </h2>
    <p class="content">
      游戏过程中，我们经常会基于玩家行为做出状态改变和声光反馈。 <br />
      那么游戏实现的下一步应该是，在达到某些条件后触发事件，比如检查用户输入是否正确，游戏是否结束，等等 <br />
      以下示意当用户输入密码长度等于答案长度时候，自动触发校验的逻辑，并作出正确或错误的反馈
      <br />

      <span style="display: inline-block;width: 100%;overflow: auto;">
        <img class="docs-img"
             style="width: 700px"
             src="~@/assets/game13.png" />
      </span>
    </p>
    <hr />
    <h2 class="">
      游戏的结束和重新开始
    </h2>
    <p class="content">
      当游戏触发结束条件时候，经常需要重置一些游戏状态，以便让游戏重新开始,
      这时候就需要对一些状态做出变更<br />
      参考左上角puzzle boy代码，可以了解重置的一些常用操作
      <br />
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
