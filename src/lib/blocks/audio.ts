
// // todo: blockly 类型
import Blockly from 'blockly'

Blockly.defineBlocksWithJsonArray([
  {
    type: 'play_audio',
    // message0: 'play audio %1',
    message0: '播放 %1 音效',
    args0: [
      {
        type: 'field_dropdown',
        name: 'NAME',
        options: [
          [
            'win',
            'gwin',
          ],
          [
            'wrong',
            'olwh',
          ],
          [
            'game begin',
            'gbeg',
          ],
          [
            'game begin2',
            'pbgn',
          ],
          [
            'game begin3',
            'stat',
          ],
          [
            'count down',
            'tend',
          ],
          [
            'count last',
            'tala',
          ],
          [
            'count last',
            'poff',
          ],
          [
            'move1',
            'mov1',
          ],
          [
            'move2',
            'mov2',
          ],
          [
            'move3',
            'mov3',
          ],
          [
            'move4',
            'mov4',
          ],
          [
            'move5',
            'mov5',
          ],
          [
            'match 1',
            'mat1',
          ],
          [
            'match 2',
            'mat2',
          ],
          [
            'match 3',
            'mat3',
          ],
          [
            'match 4',
            'mat4',
          ],
          [
            'match 5',
            'mat5',
          ],
          [
            'hred',
            'hred',
          ],
          [
            'find nothing',
            'fnon',
          ],
          [
            'find target',
            'fhed',
          ],
          [
            'find target2',
            'fbdy',
          ],
          [
            'check',
            'chek',
          ],
          [
            'do',
            '01do',
          ],
          [
            're',
            '02re',
          ],
          [
            'mi',
            '03mi',
          ],
          [
            'fa',
            '04fa',
          ],
          [
            'so',
            '05so',
          ],
          [
            'la',
            '06la',
          ],
        ],
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: '',
    helpUrl: '',
  },
])

Blockly.JavaScript.play_audio = function (block: any) {
  const dropdown_name = block.getFieldValue('NAME')
  return 'blePlayMusic("' + dropdown_name + '");\n'
}
