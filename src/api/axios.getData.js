import axios from 'axios'

// 基础设置-可用区
export function getOptionalData () {
  return axios.post('api/clusters', {})
}

// 运行环境设置-存储-资源配额最大额
export function getStorageResource () {
  return axios.post('api/storages', {projectGuid: 'b248a6d8-ad08-4da5-a74b-5a9235418c23'})
}

// 运行环境设置-存储-副本数量下拉数据（无）
export function getStorageList () {
  return axios.post('', {}).then(res => {
    if (res.data.code === 0) {
      return res.data
    }
  }).catch(err => {
    console.log(err)
  })
}

// 运行环境设置-数据库-资源配额
export function getDatabaseResource () {
  return axios.post('api/service/maxQuotas', {'projectGuid': 'b248a6d8-ad08-4da5-a74b-5a9235418c23'})
}

// 运行环境设置-数据库-镜像下拉数据（无）
export function getDatabaseMirror () {
  axios.post('', {}).then(res => {
    if (res.data.code === 0) {
      return res.data
    }
  }).catch(err => {
    console.log(err)
  })
}

// 运行环境设置-数据库-版本下拉数据（无）
export function getDatabaseVersion () {
  axios.post('', {}).then(res => {
    if (res.data.code === 0) {
      return res.data
    }
  }).catch(err => {
    console.log(err)
  })
}

// 运行环境设置-环境设置-tab切换：镜像和版本
export function getEnvironmentTab () {
  return axios.post('api/repos', {'apply': 1, 'projectGuid': 'b248a6d8-ad08-4da5-a74b-5a9235418c23'})
}

// 运行环境设置-环境设置-资源配额
export function getEnvironmentResource () {
  return axios.post('api/list/pricePackage', {'name': '应用', 'projectGuid': 'b248a6d8-ad08-4da5-a74b-5a9235418c23'})
}

// 运行环境设置-环境设置-域名
export function getEnvironmentDomain () {
  return axios.post('api/domains', {'type': 0, 'projectGuid': 'b248a6d8-ad08-4da5-a74b-5a9235418c23'})
}
