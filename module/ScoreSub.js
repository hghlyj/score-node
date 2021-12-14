const { Schema } = require('mongoose')
const mongoose = require('./index')

const Schemas = new Schema({
    Disciplinetype: String,
    content: String,
    Marks: String,
    expel: Boolean,
    remark: String,
    createTime: {
        type: Date,
        default: Date.now
    },
    updateTime: {
        type: Date,
        default: Date.now
    },
}, {
    versionKey: false,
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' }
})

const usermodel = mongoose.model('scoresub', Schemas, 'scoresub')

module.exports = usermodel