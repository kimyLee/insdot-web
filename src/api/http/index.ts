import axios from '@/utils/axios'
import { message } from 'ant-design-vue'

export function getFirmwareVersion (): Promise<string> {
  return axios.get('https://cuby-joyo.oss-cn-hongkong.aliyuncs.com/firmware.json')
    .then(function (response: any) {
      // 处理成功情况
      console.log(response)
      return response.version // todo: 其他信息
    })
    .catch(function (error) {
      message.error('获取版本信息失败')
      // 处理错误情况
      console.log(error)
    })
  // .then(function () {
  //   // 总是会执行
  // })
}
