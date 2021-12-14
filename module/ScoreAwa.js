const { Schema } = require('mongoose')
const mongoose = require('./index')

const Schemas = new Schema({
    content: String,

    Marks: String,
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

const usermodel = mongoose.model('scoreawa', Schemas, 'scoreawa')

module.exports = usermodel