
import { Variables, Blocks, VariableModel, utils, Xml } from 'blockly'
import type { WorkspaceSvg, Workspace, FlyoutButton } from 'blockly'

// 考虑下 plugin 关联的 block 是否直接在 插件内部管理

export enum CustomTypeVariableEnum {
  'VAR' = 'VAR',
  'LIST' = 'LIST'
}

/**
 * Construct the elements (blocks and button) required by the flyout for the VAR variable category.
 *
 * @param workspace The workspace containing variables.
 * @returns Array of XML elements.
 * @alias Blockly.VariablesDynamic.flyoutCategory
 */
export const flyoutCategoryVar = (workspace: WorkspaceSvg): Element[] => {
  let xmlList: Element[] = []

  workspace.registerButtonCallback('CREATE_TYPED_VARIABLE_' + CustomTypeVariableEnum.VAR, (button: FlyoutButton) => {
    Variables.createVariableButtonHandler(button.getTargetWorkspace(), undefined, CustomTypeVariableEnum.VAR)
  })

  const blockList = flyoutCategoryBlocksVar(workspace)
  xmlList = xmlList.concat(blockList)
  return xmlList
}

/**
 * Construct the blocks required by the flyout for the VAR variable category.
 *
 * @param workspace The workspace containing variables.
 * @returns Array of XML block elements.
 * @alias Blockly.VariablesDynamic.flyoutCategoryBlocks
 */
export function flyoutCategoryBlocksVar (workspace: Workspace): Element[] {
  const variableModelList = workspace.getVariablesOfType(CustomTypeVariableEnum.VAR)

  const xmlList: Element[] = []
  if (variableModelList.length > 0) {
    const mostRecentVariable = variableModelList[variableModelList.length - 1]
    if (Blocks.variables_set_var) {
      const block = utils.xml.createElement('block')
      block.setAttribute('type', 'variables_set_var')
      block.setAttribute('gap', '24')
      block.appendChild(Variables.generateVariableFieldDom(mostRecentVariable))
      xmlList.push(block)
    }
    if (Blocks.custom_math_change) {
      const block = utils.xml.createElement('block')
      block.setAttribute('type', 'custom_math_change')
      block.setAttribute('gap', Blocks.variables_get_list ? '20' : '8')
      block.appendChild(Variables.generateVariableFieldDom(mostRecentVariable))
      // 修改待定
      const value = Xml.textToDom(
        '<value name="DELTA">' +
        '<shadow type="math_number">' +
        '<field name="NUM">1</field>' +
        '</shadow>' +
        '</value>')
      block.appendChild(value)
      xmlList.push(block)
    }
    if (Blocks.variables_get_var) {
      const block = utils.xml.createElement('block')
      block.setAttribute('type', 'variables_get_var')
      block.setAttribute('gap', '8')
      block.appendChild(Variables.generateVariableFieldDom(mostRecentVariable))
      xmlList.push(block)
    }
  }
  return xmlList
}

/**
 * Construct the elements (blocks and button) required by the flyout for the LIST variable category.
 *
 * @param workspace The workspace containing variables.
 * @returns Array of XML elements.
 * @alias Blockly.VariablesDynamic.flyoutCategory
 */
export const flyoutCategoryList = (workspace: WorkspaceSvg): Element[] => {
  let xmlList: Element[] = []

  workspace.registerButtonCallback('CREATE_TYPED_VARIABLE_' + CustomTypeVariableEnum.LIST, (button: FlyoutButton) => {
    Variables.createVariableButtonHandler(button.getTargetWorkspace(), undefined, CustomTypeVariableEnum.LIST)
  })

  const blockList = flyoutCategoryBlocksList(workspace)

  xmlList = xmlList.concat(blockList)
  return xmlList
}

/**
 * Construct the blocks required by the flyout for the LIST variable category.
 *
 * @param workspace The workspace containing variables.
 * @returns Array of XML block elements.
 * @alias Blockly.VariablesDynamic.flyoutCategoryBlocks
 */
export function flyoutCategoryBlocksList (workspace: Workspace): Element[] {
  const variableModelList = workspace.getVariablesOfType(CustomTypeVariableEnum.LIST)

  const xmlList: Element[] = []
  if (variableModelList.length > 0) {
    const mostRecentVariable = variableModelList[variableModelList.length - 1]
    if (Blocks.variables_set_list) {
      const block = utils.xml.createElement('block')
      block.setAttribute('type', 'variables_set_list')
      block.setAttribute('gap', '24')
      block.appendChild(Variables.generateVariableFieldDom(mostRecentVariable))
      xmlList.push(block)
    }

    if (Blocks.variables_get_list) {
      const block = utils.xml.createElement('block')
      block.setAttribute('type', 'variables_get_list')
      block.setAttribute('gap', '8')
      block.appendChild(Variables.generateVariableFieldDom(mostRecentVariable))
      xmlList.push(block)
    }
  }

  // TODO: add list block

  return xmlList
}

// 设置初始的 变量/列表
export const CreateInitialVariable = (variables: { name: string, type: string }[] = [], workspace: WorkspaceSvg): void => {
  variables.forEach(i => {
    workspace.createVariable(i.name, i.type)
  })
}

export const registerCustomToolboxCategory = (workspace: WorkspaceSvg, variables: { name: string, type: string }[] = [{ name: 'value', type: 'VAR' }, { name: 'list_1', type: 'LIST' }]): void => {
  // CreateInitialVariable(variables, workspace)
  // 触发动态事件
  // workspace.registerToolboxCategoryCallback(CustomTypeVariableEnum.VAR, flyoutCategoryVar)
  // workspace.registerToolboxCategoryCallback(CustomTypeVariableEnum.LIST, flyoutCategoryList)
}
