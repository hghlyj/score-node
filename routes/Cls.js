var express = require('express');
const { cls } = require('jade/lib/runtime');
var router = express.Router();
const clsmodel = require('../module/Cls')
const stumodel = require('../module/Stu')
const usermodel = require('../module/user')


router.get('/cls', async function(req, res, next) {
    const name = req.query.name
    const depar_id = req.query.depar_id
    const js_id = req.query.js_id
    const fdy_id = req.query.fdy_id
    const stage = req.query.stage
    let serch = {}
    const ser = [{ 'value': name, 'value1': { 'name': name } },
        { 'value': js_id, 'value1': { 'js_id': js_id } },
        { 'value': fdy_id, 'value1': { 'fdy_id': fdy_id } },
        { 'value': depar_id, 'value1': { 'depar_id': depar_id } },
        { 'value': stage, 'value1': { 'stage': stage } },
    ]
    ser.forEach(item => {
        if (item.value) {
            serch = Object.assign(item.value1, serch)
        } else {
            return;
        }
    })
    const page = req.query.page
    const pagesize = req.query.pagesize
    if ((name || js_id || fdy_id || depar_id || stage) && (page && pagesize)) {
        const name1 = new RegExp(name, 'i')
        serch.name = name1
        console.log('搜索', serch)
        const clslist = await clsmodel.find(serch).populate("depar_id").populate("js_id").populate("fdy_id").limit(Number(pagesize)).skip((Number(page) - 1) * Number(pagesize));
        const total = await clsmodel.find(serch)
        let stuas = []
        clslist.forEach((item) => {
            const stucount = stumodel.find({ cls_id: item._id })
            stuas.push(stucount)
        })
        Promise.all(stuas).then(ress => {
            ress.forEach((item, index) => {
                const sad = JSON.stringify(clslist[index])
                const sad1 = JSON.parse(sad)
                sad1.stucount = item.length
                clslist[index] = sad1
            })
            const total1 = total.length
            res.json({ 'data': clslist, 'code': 200, 'count': total1 })
        })
    } else if (page && pagesize) {
        const clslist = await clsmodel.find({}).populate("depar_id").populate("js_id").populate("fdy_id").limit(Number(pagesize)).skip((Number(page) - 1) * Number(pagesize))
        const total = await clsmodel.find({})
        let stuas = []
        clslist.forEach((item) => {
            const stucount = stumodel.find({ cls_id: item._id })
            stuas.push(stucount)
        })
        Promise.all(stuas).then(ress => {
            ress.forEach((item, index) => {
                const sad = JSON.stringify(clslist[index])
                const sad1 = JSON.parse(sad)
                sad1.stucount = item.length
                clslist[index] = sad1
            })
            const total1 = total.length
            res.json({ 'data': clslist, 'code': 200, 'count': total1 })
        })

    } else {
        await clsmodel.find({}).populate("depar_id").exec(function(err, data) {
            if (err) {
                console.log(err)
            } else {
                res.json({ 'data': data, 'code': 200 });
            }
        });



        // clsmodel.aggregate([{
        //         $lookup: {
        //             from: "depar",
        //             localField: "depar_id",
        //             foreignField: "_id",
        //             as: "depar"
        //         }
        //     },
        //     // {
        //     //     $lookup: {
        //     //         from: "author",
        //     //         localField: "author_id",
        //     //         foreignField: "_id",
        //     //         as: "author"
        //     //     }
        //     // }

        // ], function(err, data) {
        //     if (!err) {
        //         res.json({ "list": data })
        //     }
        // })
        // const clslist = await clsmodel.find({}).exec(function(err, data) {
        //     if (err) {
        //         console.log(err)
        //     } else {
        //         res.json({ 'data': data, 'code': 200 });
        //     }
        // })

    }
});

router.get('/dy-js', async function(req, res, next) {
    const id = req.query.id
    const clslist = await clsmodel.find({ fdy_id: id })
    let allclslist = []
    let alljsuser = []
    clslist.forEach(item => {
        const userlist = usermodel.find({ _id: item.js_id, role: '讲师' })
        if (userlist) {
            allclslist.push(userlist)
        }
    })
    Promise.all(allclslist).then(ress => {
        ress.forEach(item => {
            item.forEach(item2 => {
                alljsuser.push(item2)
            })
        })
        res.json({ 'data': alljsuser, 'code': 200 })
    })

});

router.get('/dy-bj', async function(req, res, next) {
    const id = req.query.id
    const clslist = await clsmodel.find({ fdy_id: id })
    res.json({ 'data': clslist, 'code': 200 })

});

router.get('/depar-cls', async function(req, res, next) {
    id = req.query.id
    const clslist = await clsmodel.find({ depar_id: id })
    res.json({ 'data': clslist, 'code': 200 })
});

router.get('/cls/:id', async function(req, res, next) {
    const clslist = await clsmodel.find({ _id: req.params.id })
    res.json({ 'data': clslist, 'code': 200 })
});

router.post('/cls', async function(req, res, next) {
    const content = req.body
    const name = content.name
    const stage = content.stage
    const depar_id = content.depar_id
    const clslist = await clsmodel.find({}).populate("depar_id")
    clslist.forEach(item => {
        if (item.depar_id._id == depar_id && item.stage == stage && item.name == name) {
            console.log(item.depar_id)
            res.json({ 'data': item.depar_id.name + '学院' + stage + '阶段' + name + '班级存在', 'status': 'No', 'code': 200 })
            return;
        }
    })
    const createcls = await clsmodel.create(content)
    res.json({ 'data': createcls, 'status': 'Yes', 'code': 200 })
});

router.put('/cls/:id', async function(req, res, next) {
    const id = req.params.id;
    const content = req.body;
    delete content._id;
    const editcls = await clsmodel.updateOne({ _id: id }, { $set: content })
    res.json({ 'data': editcls, 'code': 200 })
});

router.delete('/cls/:id', async function(req, res, next) {
    const id = req.params.id
    const delcls = await clsmodel.deleteOne({ _id: id })
    res.json({ 'data': delcls, 'code': 200 })
});

module.exports = router;