import axios from '@/utils/axios'
import { message } from 'ant-design-vue'

export function fetchOriginVersion (): Promise<string> {
  return axios.get('https://cuby-joyo.oss-cn-hongkong.aliyuncs.com/firmware.json')
    .then(function (response: any) {
      return response // todo: 其他信息
    })
    .catch(function (error) {
      message.error('获取版本信息失败')
      console.log(error)
    })
}

export function fetchFirmware (url: string): Promise<void> {
  return axios.get(url, { responseType: 'blob' })
    .then(function (response: any) {
      // 处理成功情况
      console.log(response)
      return response // todo: 其他信息
    })
    .catch(function (error) {
      message.error('下载固件失败')
      // 处理错误情况
      console.log(error)
    })
}
