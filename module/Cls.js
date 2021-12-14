const { Schema } = require('mongoose')
const mongoose = require('./index')

const Schemas = new Schema({
    name: String,
    stage: String,
    depar_id: {
        type: Schema.Types.ObjectId,
        ref: "depar"
    },
    js_id: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    fdy_id: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    // depar_id: Schema.Types.ObjectId,
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

const usermodel = mongoose.model('cls', Schemas, 'cls')

module.exports = usermodel