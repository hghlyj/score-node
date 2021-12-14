const { Schema } = require('mongoose')
const mongoose = require('./index')

const Schemas = new Schema({
    role_name: String,
    level: Number,
    duty: String,
    label: Boolean, //是否是学院
    depar_id: {
        type: Schema.Types.ObjectId,
        ref: "depar"
    },
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

const usermodel = mongoose.model('role', Schemas, 'role')

module.exports = usermodel