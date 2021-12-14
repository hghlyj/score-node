const { Schema } = require('mongoose')
const mongoose = require('./index')

const Schemas = new Schema({
    name: String, //姓名
    sex: Boolean, //性别
    idcardnumber: String, //身份证
    phone: Number, //手机号
    family_phone: Number, //家长手机号
    relations: String, // 关系
    address: String, //家庭住址
    anewconunt: Number, //重修次
    score: Number, //综合计分
    dormnumber: Number, //宿舍号
    bednumber: Number, //床位号
    market: String, //市场部
    depar_id: {
        type: Schema.Types.ObjectId,
        ref: "depar"
    }, //学院ID
    cls_id: {
        type: Schema.Types.ObjectId,
        ref: "cls"
    }, //班级ID
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

const usermodel = mongoose.model('stu', Schemas, 'stu')

module.exports = usermodel