var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// const multer = require('multer')({ dest: 'public/excel-file' })
const mul = require('multer')({ dest: 'public/excel-file/' })
const fs = require('fs')
const node_xlsx = require('node-xlsx');
const cors = require('cors')
const stumodel = require('./module/Stu')
const DeparRouter = require('./routes/Depar');
const RoleRouter = require('./routes/Role');
const UserRouter = require('./routes/user');
const ClsRouter = require('./routes/Cls');
const StuRouter = require('./routes/Stu');
const ScoreAwaRouter = require('./routes/ScoreAwa');
const ScoreSubRouter = require('./routes/ScoreSub');
const ScoreListRouter = require('./routes/ScoreList');


var app = express();
const jwt = require('express-jwt')
const webjwt = require('jsonwebtoken')
const usermodel = require('./module/user')
const miyao = 'hghlyj'
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(jwt({ secret: miyao, 'algorithms': ['HS256'] }).unless({ path: '/login' }))

app.use(cors());




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



app.post('/login', async(req, res) => {
    const { zhanghao, pass } = req.body
    let user = {}
    console.log()
    const userslist = await usermodel.find()
        //用户是否存在
    let userflag = false
    let id = null
    userslist.forEach(item => {
        if (item.zhanghao == zhanghao) {
            userflag = true
            user = item
            id = item._id
        }
    })
    if (userflag == false) {
        res.json({ 'msg': '用户不存在', 'status': "No", 'code': 200 })
    } else {
        if (user.is_active) {
            if (user.pass == pass) {
                res.json({ 'msg': '登录成功', 'status': "Yes", 'code': 200, 'id': id, 'token': webjwt.sign({ 'user': zhanghao, 'data': 'hgh' }, miyao, { expiresIn: 60 * 60 * 1000 }) })
            } else {
                res.json({ 'msg': '密码错误', 'status': "No", 'code': 200 })
            }
        } else {
            res.json({ 'msg': '该账号没有登录权限', 'status': "No", 'code': 200 })
        }

    }
})



//下载excel模板
app.get('/download_excel_stu', (req, res) => {
    res.json({ 'qwe': 'qwe' })
})

app.post('/upload_excel_stu', mul.single('stufile'), async(req, res) => {
    const ur = req.file.path;
    const ext = path.extname(req.file.originalname);
    const name = ur + ext
    fs.rename(ur, name, (err) => {
        if (!err) {
            console.log('上传文件成功')
        } else {
            console.log('上传文件失败', err)
        }
    });

    const stulist = await stumodel.find({})
    let idcardnumberlist = []
    let phonelist = []
    let family_phonelist = []
    stulist.forEach(item => {
        idcardnumberlist.push(item.idcardnumber)
        phonelist.push(item.phone)
        family_phonelist.push(item.family_phone)
    })

    let sheetall = node_xlsx.parse(name);
    const depar_id = req.body.depar_id
    const cls_id = req.body.cls_id
    const head = [
        'name',
        'sex',
        'idcardnumber',
        'phone',
        'family_phone',
        'relations',
        'address',
        'anewconunt',
        'score',
        'dormnumber',
        'bednumber',
        'market',
        'depar_id',
        'cls_id'
    ]
    const content = []
    const cuocontent = []
    let flag = true
    sheetall.forEach(item => {
        // console.log('sheet', item)
        if (item.data.length == 0) {
            console.log(item.name, "空")
        } else {
            item.data.forEach((item2, index2) => {
                // console.log(item2, index2)
                const objone = {}
                if (index2 == 0) {
                    return;
                } else {
                    item2.forEach((item3, index3) => {
                        const header = head[index3]
                        if (header == 'depar_id') {
                            objone[header] = depar_id
                        } else if (header == 'cls_id') {
                            objone[header] = cls_id
                        } else {
                            objone[header] = item3
                        }
                        // objone[header] = item3
                    })

                    if (idcardnumberlist.indexOf(String(objone.idcardnumber)) != -1 && phonelist.indexOf(objone.phone) != -1 && family_phonelist.indexOf(objone.family_phone)) {
                        const obj = {}
                        obj[objone.name] = '身份证,本人与家长手机号存在'
                        cuocontent.push(obj)
                        flag = false
                    } else if (idcardnumberlist.indexOf(String(objone.idcardnumber)) != -1 && phonelist.indexOf(objone.phone) != -1) {
                        const obj = {}
                        obj[objone.name] = '身份证,本人存在'
                        cuocontent.push(obj)
                        flag = false
                    } else if (idcardnumberlist.indexOf(String(objone.idcardnumber)) != -1 && family_phonelist.indexOf(objone.phone) != -1) {
                        const obj = {}
                        obj[objone.name] = '身份证,本人在家长存在'
                        cuocontent.push(obj)
                        flag = false
                    } else if (idcardnumberlist.indexOf(String(objone.idcardnumber)) != -1 && family_phonelist.indexOf(objone.family_phone) != -1) {
                        const obj = {}
                        obj[objone.name] = '身份证,家长存在'
                        cuocontent.push(obj)
                        flag = false
                    } else if (idcardnumberlist.indexOf(String(objone.idcardnumber)) != -1 && phonelist.indexOf(objone.family_phone) != -1) {
                        const obj = {}
                        obj[objone.name] = '身份证,家长在本人存在'
                        cuocontent.push(obj)
                        flag = false
                    } else if (idcardnumberlist.indexOf(String(objone.idcardnumber)) != -1) {
                        const obj = {}
                        obj[objone.name] = '身份证存在'
                        cuocontent.push(obj)
                        flag = false
                    } else if (phonelist.indexOf(objone.phone) != -1) {
                        const obj = {}
                        obj[objone.name] = '本人手机号存在'
                        cuocontent.push(obj)
                        flag = false
                    } else if (family_phonelist.indexOf(objone.phone) != -1) {
                        const obj = {}
                        obj[objone.name] = '本人手机号在家长存在'
                        cuocontent.push(obj)
                        flag = false
                    } else if (family_phonelist.indexOf(objone.family_phone) != -1) {
                        const obj = {}
                        obj[objone.name] = '家长手机号存在'
                        cuocontent.push(obj)
                        flag = false
                    } else if (phonelist.indexOf(objone.family_phone) != -1) {
                        const obj = {}
                        obj[objone.name] = '家长手机号在本人存在'
                        cuocontent.push(obj)
                        flag = false
                    } else {
                        content.push(objone)
                    }

                }

            })
        }
    })
    if (flag) {
        const createstu = await stumodel.create(content)
        res.json({ 'data': createstu, 'status': 'Yes', 'code': 200 })
    } else {
        res.json({ 'data': cuocontent, 'status': 'No', 'code': 200 })
    }

})
app.use('/', DeparRouter)
app.use('/', RoleRouter)
app.use('/', UserRouter)
app.use('/', ClsRouter)
app.use('/', StuRouter)
app.use('/', ScoreAwaRouter)
app.use('/', ScoreSubRouter)
app.use('/', ScoreListRouter)

app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;