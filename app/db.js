const mysql = require('mysql');
const { sendResponse } = require('./utils')

const db = {
  pool: null,
  createPool (obj) {
    this.pool = mysql.createPool(obj);
  },
  query (sql, res, cb) {
    if (!this.pool) {
      sendResponse.error(res, new Error('database is not connected'));
    } else {
      this.pool.query(sql, (err, results, fields) => {
        if (err) {
          sendResponse.error(res, err);
        } else {
          if (cb) {
            results = cb(results, fields)
          }
          sendResponse.success(res, results)
        }
      })
    }
    // return new Promise((resolve, reject) => {

    // })
  }
}

module.exports = db
