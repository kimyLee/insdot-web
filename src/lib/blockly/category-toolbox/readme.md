关于如何预设 block
参考 https://developers.google.com/blockly/guides/configure/web/toolbox#shadow_blocks

并借助https://blockly-demo.appspot.com/static/demos/code/index.html?lang=zh-hans

或者以下命令，拖拽block后导出代码

```
console.log(Blockly.serialization.workspaces.save(Blockly.getMainWorkspace()));

```