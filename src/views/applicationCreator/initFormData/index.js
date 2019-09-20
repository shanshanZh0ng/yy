// 存储初始化数据
export const storageSchema = {
  name: '',
  mountName: '',
  resouceQuota: 0,
  max: 20,
  marks: {
    0: '存储',
    20: '20G'
  },
  sliderUnit: 'G',
  accessAttributes: '1',
  options: [
    {
      value: '选项1',
      label: '1'
    },
    {
      value: '选项2',
      label: '2'
    },
    {
      value: '选项3',
      label: '3'
    }
  ],
  optionValue: '',
  isDisabled: true,
  isExpand: true,
  isChecked: false
}

// 数据库初始化数据
export const databaseSchema = {
  name: '',
  userName: '',
  password: '',
  sliderData: [
    { max: 20, defaultNum: 0, unit: '核', name: 'CPU' },
    { max: 20, defaultNum: 0, unit: 'G', name: '内存' },
    { max: 20, defaultNum: 0, unit: 'G', name: '存储' }
  ],
  isDisabled: true,
  isExpand: true,
  isChecked: false
}

// 环境设置模板/镜像tab切换数据
export const tabDatas = {
  runningTab: {
    name: 'runningTab',
    label: '公共模板',
    server: '',
    version: '',
    resource: '',
    domain: '',
    versions: {},
    resources: {},
    domains: {},
    tabData: [
      {
        server: 'tomcat',
        versions: ['版本号1', '版本号2'],
        resources: [{label: '1核2G', id: 1}, {label: '2核4G', id: 2}, {label: '4核8G', id: 3}],
        domains: {first: 'inatance.paas.casicloud.com', port: '27017'},
        id: 1
      },
      {
        server: 'apache',
        versions: ['版本号1.0.1', '版本号2'],
        resources: [{label: '1核2G2', id: 1}, {label: '2核4G', id: 2}, {label: '4核8G', id: 3}],
        domains: {first: 'inatance.paas.casicloud.com', port: '27017'},
        id: 2
      }
    ]
  },
  mirrorTab: {
    name: 'mirrorTab',
    label: '我的镜像',
    server: 'tomcat',
    version: 'm版本号1.0',
    resource: 'm1核2G',
    domain: '',
    versions: {},
    resources: {},
    domains: {},
    tabData: [
      {
        server: 'tomcat',
        versions: ['m版本号1.0', 'm版本号2'],
        resources: [{label: 'm1核2G', id: 1}, {label: 'm2核4G', id: 2}, {label: 'm4核8G', id: 3}],
        domains: {first: 'inatance.paas.casicloud.com', port: '27017'},
        id: 1
      },
      {
        server: 'apache',
        versions: ['版本号1.0.1', '版本号2'],
        resources: [{label: '1核2G2', id: 1}, {label: '2核4G', id: 2}, {label: '4核8G', id: 3}],
        domains: {first: 'inatance.paas.casicloud.com', port: '27018'},
        id: 2
      }
    ]
  }
}
