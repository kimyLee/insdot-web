<template>
  <div class="home">
    请联系管理员获取权限
    <button @click="confirmPwd">
      输入密码
    </button>
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

    function confirmPwd () {
      checkPermission()
    }

    onMounted(() => {
      //
      checkPermission()
    })

    function foo () {
      return 'by' + 111
    }

    function checkPermission () {
      const pwd = prompt('请输入访问密码：')
      if (pwd === null || pwd === '') {
        //
      } else {
        console.log(pwd)
        if (pwd === ('cu' + foo())) {
          // 将用户重定向到登录页面
          localStorage.setItem('pwd', btoa(pwd))
          router.replace({ name: 'Home' })
          // return { name: 'Home' }
        }
      }
    }

    return {
      confirmPwd,
    }
  },
})
</script>
