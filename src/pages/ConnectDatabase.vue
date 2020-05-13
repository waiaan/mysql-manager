<template>
  <el-container class="connect-database">
    <el-header>
      <h1>CONNECT DATABASE</h1>
    </el-header>
    <el-main>
      <el-row :gutter="0">
        <el-col :span="9" style="height:1px;"></el-col>
        <el-col :span="6">
          <el-form ref="form" :model="form" label-width="80px" :rules="rules">
            <el-form-item label="host:" prop="host">
              <el-input v-model="form.host"></el-input>
            </el-form-item>
            <el-form-item label="port:" prop="port">
              <el-input v-model="form.port"></el-input>
            </el-form-item>
            <el-form-item label="user:" prop="user">
              <el-input v-model="form.user"></el-input>
            </el-form-item>
            <el-form-item label="password:" prop="password">
              <el-input v-model="form.password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">CONNECT</el-button>
              <el-button @click="resetForm">RESET</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-main>
    <el-dialog title="chose database" :visible.sync="dialog.show">
      <el-row :gutter="0">
        <el-col :span="8" style="height:1px;"></el-col>
        <el-col :span="8">
          <el-form :model="form">
            <el-form-item label="databases:">
              <el-select v-model="dialog.model" placeholder="">
                <el-option v-for="item in dialog.options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer">
        <el-button type="primary" @click="onConfirm">CONFIRM</el-button>
        <el-button @click="dialog.show = false">CANCLE</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>
<script>
import requests from '@/http/requests';

export default {
  name: 'ConnectDatabase',
  data () {
    return {
      form: {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: ''
      },
      rules: {
        host: {
          validator: (rule, value, callback) => {
            if (value.trim() === '') {
              callback(new Error('Please enter hostname'))
            }
            if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(value.trim())) {
              callback(new Error('Please enter a valid hostname'))
            }
            callback();
          }
        },
        port: {
          validator: (rule, value, callback) => {
            if (value.toString().trim() === '') {
              callback(new Error('Please enter host port'))
            }
            if (parseFloat(value).toString() === 'NaN' || value < 1 || value > 65535) {
              callback(new Error('Please enter a valid host port'))
            }
            callback();
          }
        },
        user: {
          validator: (rule, value, callback) => {
            if (value.trim() === '') {
              callback(new Error('Please enter username'))
            }
            callback();
          }
        }
      },
      dialog: {
        show: false,
        model: '',
        options: []
      }
    }
  },
  methods: {
    onSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          requests.createConnect({ data: this.form }).then(({ success, data }) => {
            if (success) {
              this.dialog.show = true
              const options = []
              for (let i = 0; i < data.length; i++) {
                const { Database } = data[i]
                options.push({ label: Database, value: Database })
              }
              this.dialog.options = options;
            } else {
              this.$message.error(JSON.stringify(data));
            }
          })
        }
      })
    },
    resetForm () {
      this.$refs.form.resetFields();
    },
    onConfirm () {
      requests.selectDB({ data: this.dialog.model }).then(({ success, data }) => {
        if (success) {
          this.$router.push({ name: 'View', params: { db: this.dialog.model } })
          window.localStorage.setItem('db', this.dialog.model)
        } else {
          this.$message.error(JSON.stringify(data));
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
