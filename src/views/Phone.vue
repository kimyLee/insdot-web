<template>
  <div class="phone">
    请在PC端网页打开，推荐使用chrome浏览器<br />
    Please open it on the PC web page, <br />
    it is recommended to use the chrome browser
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'NoPermit',
  components: {
  },
  setup () {
    const router = useRouter()

    return {
    }
  },
})
</script>
<style lang="scss" scoped>
.phone{
  display: block;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  text-align: left;
}
</style>
