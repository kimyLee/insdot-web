<template>
  <div class="header-nav">
    <!-- todo：可选的LOGO -->
    <a-page-header style="border: 1px solid rgb(235, 237, 240);height: 100%;"
                   :title="title"
                   :sub-title="subTitle"
                   @back="onBack">
      <template #extra>
        <slot />
      </template>
    </a-page-header>
    <!-- todo：可选的筛选框 -->
  </div>
</template>

<script lang="ts">
import { defineComponent, useAttrs, markRaw } from 'vue'

export default defineComponent({
  name: 'HeaderNav',
  props: {
    title: {
      type: String,
      default: '',
    },
    subTitle: {
      type: String,
      default: '',
    },
  },
  // emits: ['back'],
  emits: ['update:visible'],
  setup () {
    const attrs = useAttrs()
    let onBack = null
    if (attrs.onBack) {
      onBack = attrs.onBack
    }

    return {
      onBack,
    }
  },
})
</script>

<style scoped lang="scss">
.header-nav::v-deep {
  width: 100%;
  background: #fff;
  .ant-page-header {
    background-color: #002253;
    color: #fff;
  }
  .ant-page-header-heading-title {
    color: #fff;
  }
  .ant-page-header-heading-sub-title {
    color: rgba(255, 255, 255, .8);
    margin-left: 70px;
    font-weight: bold;
  }
}
</style>
