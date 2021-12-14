const mongoose = require('mongoose')
url = "mongodb://localhost:27017/oa_system"
mongoose.connect(url, err => {
    if (err) {
        console.log('连接数据库错误', err);
    }
})

module.exports = mongoose