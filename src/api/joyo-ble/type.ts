export { ClientResponse } from '@/api/common-type'

export enum ParamsType {
  VERSION = 'version',
  STRING = 'string',
  STRING_END = 'stringEnd',
  NUMBER = 'number',
  FLOAT = 'float',
  NUMBER_REVERSE = 'numberReverse', // 小端处理
  NUMBER_ARRAY = 'numberArray',
}

export interface ParamsRule {
  start: number,
  len: number,
  subLen: number,
  type: ParamsType,
  name: string,
}

export interface ResParamsType {
  len: number, // 参数个数
  hasCallback?: boolean,
  params: ParamsRule[],
}
