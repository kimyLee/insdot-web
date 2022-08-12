
export type ClientResponse = {
  /** 状态码, 200为成功 */
  code: number;
  /** 客户端返回的数据 */
  data?: any;
  message: string;
  result?: any;
}

export type ClientResponseWithData<T> = {
  /** 状态码, 200为成功 */
  code: number;
  /** 客户端返回的数据 */
  data?: T;
  message: string;
}

export type BleList = {
  name: string,
  uuid: string,
}
