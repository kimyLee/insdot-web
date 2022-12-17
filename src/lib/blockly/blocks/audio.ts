
// // todo: blockly 类型
import Blockly from 'blockly'
import '../block-js-code/audio'

Blockly.defineBlocksWithJsonArray([
  {
    type: 'play_audio',
    message0: '%{BKY_AUDIO_PLAY_AUDIO}',
    args0: [
      {
        type: 'field_dropdown',
        name: 'NAME',
        options: [
          [
            '%{BKY_AUDIO_WIN}',
            'gwin',
          ],
          [
            '%{BKY_AUDIO_WRONG}',
            'olwh',
          ],
          [
            '%{BKY_AUDIO_GAME_BEGIN_1}',
            'gbeg',
          ],
          [
            '%{BKY_AUDIO_GAME_BEGIN_2}',
            'pbgn',
          ],
          [
            '%{BKY_AUDIO_GAME_BEGIN_3}',
            'stat',
          ],
          [
            '%{BKY_AUDIO_COUNT_DOWN}',
            'tend',
          ],
          [
            '%{BKY_AUDIO_COUNT_LAST}',
            'tala',
          ],
          // [
          //   '%{BKY_AUDIO_WIN}',
          //   'poff',
          // ],
          [
            '%{BKY_AUDIO_MOVE_1}',
            'mov1',
          ],
          [
            '%{BKY_AUDIO_MOVE_2}',
            'mov2',
          ],
          [
            '%{BKY_AUDIO_MOVE_3}',
            'mov3',
          ],
          [
            '%{BKY_AUDIO_MOVE_4}',
            'mov4',
          ],
          [
            '%{BKY_AUDIO_MOVE_5}',
            'mov5',
          ],
          [
            '%{BKY_AUDIO_MATCH_1}',
            'mat1',
          ],
          [
            '%{BKY_AUDIO_MATCH_2}',
            'mat2',
          ],
          [
            '%{BKY_AUDIO_MATCH_3}',
            'mat3',
          ],
          [
            '%{BKY_AUDIO_MATCH_4}',
            'mat4',
          ],
          [
            '%{BKY_AUDIO_MATCH_5}',
            'mat5',
          ],
          [
            '%{BKY_AUDIO_HRED}',
            'hred',
          ],
          [
            '%{BKY_AUDIO_FIND_NOTHING}',
            'fnon',
          ],
          [
            '%{BKY_AUDIO_FIND_TARGET}',
            'fhed',
          ],
          [
            '%{BKY_AUDIO_FIND_TARGET_2}',
            'fbdy',
          ],
          [
            '%{BKY_AUDIO_CHECK}',
            'chek',
          ],
          [
            '%{BKY_AUDIO_DO}',
            '01do',
          ],
          [
            '%{BKY_AUDIO_RE}',
            '02re',
          ],
          [
            '%{BKY_AUDIO_MI}',
            '03mi',
          ],
          [
            '%{BKY_AUDIO_FA}',
            '04fa',
          ],
          [
            '%{BKY_AUDIO_SO}',
            '05so',
          ],
          [
            '%{BKY_AUDIO_LA}',
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
