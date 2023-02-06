import axios from '@/utils/axios'
import { message } from 'ant-design-vue'

export function fetchOriginVersion (): Promise<string> {
  let url = 'https://cuby-joyo.oss-cn-hongkong.aliyuncs.com/firmware.json'
  if (location.href.indexOf('code.cubyfun.com') < 0) {
    url = 'https://cuby-joyo-test.oss-cn-hongkong.aliyuncs.com/firmware.json'
  }
  return axios.get(url + '?t=' + Date.now())
    .then(function (response: any) {
      return response // todo: 其他信息
    })
    .catch(function (error) {
      message.error('获取最新版本信息失败')
      console.log(error)
    })
}

export function fetchFirmware (url: string): Promise<void> {
  return axios.get(url, { responseType: 'arraybuffer' })
    .then(function (response: any) {
      // 处理成功情况
      return response // todo: 其他信息
    })
    .catch(function (error) {
      message.error('下载固件失败')
      // 处理错误情况
      console.log(error)
    })
}
