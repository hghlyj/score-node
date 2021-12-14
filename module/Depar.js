const { Schema } = require('mongoose')
const mongoose = require('./index')

const Schemas = new Schema({
    name: String,
    label: Boolean,
    createTime: {
        type: Date,
        default: Date.now
    },
    updateTime: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false,
    timestamps: { createdAt: 'create_time', updatedAt: 'update_time' }
})

const usermodel = mongoose.model('depar', Schemas, 'depar')

module.exports = usermodel