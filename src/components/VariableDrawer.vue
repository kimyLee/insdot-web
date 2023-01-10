<template>
  <a-drawer v-model:visible="$props.variableDrawerVisible"
            class="variable-drawer"
            :wrap-style="{ position: 'absolute' }"
            :closable="false"
            :keyboard="false"
            :mask-closable="false"
            :mask="false"
            :get-container="getContainer"
            placement="right">
    <h3 style="text-align: center;margin-bottom: 18px;">
      {{ $t("VARIABLE_DRAWER.VARIABLE_MGR") }}
    </h3>

    <div>
      <a-row
        justify="space-between">
        <a-button type="primary"
                  ghost
                  shape="round"
                  @click="changeCreateKey(tabs.variable.key)">
          {{ $t("VARIABLE_DRAWER.CREATE_NEW_VARIABLE") }}
        </a-button>
        <a-button type="primary"
                  ghost
                  shape="round"
                  @click="changeCreateKey(tabs.list.key)">
          {{ $t("VARIABLE_DRAWER.CREATE_NEW_LIST") }}
        </a-button>
      </a-row>
      <a-card v-if="!!createKey"
              style="margin-bottom: 12px; margin-top: 12px; border-color: #1890ff; border-radius: 32px;">
        <a-row style="padding-bottom: 12px;">
          <a-input ref="refInput"
                   v-model:value="createValue"
                   :placeholder="tabs[createKey].placeholder" />
        </a-row>

        <a-row style="padding-bottom: 12px;">
          <a-radio checked>
            {{
              tabs[createKey].context
            }}
          </a-radio>
        </a-row>

        <a-row justify="space-around">
          <a-button type="text"
                    @click="createCancel">
            {{ $t("VARIABLE_DRAWER.CREATE_CANCEL") }}
          </a-button>
          <a-button type="link"
                    @click="createConfirm">
            {{ $t("VARIABLE_DRAWER.CREATE_CONFIRM") }}
          </a-button>
        </a-row>
      </a-card>
    </div>

    <a-tabs v-model:activeKey="activeTabKey"
            @change="getVariables">
      <a-tab-pane :key="tabs.variable.key"
                  :tab="tabs.variable.context">
        <a-list
          :data-source="variables">
          <template #renderItem="{ item }">
            <a-list-item :key="`${item.id_}`">
              <template #actions>
                <a @click="renameVariable(item)">{{ $t("VARIABLE_DRAWER.RENAME") }}</a>
                <a @click="deleteVariableById(item.id_)">  {{ $t("VARIABLE_DRAWER.DELETE") }}</a>
              </template>
              <a-list-item-meta style="white-space: nowrap;"
                                :description="item.name" />
            </a-list-item>
          </template>
        </a-list>
      </a-tab-pane>
      <a-tab-pane :key="tabs.list.key"
                  :tab="tabs.list.context">
        <a-list
          :data-source="list"
          :locale="{
            emptyText: ' '
          }">
          <template #renderItem="{ item }">
            <a-list-item :key="`${item.id_}`">
              <template #actions>
                <a @click="renameVariable(item)"> {{ $t("VARIABLE_DRAWER.RENAME") }}</a>
                <a @click="deleteVariableById(item.id_)"> {{ $t("VARIABLE_DRAWER.DELETE") }}</a>
              </template>
              <a-list-item-meta style="white-space: nowrap;"
                                :description="item.name" />
            </a-list-item>
          </template>
        </a-list>
      </a-tab-pane>

      <template #renderTabBar="{ DefaultTabBar, ...props }">
        <component
          :is="DefaultTabBar"
          v-bind="props"
          :style="{textAlign: 'center' }" />
      </template>
    </a-tabs>
  </a-drawer>
</template>

<script lang="ts">

import { message } from 'ant-design-vue'
import { defineComponent, nextTick, reactive, ref, toRefs } from 'vue'

import * as Blockly from 'blockly/core'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'VariableDrawer',
  props: {
    variableDrawerVisible: {
      type: Boolean,
      default: false,
    },
  },
  emits: [],

  setup () {
    const refInput = ref(null)
    const { t } = useI18n()
    const tabs: any = {
      variable: {
        key: 'variable',
        context: t('VARIABLE_DRAWER.VARIABLE'),
        placeholder: t('VARIABLE_DRAWER.VARIABLE_INPUT'),
        variableType: 'VAR',
      },
      list: {
        key: 'list',
        context: t('VARIABLE_DRAWER.LIST'),
        placeholder: t('VARIABLE_DRAWER.LIST_INPUT'),
        variableType: 'LIST',
      },
    }

    console.log(tabs, 233)

    const state = reactive({
      activeTabKey: tabs.variable.key,
      createKey: '',
      createValue: '',
      variables: [] as any,
      list: [] as any,
    })

    const createCancel = () => {
      state.createKey = ''
      state.createValue = ''
    }

    const createConfirm = () => {
      const { createKey, createValue, activeTabKey } = state

      if (!createValue) return

      const workspace = Blockly.getMainWorkspace()

      // 调用blockly创建的方法
      // check  variable existing

      const type = createKey === tabs.variable.key ? tabs.variable.variableType : tabs.list.variableType

      const existing = Blockly.Variables.nameUsedWithAnyType(createValue, workspace)
      if (existing) {
        let msg
        if (existing.type === type) {
          msg = Blockly.Msg.VARIABLE_ALREADY_EXISTS.replace('%1', existing.name)
        } else {
          msg = Blockly.Msg.VARIABLE_ALREADY_EXISTS_FOR_ANOTHER_TYPE
          msg = msg.replace('%1', existing.name).replace('%2', existing.type)
        }
        message.error(msg)
      } else {
        workspace.createVariable(createValue, type)

        nextTick(() => {
          getVariables()

          if (activeTabKey !== createKey) {
            state.activeTabKey = createKey
          }

          state.createKey = ''
          state.createValue = ''
        })
      }

      // 更新 blockly list
    }

    const getVariables = () => {
      const workspace = Blockly.getMainWorkspace()

      state.variables = [...workspace.getVariablesOfType(tabs.variable.variableType)]

      state.list = [...workspace.getVariablesOfType(tabs.list.variableType)]
    }

    const renameVariable = (variable: any) => {
      //
      const workspace = Blockly.getMainWorkspace()
      Blockly.Variables.renameVariable(workspace, variable, () => {
        nextTick(() => {
          getVariables()
        })
      })
    }

    const deleteVariableById = (id: string) => {
      const workspace = Blockly.getMainWorkspace()
      workspace.deleteVariableById(id)

      nextTick(() => {
        getVariables()
      })
    }

    const changeCreateKey = (key: string) => {
      state.createValue = ''
      state.createKey = key

      nextTick(() => {
        // @ts-ignore
        refInput.value?.focus()
      })
    }

    const getContainer = () => {
      const dom = document.querySelector('.block-box')
      if (dom) return dom
      return document.body
    }
    return {
      ...toRefs(state),
      refInput,
      tabs,
      getContainer,
      createCancel,
      createConfirm,
      getVariables,
      changeCreateKey,
      deleteVariableById,
      renameVariable,
    }
  },
  mounted () {
    nextTick(() => {
      this.getVariables()
    })
  },
})
</script>

<style scoped lang="scss">
.variable-drawer{
  z-index: 99999;
  width: 256px;
  background: #fff;
}
</style>
