const { Schema } = require('mongoose')
const mongoose = require('./index')

const Schemas = new Schema({
    stu_id: Schema.Types.ObjectId,
    name: String, //姓名
    sex: Boolean,
    idcardnumber: String, //身份证
    depar: String, //学院
    cls: String, //班级
    lecturer: String, //讲师
    counsellor: String, //导员
    // anewconunt: Number, //重修次
    dormnumber: Number, //宿舍号
    bednumber: Number, //床位号
    address: String, //家庭住址
    market: String, //市场部

    state: Boolean, //违纪/加分
    disciplinetype: String, //违纪类型
    content: String, //违纪方式
    Marks: String, //分数 
    avatar: String, //图片
    data: Date, // 违纪日期
    course: String, //违纪课节
    fdyoppose: String, //反对原因     拒绝时弹窗让用户输入反对原因
    depar_id: {
        type: Schema.Types.ObjectId,
        ref: "depar"
    },
    cls_id: {
        type: Schema.Types.ObjectId,
        ref: "cls"
    },
    dcoppose: String,
    js_id: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    fdy_id: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    // opposecount: {
    //     type: Number,
    //     default: 0
    // },  //拒绝次数   两次机会否则私下解决
    createTime: {
        type: Date,
        default: Date.now
    },
    updateTime: {
        type: Date,
        default: Date.now
    },
    status: Number //状态

}, {
    versionKey: false,
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' }
})

const usermodel = mongoose.model('scorelist', Schemas, 'scorelist')

module.exports = usermodel