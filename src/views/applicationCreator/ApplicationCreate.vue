<template>
  <div class="application">
    <BaseConfig ref="baseConfig"></BaseConfig>
    <RuntimeEnv ref="runtime"></RuntimeEnv>
    <el-row class="mainBtnD">
      <el-button>取消</el-button>
      <el-button type="primary" @click="create">创建</el-button>
    </el-row>
  </div>
</template>

<script type="text/ecmascript-6">
import BaseConfig from './components/baseConfig/BaseConfig'
import RuntimeEnv from './components/runtimeEnvConfig/index'
import axios from 'axios'
import {findComponentDownward} from '@/common/js/helpers.js'

axios.defaults.baseURL = process.env.API_ROOT

export default {
  name: 'ApplicationCreate',
  data () {
    return {
    }
  },
  created () {
  },
  components: {
    BaseConfig,
    RuntimeEnv
  },
  methods: {
    create () {
      this.$refs.baseConfig.submitForm() // 调用基础设置子组件的校验规则
      let flag1 = this.$refs.baseConfig.submitForm()
      let activeTab = this.$refs.runtime.editableTabsValue // 获取运行环境设置的tab激活界面的value
      let tabContent = this.$refs.runtime.$children[1].$children[1] // tab切换所有的数据
      let activeContent // 定义tab切换当前激活的界面
      tabContent.$children.forEach(v => {
        if (v.name) {
          if (v.name === activeTab) {
            activeContent = v
          }
        }
      })
      this.$refs.runtime.formSubmit(activeContent)
      let flag2 = this.$refs.runtime.formSubmit(activeContent)

      let isPaas = Boolean(flag1 && flag2)
      if (isPaas) {
        this.$message({
          message: '保存成功！',
          type: 'success'
        })
        console.log('基础设置数据：', this.$refs.baseConfig.ruleForm, '运行环境设置数据：', this.$refs.runtime._data.editableTabs)
      } else {
        this.$message({
          message: '请按规则输入必填项！',
          type: 'warning'
        })
      }
    },
    component () {
      let setting = findComponentDownward(this, 'Settings') // 获取环境设置子组件
      const flag = []
      setting.settings.forEach(v => {
        if (v.value) {
          let initData = findComponentDownward(this, `${v.alias}`)[`initial${v.alias}`]
          initData.forEach((val, index) => {
            if (val.isExpand) {
              findComponentDownward(this, `${v.alias}`).submitForm(index)
              let _flag = findComponentDownward(this, `${v.alias}`).submitForm(index)
              flag.push(_flag)
            }
          })
        }
      })
      if (flag.indexOf(false) === 0) {
        return false
      } else {
        return true
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.application {
  padding-bottom: 60px;
  margin: 20px;
}
</style>
