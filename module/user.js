const { type } = require('express/lib/response')
const { Schema } = require('mongoose')
const mongoose = require('./index')

const Schemas = new Schema({
    avatar: String, //头像
    zhanghao: String, //账号
    pass: String, //密码
    first_name: String, //姓
    last_name: String, //名
    name: String, //姓名
    email: String, //邮箱
    phone: Number, //手机号
    is_active: Boolean, //是否可以登录
    depar_id: {
        type: Schema.Types.ObjectId,
        ref: "depar"
    }, //角色
    // role_id: [{
    //     type: Schema.Types.ObjectId,
    //     ref: "role"
    // }], //角色
    role: String, //创建时间   最后一次登录时间
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

const usermodel = mongoose.model('users', Schemas)

module.exports = usermodel