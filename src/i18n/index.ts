const obj = {
  COMMON: {
    OK_TEXT: {
      zh: '我知道了',
      en: 'OK',
    } as unknown as string,
    CONFIRM: {
      zh: '确定',
      en: 'OK',
    } as unknown as string,
    CANCEL: {
      zh: '取消',
      en: 'Cancel',
    } as unknown as string,
  },
  HOME_HEADER: {
    TITLE: {
      zh: 'JOYO',
      en: 'JOYO',
    } as unknown as string,
    SUBTITLE: {
      zh: '智能桌游创作工具 Beta',
      en: 'Game Design Tool',
    } as unknown as string,
    NEW_GAME: {
      zh: '新建游戏',
      en: 'New Game',
    } as unknown as string,
    IMPORT: {
      zh: '导入游戏',
      en: 'Import',
    } as unknown as string,
    EXPORT_ALL: {
      zh: '导出游戏',
      en: 'Export',
    } as unknown as string,
    EXPORT_CONFIRM: {
      zh: '确定导出所有游戏文件到zip吗，此过程较耗时',
      en: 'Ready to export all game files to zip? It will take some time.',
    } as unknown as string,
    CHOOSE_LANG: {
      zh: '语言',
      en: 'Language',
    } as unknown as string,
    ZH: {
      zh: '中文',
      en: '中文',
    } as unknown as string,
    EN: {
      zh: 'English',
      en: 'English',
    } as unknown as string,
    PROGRAM_WARN: {
      zh: '请及时导出游戏文件保存到本地，当前数据使用浏览器缓存，避免因不稳定因素而丢失程序',
      en: 'Please export the game files in time to save them locally. we use browser cache for current data, save often to avoid losing the game program.',
    } as unknown as string,
    HOME: {
      zh: '首页',
      en: 'Home',
    } as unknown as string,
    DOC: {
      zh: '文档',
      en: 'Docs',
    } as unknown as string,
    CONTACT: {
      zh: '联系我们',
      en: 'Contact us',
    } as unknown as string,
    MORE: {
      zh: '更多',
      en: 'More',
    } as unknown as string,
    HAS_NAME: {
      zh: '程序名已存在',
      en: 'Program name already exists',
    } as unknown as string,
    CAN_NOT_EMPTY: {
      zh: '程序名不能为空',
      en: 'Program name cannot be empty',
    } as unknown as string,
    EXPORT_ERROR: {
      zh: '导出出错',
      en: 'export error',
    } as unknown as string,
    EXPORT_FAIL: {
      zh: '导出失败',
      en: 'export fail',
    } as unknown as string,
  },
  UPDATE_PROCESS: {
    UPDATE_VERSION: {
      zh: '更新版本',
      en: 'Update version',
    } as unknown as string,
    DEVICE_INFO: {
      zh: '设备信息',
      en: 'Device info',
    } as unknown as string,
    CURRENT_VERSION: {
      zh: '当前版本号：',
      en: 'current version: ',
    } as unknown as string,
    DEVICE_NOT_CONNECT: {
      zh: '设备未连接',
      en: 'device not connected',
    } as unknown as string,
    LATEST_VERSION: {
      zh: '最新版本',
      en: 'latest version',
    } as unknown as string,
    NOT_CLOSE: {
      zh: '，请勿关闭窗口',
      en: ', please do not close the window.',
    } as unknown as string,
    UPGRADE_FINISH: {
      zh: '升级完成',
      en: 'Upgrade completed',
    } as unknown as string,
    DOWNLOAD_FIRMWARE: {
      zh: '下载固件',
      en: 'Downloading firmware',
    } as unknown as string,
    SEND_FIRMWARE: {
      zh: '固件下载完成，传输中',
      en: 'Transferring firmware',
    } as unknown as string,
    UPGRADE_FINISH_WAIT: {
      zh: '升级完成，请等待设备重启后，重新连接JOYO',
      en: 'Upgrade completed, wait for the device to reboot and then reconnect to JOYO',
    } as unknown as string,
  },
  GAME_LIST: {
    DOWNLOAD: {
      zh: '下载游戏',
      en: 'Download',
    } as unknown as string,
    DELETE: {
      zh: '删除游戏',
      en: 'Delete',
    } as unknown as string,
    DELETE_CONFIRM: {
      zh: '确定要删除该游戏吗',
      en: 'Sure you want to delete the game?',
    } as unknown as string,
    CREATE_NEW_GAME: {
      zh: '创建新游戏',
      en: 'Create a new game',
    } as unknown as string,
    RENAME_GAME: {
      zh: '修改游戏程序名',
      en: 'Rename the game',
    } as unknown as string,
    GAME_NAME: {
      zh: '游戏程序名',
      en: 'Game name',
    } as unknown as string,
  },
  HOME_CONNECT_TIP: {
    TITLE: {
      zh: '连接帮助',
      en: 'Connection Help',
    } as unknown as string,
    P1_TITLE: {
      zh: '与您的JOYO设备配对',
      en: 'Pairing with your JOYO device',
    } as unknown as string,
    P1_1: {
      zh: '确保JOYO已开机。',
      en: 'Make sure JOYO is on.',
    } as unknown as string,
    P1_2: {
      zh: '在 Chrome 浏览器中打开此页面。',
      en: 'Open this page in Chrome.',
    } as unknown as string,
    P1_3: {
      zh: '点击「连接JOYO」按钮，然后系统会要求您添加设备。',
      en: 'Click the 「Connect JOYO」 button, then you will be asked to add a device.',
    } as unknown as string,
    P1_4: {
      zh: '从列表中选择JOYO设备。设备会以“JOYO”开头。',
      en: 'Select the JOYO device from the list. The device name will start with "JOYO".',
    } as unknown as string,
    P1_5: {
      zh: '选择「配对」或「连接」',
      en: 'Select「Pair」or「Connect」',
    } as unknown as string,
    P2_TITLE: {
      zh: '排查蓝牙配对问题',
      en: 'Troubleshoot Bluetooth pairing problems',
    } as unknown as string,
    P2_1: {
      zh: '如果网站找不到您的设备，请点击重新搜索。',
      en: "If the site can't find your device, click 「Search again」.",
    } as unknown as string,
    P2_2: {
      zh: '如果网站找不到您的设备，请确保已在您的计算机上开启蓝牙功能：',
      en: "If the site can't find your device, make sure that Bluetooth is turned on for your computer: ",
    } as unknown as string,
    P2_3: {
      zh: '当计算机都已开启蓝牙后，重新扫描您的设备。',
      en: 'When both devices have Bluetooth turned on, re-scan for your device.',
    } as unknown as string,
    P2_4: {
      zh: '提示',
      en: 'Tip',
    } as unknown as string,
    P2_5: {
      zh: '：如果您使用的是 Windows 计算机，但仍无法连接到蓝牙，您可能需要更改隐私设置以允许相关应用控制设备上的无线装置。',
      en: "：If you're on a Windows computer and still can't connect to Bluetooth, you may need to change your privacy settings to allow apps to control device radios.",
    } as unknown as string,
    P2_6: {
      zh: '要详细了解系统设置，请访问 Microsoft 帮助中心。',
      en: 'To learn more about system settings, go to the Microsoft help center.',
    } as unknown as string,
  },
  // 游戏程序页
  BLOCKLY_MENU: {
    SAVE: {
      zh: '保存',
      en: 'Save',
    } as unknown as string,
    CONNECT: {
      zh: '连接JOYO',
      en: 'Connect',
    } as unknown as string,
    DISCONNECT: {
      zh: '断开连接',
      en: 'Disconnect',
    } as unknown as string,
    RUN: {
      zh: '运行',
      en: 'Run',
    } as unknown as string,
    STOP: {
      zh: '停止',
      en: 'Stop',
    } as unknown as string,
    CLEAR_CANVAS: {
      zh: '清空画布',
      en: 'Clear Canvas',
    } as unknown as string,
    GAME_RULE: {
      zh: '玩法规则',
      en: 'Game Rule',
    } as unknown as string,
    NOT_SUPPORT_MODE: {
      zh: '当前暂未支持连续识别同一ID值',
      en: 'Continuous identification of the same ID value has not support yet',
    } as unknown as string,
    STATUS_INFO: {
      zh: '状态信息',
      en: 'Status Info',
    } as unknown as string,
    CONNECT_STATUS: {
      zh: '连接状态',
      en: 'Connect Statu',
    } as unknown as string,
    HAS_CONNECT: {
      zh: '已连接',
      en: 'Connected',
    } as unknown as string,
    NOT_CONNECT: {
      zh: '未连接',
      en: 'Not connected',
    } as unknown as string,
    ID_VAL: {
      zh: 'ID值',
      en: 'ID value',
    } as unknown as string,
    CLEAR_CANVAS_CONFIRM: {
      zh: '确定要清空所有程序块吗?',
      en: 'Sure you want to clear all blocks?',
    } as unknown as string,
    NOT_SAVE_TIP: {
      zh: '当前程序未保存，确认离开？?',
      en: 'Current program has not be saved yet, Sure want to leave?',
    } as unknown as string,
  },
  VARIABLE_DRAWER: {
    VARIABLE_MSG: {
      zh: '变量信息',
      en: 'Variable Info',
    } as unknown as string,
    // VARIABLE_CREATE: {
    //   zh: '创建变量',
    //   en: '创建变量',
    // } as unknown as string,
    VARIABLE_EMPTY: {
      zh: '暂无数据',
      en: 'Empty',
    } as unknown as string,
    VARIABLE_MGR: {
      zh: '变量管理',
      en: 'Variable Operation',
    } as unknown as string,
    CREATE_NEW_VARIABLE: {
      zh: '创建变量',
      en: 'Create Variable',
    } as unknown as string,
    CREATE_NEW_LIST: {
      zh: '新建列表',
      en: 'Create List',
    } as unknown as string,
    CREATE_CANCEL: {
      zh: '取消',
      en: 'cancel',
    } as unknown as string,
    CREATE_CONFIRM: {
      zh: '确认',
      en: 'ok',
    } as unknown as string,
    RENAME: {
      zh: '重命名',
      en: 'rename',
    } as unknown as string,
    DELETE: {
      zh: '删除',
      en: 'delete',
    } as unknown as string,
    VARIABLE: {
      zh: '变量',
      en: 'variable',
    } as unknown as string,

    VARIABLE_INPUT: {
      zh: '请输入变量名',
      en: 'input variable name',
    } as unknown as string,
    LIST: {
      zh: '列表',
      en: 'list',
    } as unknown as string,
    LIST_INPUT: {
      zh: '请输入列表名',
      en: 'input list name',
    } as unknown as string,
  },
  BLOCKLY_STATUS: {
    STATUS_INFO: {
      zh: '状态信息',
      en: 'status info',
    } as unknown as string,
    SET_LIGHT: {
      zh: '设置灯光',
      en: 'Set Light',
    } as unknown as string,
  },
  GAME_RULE: {
    UPDATE_GAMEPLAY: {
      zh: '修改玩法',
      en: 'Update the gameplay',
    } as unknown as string,
    GAME_RULE: {
      zh: '玩法规则',
      en: 'Gameplay',
    } as unknown as string,
    GAME_TOKEN: {
      zh: '游戏配件',
      en: 'Game tokens',
    } as unknown as string,
    GAME_TOKEN_TIP: {
      zh: '此游戏所需配件、道具等',
      en: 'Tokens, props, etc. required for this game',
    } as unknown as string,
    GAME_FLOW: {
      zh: '玩法流程',
      en: 'Game Flow',
    } as unknown as string,
    GAME_INTRO: {
      zh: '此游戏玩法说明介绍',
      en: 'Description of how to play this game',
    } as unknown as string,
  },
}

function generateObj (tempObj: any, lang: string) {
  const newObj: any = {}
  for (const item in tempObj) {
    if (typeof tempObj[item] !== 'string') {
      newObj[item] = {}
      if (tempObj[item][lang]) { // 如果有多语言key，最底层
        newObj[item] = tempObj[item][lang]
      } else {
        newObj[item] = generateObj(tempObj[item], lang)
      }
    } else {
      newObj[item] = tempObj[item]
    }
  }
  return newObj
}
export const zh = generateObj(obj, 'zh')
export const en = generateObj(obj, 'en')
// console.log(zh, 'zh')
// console.log(en, 'en')
export default obj
