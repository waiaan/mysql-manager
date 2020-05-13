const db = require('./db');
const { sendResponse } = require('./utils');

const collectBodyData = req => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk });
    req.on('end', () => {
      resolve(body)
    })
  })
}

const controller = {
  createConnect (req, res) {
    collectBodyData(req).then(async (data) => {
      if (!db.pool) {
        try {
          db.createPool(Object.assign({}, JSON.parse(data), { multipleStatements: true }));
        } catch (error) {
          sendResponse.error(res, error);
          return;
        }
      }
      db.query('show databases', res)
    })
  },
  selectDatabase (req, res) {
    collectBodyData(req).then(async (data) => {
      const sql = `use ${data}`;
      db.query(sql, res)
    })
  },
  getTables (req, res) {
    collectBodyData(req).then((data) => {
      const sql = `use ${data};show tables;`;
      db.query(sql, res, (results) => {
        console.log(results);
        const _res = [];
        for (let i = 0; i < results[1].length; i++) {
          const _item = results[1][i];
          for (const k in _item) {
            _res.push(_item[k])
          }
        }
        return _res;
      })
    })
  },
  getDataFromTable (req, res) {
    collectBodyData(req).then((data) => {
      const { database, table } = JSON.parse(data);
      const sql = `use ${database};show full columns from ${table};select * from ${table};`;
      db.query(sql, res, (results) => {
        const _cols = results[1];
        const cols = [];
        for (let i = 0; i < _cols.length; i++) {
          cols.push(_cols[i].Field)
        }
        return [cols, results[2]]
      });
    })
  }
}

module.exports = controller
