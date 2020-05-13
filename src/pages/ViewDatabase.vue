<template>
  <el-container class="view-database" style="height:100%;">
    <el-header>
      <h1>VIEW DATABASE</h1>
    </el-header>
    <el-container style="height:calc(100% - 60px);">
      <el-aside>
        <el-menu @select="selectTable" :default-active="tables[0]&&tables[0]">
          <el-submenu index="0">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span slot="title">{{db}}</span>
            </template>
            <el-menu-item v-for="(item,index) in tables" :key="item" :index="item">
              {{item}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- <el-row :gutter="10">
          <el-col :span="20">
            <el-input type="textarea" v-model="exec.sql" placeholder=""></el-input>
          </el-col>
          <el-col :span="3">
            <el-button type="primary">exec</el-button>
            <el-button>clear</el-button>
          </el-col>
        </el-row> -->
        <el-row :gutter="0" style="height:80%;">
          <el-col :span="24" style="height:100%;">
            <el-table :data="table.data" height="100%" stripe header-row-class-name="table-header" border>
              <el-table-column type="index" width="80" label="index" align="center">
              </el-table-column>
              <el-table-column :prop="col" :label="col" width="width" v-for="(col,index) in table.cols" :key="col">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="6">
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// @ is an alias to /src
import requests from '@/http/requests'

export default {
  name: 'ViewDatabase',
  created () {
    const db = this.$route.params.db || window.localStorage.getItem('db');
    if (!db) {
      this.$router.push({ name: 'Connect' })
    } else {
      this.db = db
    }
    this.fetchTables()
  },
  data () {
    return {
      db: '',
      tables: [],
      table: {
        current: '',
        cols: [],
        data: []
      },
      exec: {
        sql: ''
      }
    }
  },
  methods: {
    fetchTables () {
      requests.getTables({ data: this.db }).then(({ success, data }) => {
        if (success) {
          const tables = []
          for (let i = 0; i < data.length; i++) {
            tables.push(data[i])
          }
          this.tables = tables
          this.table.current = tables[0]
          this.getDataFromTable();
        } else {
          this.$message.error(JSON.stringify(data))
          if (data === 'database is not connected') {
            this.$router.push({ name: 'Connect' })
          }
        }
      })
    },
    getDataFromTable () {
      requests.getDataFromTable({ data: { database: this.db, table: this.table.current } }).then(({ success, data }) => {
        if (success) {
          const cols = [];
          const tableData = [];
          data[0].forEach((item) => {
            cols.push(item)
          })
          data[1].forEach((item) => {
            tableData.push(item)
          })
          this.table.cols = cols;
          this.table.data = tableData
        } else {
          this.$message.error(JSON.stringify(data))
        }
      })
    },
    selectTable (index, indexPath) {
      this.table.current = index;
      this.getDataFromTable()
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .table-header th {
  text-align: center;
}
.el-row {
  margin-bottom: 10px;
}
</style>
