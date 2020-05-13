const controller = require('./controller')

const router = (req, res) => {
  if (req.url === '/createConnect') {
    controller.createConnect(req, res)
  }
  if (req.url === '/selectDatabase') {
    controller.selectDatabase(req, res)
  }
  if (req.url === '/getTables') {
    controller.getTables(req, res)
  }
  if (req.url === '/getDataFromTable') {
    controller.getDataFromTable(req, res)
  }
}

module.exports = router;
