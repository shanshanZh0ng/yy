<template>
    <div class="environment">
      <div class="margBot15 pad_t10">
        <i class="el-icon-s-management baseBlue"></i>
        <span>{{title}}</span>
      </div>
        <Card :cardName="cardName" :handleBtn="handleBtn" :nameIndex="$attrs.nameIndex">
          <el-tabs v-model="name" class="inlineBlock left" style="width:100%;">
            <el-tab-pane v-for="tab in tabs" :key="tab.id" :label="tab.label" :name="tab.name">
              <el-form label-width="140px" class="demo-ruleForm" :serverData="serverData" :model="serverData" :ref="`env${tab.name}`" :rules="rules">
                <el-form-item label="选择模板/镜像" required>
                  <el-radio-group v-model="serverData.server">
                    <el-radio-button
                      :label="server.server"
                      v-for="server in serverData.tabData"
                      :key="server.server"
                    >{{server.server}}</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="选择版本" required>
                  <el-radio-group v-model="serverData.version">
                    <el-radio-button
                      :label="version"
                      v-for="(version, index) in serverData.versions"
                      :key="index"
                    ></el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="资源配置" required>
                  <el-radio-group v-model="serverData.resource" class="left">
                    <el-radio-button
                      :label="resource"
                      class="margin-r20 noradius border"
                      v-for="resource in resources"
                      :key="resource"
                    ></el-radio-button>
                  </el-radio-group>
                  <el-tooltip class="item" effect="dark" content="提示文字" placement="right">
                    <i class="el-icon-question icon-q"></i>
                  </el-tooltip>
                </el-form-item>
                <el-form-item label="子域名" prop="domain">
                  <el-row class="left" style="width:80%">
                    <el-col :span="18">
                      <div class="center">
                        <el-input placeholder="请输入内容" v-model="serverData.domain">
                          <template slot="prepend">Http://</template>
                          <template slot="append">{{domains.name}}</template>
                        </el-input>
                      </div>
                    </el-col>
                    <el-col class="center" :span="4">
                      <div class="bg-purple-light">
                        <div class="lastInput center">{{serverData.port}}</div>
                      </div>
                    </el-col>
                    <el-col style="width: 30px;">
                      <el-tooltip effect="dark" content="提示文字" placement="right">
                        <i class="el-icon-question icon-q"></i>
                      </el-tooltip>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </Card>
    </div>
</template>

<script>
import Card from '@/components/card'
import {tabDatas} from '@/views/applicationCreator/initFormData'
// eslint-disable-next-line
import {cloneDeep} from 'lodash'
import {getEnvironmentTab, getEnvironmentResource, getEnvironmentDomain} from 'api/axios.getData.js'

export default {
  props: {
    _initialEnvironment: {
      type: Object,
      // default: () => cloneDeep(tabDatas)
      default: () => {}
    }
  },
  name: 'Environment',
  data () {
    // let validCode = (rule, value, callback) => {
    //   console.log(value)
    //   if (!reg.test(value)) {
    //     callback(new Error('名称为1-64个字符，只能包含数字、英文字符，或 “_”'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      title: '环境设置',
      cardName: 'environment',
      handleBtn: false,
      name: 'runningTab',
      serverData: {
        name: '',
        label: '',
        server: '',
        version: '',
        resource: '',
        domain: '',
        versions: [],
        resources: [],
        domains: {},
        tabData: [],
        port: ''
      },
      resources: ['1核2G', '2核4G', '4核8G'],
      domains: {name: 'inatance.paas.casicloud.com'},
      initialEnvironment: cloneDeep(tabDatas),
      initialTab: [],
      tabs: [{name: 'runningTab', label: '公共模板', id: 1}, {name: 'mirrorTab', label: '我的镜像', id: 2}],
      environmentEmitValue: {},
      rules: {
        domain: [
          { required: true, message: '请输入域名', trigger: 'blur' }
          // { validator: validCode, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.setEnvDefaultVal(`${this.name}`)

    // this._getEnvironmentTab() // 调用接口
    // this._getEnvironmentResource() // 调用接口
    // this._getEnvironmentDomain() // 调用接口
  },
  methods: {
    setEnvDefaultVal (name) {
      this.serverData = this.initialEnvironment[name]
      const tabConten = this.serverData.tabData[0]
      this.serverData.server = tabConten.server
      this.serverData.versions = tabConten.versions
      // this.serverData.resources = tabConten.resources // -新增
      this.serverData.resources = this.resources // -新增
      // this.serverData.domains = tabConten.domains // -新增
      this.serverData.domains = tabConten.port // -新增
      // 设置版本和资源默认值
      this.serverData.version = tabConten.versions[0] // .id
      // this.serverData.resource = tabConten.resources[0].id // -新增
      this.serverData.resource = this.resources[0] // -新增
      this.serverData.port = tabConten.port // -新增
    },

    // 过滤传给外面的表单值，只传外面需要的
    filterEmitValue (datas) {
      this.environmentEmitValue = {
        name: datas.name,
        server: datas.server,
        version: datas.version,
        resource: datas.resource, // -注释
        domain: datas.domain // -注释
      }

      this.$emit('save-environment-config', this.environmentEmitValue)
    },

    submitForm (name) {
      let flag = false
      this.$refs[`env${name}`][0].validate(valid => {
        if (valid) {
          flag = valid
          return true
        } else {
          return false
        }
      })
      return flag
    },
    resetForm (name) {
      this.$refs[`env${name}`][0].resetFields()
    },
    // 获取tab切换数据
    _getEnvironmentTab () {
      getEnvironmentTab().then(res => {
        let data = res.data
        if (data.code === 0) {
          console.log(res.data)
          const runData = []
          const mirrorData = []
          data.list.filter(val => {
            let name = val.name.split('/')
            let _i = name.length - 1
            val.server = name[_i]
            val.versions = val.tags
            val.port = Object.keys(val.ports)[0]
            // console.log(Object.keys(val.ports)[0])
            val.domains = val.ports
            if (val.isPublic === 1) {
              runData.push(val)
            } else if (val.isPublic === 0) {
              mirrorData.push(val)
            }
          })
          this.initialEnvironment.runningTab.tabData = runData
          this.initialEnvironment.runningTab.server = runData[0].server
          this.initialEnvironment.runningTab.version = runData[0].versions[0]
          this.initialEnvironment.runningTab.versions = runData[0].versions
          this.initialEnvironment.mirrorTab.tabData = mirrorData
          console.log(this.initialEnvironment.runningTab)
        }
      })
    },
    // 获取资源配置数据
    _getEnvironmentResource () {
      getEnvironmentResource().then(res => {
        let data = res.data
        if (data.code === 0) {
          this.resources = []
          console.log(res.data)
          data.list.filter((val, i) => {
            this.resources.push(`${val.cpuNum}核${val.memoryNum}G`)
          })
        }
      })
    },
    // 获取子域名
    _getEnvironmentDomain () {
      getEnvironmentDomain().then(res => {
        let data = res.data
        console.log(data)
        if (data.code === 0) {
          this.domains.name = data.list[0].name
        }
      })
    }
  },

  components: {
    Card
  },
  watch: {
    'name': function (val) {
      this.serverData = this.initialEnvironment[val]
      this.setEnvDefaultVal(val)

      this.resetForm('runningTab')
      this.resetForm('mirrorTab')
    },
    'serverData.server': function (val) {
      const tabData = this.serverData.tabData
      tabData.forEach((value, index) => {
        if (value.server === val) {
          this.serverData.version = value.versions[0] // .id
          this.serverData.versions = value.versions
          this.serverData.port = value.port // -新增
          // this.serverData.resource = value.resources[0].id // -注释
          // console.log(this.serverData)
        }
      })

      // this.$emit('save-environment-config', this.serverData)
      this.filterEmitValue(this.serverData)
    },
    'serverData.version': function (val) {
      this.serverData.version = val

      // this.$emit('save-environment-config', this.serverData)
      this.filterEmitValue(this.serverData) // -注释
    },
    'serverData.resource': function (val) {
      this.serverData.resource = val

      // this.$emit('save-environment-config', this.serverData)
      this.filterEmitValue(this.serverData)
    },

    'serverData.domain': function (val) {
      // this.$emit('save-environment-config', this.serverData)
      this.filterEmitValue(this.serverData)
    }
  }
}
</script>

<style scoped>
.lastInput {
  border: 1px solid #DCDFE6;
  border-left:none;
  color:#909399;
  height:38px;
  line-height:38px;
  background:#F5F7FA;
}
</style>
