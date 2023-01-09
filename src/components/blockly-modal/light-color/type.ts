/*
 * @Author: hsycc
 * @Date: 2021-10-08 00:08:41
 * @LastEditTime: 2021-12-07 10:05:38
 * @Description:
 *
 */

export enum ColorEnum {
  'WHITE' = 'WHITE',
  'GRAY' = 'GRAY',
  'BLACK' = 'BLACK',
  'TURQUOISEBLUE' = 'TURQUOISEBLUE',
  'BLUE' = 'BLUE',
  'BLUEVIOLET' = 'BLUEVIOLET',
  'PURPLE' = 'PURPLE',
  'CRIMSON' = 'CRIMSON',
  'ORANGERED' = 'ORANGERED',
  'ORANGE' = 'ORANGE',
  'YELLOW' = 'YELLOW',
  'GREENYELLOW' = 'GREENYELLOW'

}

export const Colors = [
  {
    key: ColorEnum.WHITE,
    value: '#FFFFFF',
  },
  {
    key: ColorEnum.GRAY,
    value: '#9C9C9C',
  },
  {
    key: ColorEnum.BLACK,
    value: '#000000',
  },
  {
    key: ColorEnum.TURQUOISEBLUE,
    value: '#27C8FE',
  },
  {
    key: ColorEnum.BLUE,
    value: '#0061FB',
  },
  {
    key: ColorEnum.BLUEVIOLET,
    value: '#4114CE',
  },
  {
    key: ColorEnum.PURPLE,
    value: '#900DC6',
  },
  {
    key: ColorEnum.CRIMSON,
    value: '#C51856',
  },
  {
    key: ColorEnum.ORANGERED,
    value: '#EA2C04',
  },
  {
    key: ColorEnum.ORANGE,
    value: '#FF6A03',
  },
  {
    key: ColorEnum.YELLOW,
    value: '#FECA06',
  },
  {
    key: ColorEnum.GREENYELLOW,
    value: '#35C759',
  },
]

// 默认播放速度

export const PlaySpeedDefault = 16

export enum PlayEnum {
  PLAY_START = 1,
  PLAY_PAUSE = 0,
}

export enum ActionsEnum {
  // PLAY = 'PLAY',
  DELETE = 'DELETE',
  CLONE = 'CLONE',
  UNDO = 'UNDO',
  REDO = 'REDO',
  SPEED = 'SPEED',
}
export enum ToolsEnum {
  PEN = 'tool-pen',
  ERASER = 'tool-eraser',
  RECTANGLE = 'tool-rectangle',
  CIRCULAR = 'tool-circle',
  MIRROR = 'tool-vertical-mirror-pen',
  PAINT = 'tool-paint-bucket',
  MOVE = 'tool-move',
}

export type ActionSpeedType = 1 | 2 | 3;

export const PiskelSizes = {
  small: [18, 18],
  middle: [32, 32],
  large: [64, 64],
}

export const PiskelSettings = {
  GRID_COLOR: 'GRID_COLOR',
  GRID_ENABLED: 'GRID_ENABLED',
  GRID_WIDTH: 'GRID_WIDTH',
  GRID_SPACING: 'GRID_SPACING',
  MAX_FPS: 'MAX_FPS',
  DEFAULT_SIZE: 'DEFAULT_SIZE',
  CANVAS_BACKGROUND: 'CANVAS_BACKGROUND',
  SELECTED_PALETTE: 'SELECTED_PALETTE',
  SEAMLESS_OPACITY: 'SEAMLESS_OPACITY',
  SEAMLESS_MODE: 'SEAMLESS_MODE',
  PREVIEW_SIZE: 'PREVIEW_SIZE',
  ONION_SKIN: 'ONION_SKIN',
  LAYER_PREVIEW: 'LAYER_PREVIEW',
  LAYER_OPACITY: 'LAYER_OPACITY',
  EXPORT_SCALE: 'EXPORT_SCALE',
  EXPORT_TAB: 'EXPORT_TAB',
  EXPORT_GIF_REPEAT: 'EXPORT_GIF_REPEAT',
  PEN_SIZE: 'PEN_SIZE',
  RESIZE_SETTINGS: 'RESIZE_SETTINGS',
  COLOR_FORMAT: 'COLOR_FORMAT',
  TRANSFORM_SHOW_MORE: 'TRANSFORM_SHOW_MORE',
  PREFERENCES_TAB: 'PREFERENCES_TAB',
  KEY_TO_DEFAULT_VALUE_MAP_: {
    GRID_COLOR: 'rgba(0, 0, 0, 1)', // || Constants.TRANSPARENT_COLOR,
    GRID_ENABLED: false,
    GRID_WIDTH: 1,
    GRID_SPACING: 1,
    MAX_FPS: 24,
    DEFAULT_SIZE: {
      width: 18, // Constants.DEFAULT.WIDTH,
      height: 18, // Constants.DEFAULT.HEIGHT
    },
    CANVAS_BACKGROUND: 'light-canvas-background' || 'lowcont-dark-canvas-background',
    SELECTED_PALETTE: '__current-colors', // Constants.CURRENT_COLORS_PALETTE_ID,
    SEAMLESS_OPACITY: 0.30,
    SEAMLESS_MODE: false,
    PREVIEW_SIZE: 'best',
    ONION_SKIN: false,
    LAYER_OPACITY: 0.2,
    LAYER_PREVIEW: true,
    EXPORT_SCALE: 1,
    EXPORT_TAB: 'gif',
    EXPORT_GIF_REPEAT: true,
    PEN_SIZE: 1,
    RESIZE_SETTINGS: {
      maintainRatio: true,
      resizeContent: false,
      origin: 'MIDDLE', // 'TOPLEFT'
    },
    COLOR_FORMAT: 'hex',
    TRANSFORM_SHOW_MORE: false,
    PREFERENCES_TAB: 'misc',
  },
}
