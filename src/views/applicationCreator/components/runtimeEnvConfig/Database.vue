<template>
  <div class="database">
    <div class="margBot15 pad_t10">
      <i class="el-icon-s-management baseBlue"></i>
      <span>{{title}}</span>
    </div>
    <div v-for="(database, index) in initialDatabase" :key="index">
      <el-collapse-transition>
        <Card
          v-show="database.isExpand"
          :cardName="cardName"
          :addBtn="addBtn"
          @on-submit="submitForm(index)"
          @on-reset="resetForm(index)"
          @on-add="addForm(index)"
          :nameIndex="$attrs.nameIndex"
          :cIndex="index+1"
        >
          <el-form
            :model="database"
            :rules="rules"
            :ref="`database${index}`"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item
              label="资源配额"
              required
            >
              <el-radio-group>
                <el-radio-button>自定义</el-radio-button>
              </el-radio-group>
              <el-form-item
                style="min-width: 300px;"
                class="inlineBlock"
                v-for="(item) in sliderData"
                :key="item.name"
                prop="defaultNum"
              >
                <el-slider
                  :marks="item.marks"
                  :max="item.max"
                  class="slider"
                  v-model.number="item.defaultNum"
                ></el-slider>
                <el-input
                  style="width:50px;"
                  v-model="item.defaultNum"
                ></el-input>{{item.unit}}
              </el-form-item>
            </el-form-item>
            <el-form-item label="镜像" required>
              <el-radio-group v-model="mirror">
                <el-radio-button
                  :label="mirror.server"
                  v-for="mirror in tabData"
                  :key="mirror.name"
                >{{mirror.server}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="版本" required>
              <el-radio-group v-model="version">
                <el-radio-button
                  :label="version"
                  v-for="(version, index) in versions"
                  :key="index"
                ></el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="账号"
              prop="userName"
            >
              <el-input
                style="width: 50%;"
                v-model="database.userName"
                placeholder="请输入账号"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="密码"
              prop="password"
            >
              <el-input placeholder="请输入密码"
                v-model="database.password"
                show-password
                style="width: 50%;"
              ></el-input>
            </el-form-item>
          </el-form>
        </Card>
      </el-collapse-transition>
      <div v-show="!database.isExpand">
        <div class="smallForm">
          <span>{{appName}}-{{cardName}}{{$attrs.nameIndex}}-{{index+1}}</span>
          <!-- <span>{{database.name}}</span> -->
          <el-tooltip effect="dark" content="删除" placement="top">
            <i class="el-icon-delete iconSize pointer" @click="deleteForm(index)"></i>
          </el-tooltip>
          <el-tooltip effect="dark" content="编辑" placement="top">
            <i class="el-icon-edit-outline iconSize pointer" @click="editForm(index)"></i>
          </el-tooltip>
        </div>
      </div>
    </div>
    <el-button
      v-show="addBtn"
      class="margBot15"
      type="primary"
      :disabled="isDisabled"
      @click="addForm"
    >{{addBtn}}</el-button>
  </div>
</template>

<script type="text/ecmascript-6">
import Card from '@/components/card'
// eslint-disable-next-line
import {cloneDeep} from 'lodash'
import {password} from '@/views/applicationCreator/validators'
import {databaseSchema} from '@/views/applicationCreator/initFormData'
import {getDatabaseResource, getEnvironmentTab} from 'api/axios.getData.js'

export default {
  props: {
    _initialDatabase: {
      type: Array,
      default: () => []
    }
  },
  name: 'Database',
  data () {
    return {
      title: '数据库',
      cardName: 'database',
      addBtn: '添加数据库',
      isDisabled: true,
      sliderData: [
        { max: 20, defaultNum: 0, unit: '核', name: 'CPU', marks: {0: 'CPU'} },
        { max: 20, defaultNum: 0, unit: 'G', name: '内存', marks: {0: '内存'} },
        { max: 20, defaultNum: 0, unit: 'G', name: '存储', marks: {0: '存储'} }
      ],
      rules: {
        typeOption: [
          { required: true, message: '请选择镜像类别', trigger: 'blur' }
        ],
        versionsOption: [
          { required: true, message: '请选择镜像版本', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, max: 16, validator: password, trigger: 'blur' }
        ]
      },
      initialDatabase: [], // 本地数据
      databaseEmitValue: [],
      tabData: [
        {
          server: 'tomcat',
          versions: ['版本号1', '版本号2']
        },
        {
          server: 'apache',
          versions: ['版本号1.0.1', '版本号2']
        }
      ],
      mirror: 'tomcat',
      version: '版本号1',
      versions: []
    }
  },
  created () {
    // this._getDatabaseResource() // 调用接口
    // this._getEnvironmentTab() // 调用接口

    this.versions = this.tabData[0].versions
  },
  components: {
    Card
  },
  mounted () {
    this.setInitialDatabase() // 创建
  },
  computed: {
    appName () {
      return this.$store.state.application.name
    }
  },
  methods: {
    marks (item) {
      const max = item.max
      return {
        0: `${item.name}`,
        [max]: `${item.max}`
      }
    },
    setInitialDatabase () {
      // 深度克隆schema 防止引用污染
      let cloned = _.cloneDeep(databaseSchema) // eslint-disable-line
      cloned.name = ` ${this.appName}-${this.cardName}${this.$attrs.nameIndex}-${this.initialDatabase.length + 1}`
      // 存入初始化的数组
      this.initialDatabase.push(cloned)
    },
    submitForm (index) {
      let flag = false
      this.$refs[`database${index}`][0].validate(valid => {
        if (valid) {
          flag = valid
          const currentStore = this.initialDatabase[index]
          this.isDisabled = false
          currentStore.isExpand = false
          currentStore.isChecked = true

          this.initialDatabase.forEach((v, i) => {
            v.name = `${this.appName}-${this.cardName}${this.$attrs.nameIndex}-${this.initialDatabase.length}`
          })
          // this.$emit('save-database-config', this.initialDatabase)
          this.filterEmitValue(this.initialDatabase) // 提交保存数据
        } else {
          this.initialDatabase[index].isDisabled = true
          this.initialDatabase[index].isChecked = false
          return false
        }
      })
      return flag
    },

    // 过滤传给外面的表单值，只传外面需要的
    filterEmitValue (datas) {
      this.databaseEmitValue = []

      datas.forEach((data, index) => {
        let slider = {}
        const sliderArray = []

        data.sliderData.forEach((v, i) => {
          slider = {}
          slider.defaultNum = v.defaultNum
          slider.name = v.name
          sliderArray.push(slider)
        })

        const form = {
          name: data.name,
          isDisabled: data.isDisabled,
          isExpand: data.isExpand,
          sliderData: sliderArray,
          // typeOption: data.typeOption,
          // versionsOption: data.versionsOption,
          // option: data.option,
          userName: data.userName,
          password: data.password,
          isChecked: data.isChecked,
          mirror: this.mirror,
          version: this.version
        }

        this.databaseEmitValue.push(form)
      })

      this.$emit('save-database-config', this.databaseEmitValue)
    },

    resetForm (index) {
      this.$refs[`database${index}`][0].model.sliderData.forEach(function (v, i) {
        v.defaultNum = 0
      })
      this.sliderData.forEach(function (v, i) {
        v.defaultNum = 0
      })

      this.$refs[`database${index}`][0].resetFields()
      this.isDisabled = true
      this.isChecked = false

      this.filterEmitValue(this.initialDatabase) // 提交保存数据
    },
    addForm (index) {
      this.setInitialDatabase()
      this.isDisabled = true
    },
    editForm (index) {
      let _checked = this._checked(this.initialDatabase)
      if (_checked) {
        this.initialDatabase[index].isExpand = true
        this.initialDatabase[index].isChecked = false
        this.isDisabled = true
      } else {
        this.$message({
          type: 'warning',
          message: '请输入所有必填项并保存'
        })
      }
    },
    deleteForm (index) {
      this.initialDatabase.splice(index, 1)

      this.filterEmitValue(this.initialDatabase) // 提交保存数据
    },

    _checked (_ch) {
      let checked = _ch[0].isChecked
      _ch.forEach((val, index) => {
        checked = checked && val.isChecked
      })

      return checked
    },

    // 获取数据库资源配额
    _getDatabaseResource () {
      getDatabaseResource().then(res => {
        let data = res.data
        if (data.code === 0) {
          this.sliderData[0].max = data.maxCpu
          this.sliderData[0].marks = this.marks(this.sliderData[0])
          this.sliderData[1].max = data.maxMemory
          this.sliderData[1].marks = this.marks(this.sliderData[1])
          this.sliderData[2].max = data.maxDisk
          this.sliderData[2].marks = this.marks(this.sliderData[2])
        }
      })
    },
    // 获取tab切换数据
    _getEnvironmentTab () {
      getEnvironmentTab().then(res => {
        let data = res.data
        if (data.code === 0) {
          const runData = []
          const mirrorData = []
          data.list.filter(val => {
            let name = val.name.split('/')
            let _i = name.length - 1
            val.server = name[_i]
            val.versions = val.tags
            val.port = Object.keys(val.ports)[0]
            val.domains = val.ports
            if (val.isPublic === 1) {
              runData.push(val)
            } else if (val.isPublic === 0) {
              mirrorData.push(val)
            }
          })
          this.tabData = runData
          this.mirror = runData[0].server
          this.version = runData[0].versions[0]
          this.versions = runData[0].versions
        }
      })
    }
  },
  watch: {
    'mirror': function (val) {
      this.tabData.filter((v, i) => {
        if (v.server === val) {
          this.versions = v.versions
          this.version = v.versions[0]
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .smallForm {
    margin: 10px 0;
    padding: 10px;
    height: 20px;
    width: 300px;
    border: 1px solid #ccc;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  }

  .el-slider__marks-text{
    width: 40px !important;
  }
</style>
