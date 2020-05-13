const sendResponse = {
  success (res, data) {
    res.end(JSON.stringify({ success: true, data }));
  },
  error (res, data) {
    if (data.message) {
      data = data.message;
    }
    res.end(JSON.stringify({ success: false, data }))
  }
}

module.exports = {
  sendResponse
}
