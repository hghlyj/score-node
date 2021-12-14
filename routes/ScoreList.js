var express = require('express');
var router = express.Router();
const awamulter = require('multer')({ dest: 'public/images/awafile' })
const submulter = require('multer')({ dest: 'public/images/subfile' })
const fs = require('fs')
const path = require('path')
const scorelistmodel = require('../module/ScoreList')
const clsmodel = require('../module/Cls')
const stumodel = require('../module/Stu')

router.get('/list', async function(req, res, next) {
    const name = req.query.name
    const depar = req.query.depar
    const cls = req.query.cls
    const lecturer = req.query.lecturer
    const counsellor = req.query.counsellor
    const market = req.query.market
    let state = req.query.state
    let status = req.query.status
    const fdzoppose = req.query.fdzoppose
    const js_id = req.query.js_id
    const fdy_id = req.query.fdy_id
    const depar_id = req.query.depar_id
    const cls_id = req.query.cls_id
    let sex = req.query.sex
    const dormnumber = req.query.dormnumber
    const disciplinetype = req.query.disciplinetype
    const content = req.query.content
    const data = req.query.data
    if (state) {
        state = Number(state)
    }
    if (status) {
        status = Number(status)
    }
    if (sex) {
        sex = Number(sex)
    }
    let serch = {}
    const ser = [{ 'value': name, 'value1': { 'name': name } },
        { 'value': state, 'value1': { 'state': state } },
        { 'value': status, 'value1': { 'status': status } },
        // { 'value': opposecount, 'value1': { 'opposecount': opposecount } },
        { 'value': fdzoppose, 'value1': { 'fdzoppose': fdzoppose } },
        // { 'value': depar, 'value1': { 'depar': depar } },
        // { 'value': cls, 'value1': { 'cls': cls } },
        // { 'value': lecturer, 'value1': { 'lecturer': lecturer } },
        // { 'value': counsellor, 'value1': { 'counsellor': counsellor } },
        { 'value': market, 'value1': { 'market': market } },
        { 'value': js_id, 'value1': { 'js_id': js_id } },
        { 'value': fdy_id, 'value1': { 'fdy_id': fdy_id } },
        { 'value': depar_id, 'value1': { 'depar_id': depar_id } },
        { 'value': cls_id, 'value1': { 'cls_id': cls_id } },
        { 'value': sex, 'value1': { 'sex': sex } },
        { 'value': dormnumber, 'value1': { 'dormnumber': dormnumber } },
        { 'value': disciplinetype, 'value1': { 'disciplinetype': disciplinetype } },
        { 'value': content, 'value1': { 'content': content } },
        { 'value': data, 'value1': { 'data': data } },
    ]
    ser.forEach(item => {
        if ((item.value || typeof(item.value) == 'number')) {
            serch = Object.assign(item.value1, serch)
        }
    })
    const name1 = new RegExp(name, 'i')
    serch.name = name1
    const market1 = new RegExp(market, 'i')
    serch.market = market1
    const page = req.query.page
    const pagesize = req.query.pagesize;
    // 通过讲师/导员id找到对应班级获取学生         也可以通过讲师/导员id获取学生   
    if (js_id) {
        console.log('讲师', js_id)
        const clslist = await clsmodel.find({ js_id: js_id })
        let allscorelist = []
        clslist.forEach((item) => {
            delete serch.js_id
            if (serch.cls_id) {
                delete serch.cls_id
            }
            serch = Object.assign({ cls_id: item._id }, serch)
            const scorelistlist = scorelistmodel.find(serch).populate({ path: "cls_id", populate: { path: 'js_id fdy_id' } }).populate("depar_id").limit(Number(pagesize)).skip((Number(page) - 1) * Number(pagesize));
            allscorelist.push(scorelistlist)

        });
        // console.log(235, allstu)
        Promise.all(allscorelist).then(ress => {
            const arr = []
            ress.forEach(item => {
                item.forEach(item2 => {
                    arr.push(item2)
                })
            })
            const total1 = arr.length
            res.json({ 'data': arr, 'code': 200, 'count': total1 })

        })
        return;
    }
    if (fdy_id) {
        console.log('导员', fdy_id)
        const clslist = await clsmodel.find({ fdy_id: fdy_id })
        let scorestu = []
        clslist.forEach((item) => {
            delete serch.fdy_id
            if (serch.cls_id) {
                delete serch.cls_id
            }
            serch = Object.assign({ cls_id: item._id }, serch)
            console.log(serch, 123)
            const scorelist = scorelistmodel.find(serch).populate({ path: "cls_id", populate: { path: 'js_id fdy_id' } }).populate("depar_id").limit(Number(pagesize)).skip((Number(page) - 1) * Number(pagesize));
            scorestu.push(scorelist)

        });
        // console.log(235, allstu)
        Promise.all(scorestu).then(ress => {
            const arr = []
            ress.forEach(item => {
                item.forEach(item2 => {
                    arr.push(item2)
                })
            })
            const total1 = arr.length
            res.json({ 'data': arr, 'code': 200, 'count': total1 })

        })
        return;

    }
    if ((data || content || disciplinetype || dormnumber || cls_id || typeof(sex) == 'number' || name || typeof(state) == 'number' || fdzoppose || depar || cls || lecturer || counsellor || market || depar_id || js_id || fdy_id) && (page && pagesize)) {
        // serch.status = Number(serch.status)
        console.log('搜索', serch)
        const listlist = await scorelistmodel.find(serch).sort({ 'data': -1 }).limit(Number(pagesize)).skip((Number(page) - 1) * Number(pagesize));
        // const total = await scorelistmodel.find()
        const total = await scorelistmodel.find(serch)
        const total1 = total.length
        res.json({ 'data': listlist, 'code': 200, 'count': total1 })
    } else if (name || typeof(state) == 'boolean') {
        console.log(4)
    } else if (page && pagesize) {
        const listlist = await scorelistmodel.find({}).limit(Number(pagesize)).skip((Number(page) - 1) * Number(pagesize))
        const total = await scorelistmodel.find({})
        const total1 = total.length
        res.json({ 'data': listlist, 'code': 200, 'count': total1 })
    } else {
        await scorelistmodel.find({}).exec(function(err, data) {
            if (err) {
                console.log(err)
            } else {
                res.json({ 'data': data, 'code': 200 });
            }
        });

    }
});

router.get('/list/:id', async function(req, res, next) {
    const listlist = await scorelistmodel.find({ stu_id: req.params.id }).sort({ 'data': -1 })
    res.json({ 'data': listlist, 'code': 200 })
});

router.post('/list-awafile', awamulter.single('awafile'), async function(req, res, next) {
    const content = req.body
    const awafile = req.file
    console.log(awafile, content)
    const awafilepath = req.file.path
    const awafileext = path.extname(req.file.originalname)
    const fileurl = path.join(__dirname, '../public/images/awafile/' + req.body.idcardnumber + awafileext)
    console.log(fileurl)
    fs.renameSync(awafilepath, fileurl, (err) => {
        if (!err) {
            console.log('123')
        }
    })
    const avatarurl = path.join('static/images/awafile/' + req.body.idcardnumber + awafileext)
    content.avatar = avatarurl

    const createlist = await scorelistmodel.create(content)
    res.json({ 'data': createlist, 'code': 200 })
});

router.post('/list-subfile', submulter.single('subfile'), async function(req, res, next) {
    const content = req.body
    const subfile = req.file
    console.log(subfile, content)
    const subfilepath = req.file.path
    const subfileext = path.extname(req.file.originalname)
    const fileurl = path.join(__dirname, '../public/images/subfile/' + req.body.idcardnumber + subfileext)
    console.log(fileurl)
    fs.renameSync(subfilepath, fileurl, (err) => {
        if (!err) {
            console.log('123')
        }
    })
    const avatarurl = path.join('static/images/subfile/' + req.body.idcardnumber + subfileext)
    content.avatar = avatarurl

    const createlist = await scorelistmodel.create(content)
    res.json({ 'data': createlist, 'code': 200 })
});

router.post('/list', async function(req, res, next) {
    const content = req.body
    const createlist = await scorelistmodel.create(content)
    res.json({ 'data': createlist, 'code': 200 })
});

router.put('/list/:id', async function(req, res, next) {
    const id = req.params.id;
    const content = req.body;
    const status = content.status
    console.log(content)
    if (status == 1) {
        const scorelistone = await scorelistmodel.find({ _id: id })
        const stu_id = scorelistone[0].stu_id
        const state = scorelistone[0].state
        let Marks = 0
        if (state) {
            Marks += Number(scorelistone[0].Marks)
        } else {
            Marks -= Number(scorelistone[0].Marks)
        }

        const stulistone = await stumodel.find({ _id: stu_id })
        console.log(stulistone, 1111)
        await stumodel.updateOne({ _id: stu_id }, { $inc: { score: Marks } })
        const stulistone2 = await stumodel.find({ _id: stu_id })
    }
    if (content._id) {
        delete content._id;
    }
    const editlist = await scorelistmodel.updateOne({ _id: id }, { $set: content })
    res.json({ 'data': editlist, 'code': 200 })
});

router.delete('/list/:id', async function(req, res, next) {
    const id = req.params.id
    const scorelistone = await scorelistmodel.find({ _id: id })
    const states = scorelistone[0].states
    if (states == 1) {
        const stu_id = scorelistone[0].stu_id
        const state = scorelistone[0].state
        let Marks = 0
        if (state) {
            Marks -= Number(scorelistone[0].Marks)
        } else {
            Marks += Number(scorelistone[0].Marks)
        }

        const stulistone = await stumodel.find({ _id: stu_id })
        console.log(stulistone, 1111)
        await stumodel.updateOne({ _id: stu_id }, { $inc: { score: Marks } })
        const stulistone2 = await stumodel.find({ _id: stu_id })
    }



    const dellist = await scorelistmodel.deleteOne({ _id: id })
    res.json({ 'data': dellist, 'code': 200 })
});

module.exports = router;