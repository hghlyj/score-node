var express = require('express');
var router = express.Router();
const stumodel = require('../module/Stu')
const clsmodel = require('../module/Cls')

router.get('/stu', async function(req, res, next) {
    const name = req.query.name
        // const name1 = new RegExp(name, 'i')
    const market = req.query.market
    const depar_id = req.query.depar_id
    const cls_id = req.query.cls_id
    const dormnumber = req.query.dormnumber
    const sex = req.query.sex
    const js_id = req.query.js_id
    const fdy_id = req.query.fdy_id
    let serch = {}
    const ser = [{ 'value': name, 'value1': { 'name': name } },
        { 'value': market, 'value1': { 'market': market } },
        { 'value': depar_id, 'value1': { 'depar_id': depar_id } },
        { 'value': cls_id, 'value1': { 'cls_id': cls_id } },
        { 'value': dormnumber, 'value1': { 'dormnumber': dormnumber } },
        { 'value': sex, 'value1': { 'sex': sex } },
        { 'value': js_id, 'value1': { 'js_id': js_id } },
        { 'value': fdy_id, 'value1': { 'fdy_id': fdy_id } },
    ]
    ser.forEach(item => {
        if (item.value) {
            serch = Object.assign(item.value1, serch)
        } else {
            return;
        }
    })
    const name1 = new RegExp(name, 'i')
    serch.name = name1
    const market1 = new RegExp(market, 'i')
    serch.market = market1
    const page = req.query.page
    const pagesize = req.query.pagesize
    if (js_id) {
        console.log('讲师', js_id)
        const clslist = await clsmodel.find({ js_id: js_id })
        let allstu = []
        clslist.forEach((item) => {
            delete serch.js_id
            if (serch.cls_id) {
                delete serch.cls_id
            }
            serch = Object.assign({ cls_id: item._id }, serch)
            const stulist = stumodel.find(serch).populate({ path: "cls_id", populate: { path: 'js_id fdy_id' } }).populate("depar_id").limit(Number(pagesize)).skip((Number(page) - 1) * Number(pagesize));
            allstu.push(stulist)

        });
        // console.log(235, allstu)
        Promise.all(allstu).then(ress => {
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
        let allstu = []
        clslist.forEach((item) => {
            delete serch.fdy_id
            if (serch.cls_id) {
                delete serch.cls_id
            }
            serch = Object.assign({ cls_id: item._id }, serch)
            console.log(serch, 123)
            const stulist = stumodel.find(serch).populate({ path: "cls_id", populate: { path: 'js_id fdy_id' } }).populate("depar_id").limit(Number(pagesize)).skip((Number(page) - 1) * Number(pagesize));
            allstu.push(stulist)

        });
        // console.log(235, allstu)
        Promise.all(allstu).then(ress => {
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
    if ((name || market || depar_id || cls_id || dormnumber || sex) && (page && pagesize)) {
        console.log('搜索', serch)
        const stulist = await stumodel.find(serch).populate({ path: "cls_id", populate: { path: 'js_id fdy_id' } }).populate("depar_id").limit(Number(pagesize)).skip((Number(page) - 1) * Number(pagesize));
        const total = await stumodel.find(serch)
        const total1 = total.length
        res.json({ 'data': stulist, 'code': 200, 'count': total1 })
    } else if (name || market || depar_id || cls_id || dormnumber || sex) {
        const name1 = new RegExp(name, 'i')
        serch.name = name1
        const market1 = new RegExp(market, 'i')
        serch.market = market1
        console.log('搜索', serch)
        const stulist = await stumodel.find(serch).populate({ path: "cls_id", populate: { path: 'js_id fdy_id' } }).populate("depar_id")
        const total = await stumodel.find(serch)
        const total1 = total.length
        res.json({ 'data': stulist, 'code': 200, 'count': total1 })
    } else if (page && pagesize) {
        const stulist = await stumodel.find({}).populate({ path: "cls_id", populate: { path: 'js_id fdy_id' } }).populate("depar_id").limit(Number(pagesize)).skip((Number(page) - 1) * Number(pagesize))
        const total = await stumodel.find({})
        const total1 = total.length
        res.json({ 'data': stulist, 'code': 200, 'count': total1 })
    } else {
        const stulist = await stumodel.find({}).populate({ path: "cls_id", populate: { path: 'js_id fdy_id' } }).populate("depar_id")
        res.json({ 'data': stulist, 'code': 200 })
    }
});

router.get('/stu/:id', async function(req, res, next) {
    const stulist = await stumodel.find({ _id: req.params.id })
    res.json({ 'data': stulist, 'code': 200 })
});

router.post('/stu', async function(req, res, next) {
    const content = req.body
    const idcardnumber = content.idcardnumber
    const phone = content.phone
    const family_phone = content.family_phone

    const stulist = await stumodel.find({})
    stulist.forEach(item => {

        if (item.idcardnumber == idcardnumber && item.phone == phone && item.family_phone == family_phone) {
            res.json({ 'data': '身份证,本人~家长手机号存在', 'status': 'No', 'code': 200 })
            return;
        } else if (item.idcardnumber == idcardnumber && item.phone == phone) {
            res.json({ 'data': '身份证,学生手机号存在', 'status': 'No', 'code': 200 })
            return;
        } else if (item.idcardnumber == idcardnumber && item.family_phone == phone) {
            res.json({ 'data': '身份证,学生手机号在家长中存在', 'status': 'No', 'code': 200 })
            return;
        } else if (item.idcardnumber == idcardnumber && item.family_phone == family_phone) {
            res.json({ 'data': '身份证,家长手机号存在', 'status': 'No', 'code': 200 })
            return;
        } else if (item.idcardnumber == idcardnumber && item.phone == family_phone) {
            res.json({ 'data': '身份证,家长手机号在学生中存在', 'status': 'No', 'code': 200 })
            return;
        } else if (item.idcardnumber == idcardnumber) {
            res.json({ 'data': '身份证存在', 'status': 'No', 'code': 200 })
            return;
        } else if (item.phone == phone && item.family_phone == family_phone) {
            res.json({ 'data': '本人~家长手机号存在', 'status': 'No', 'code': 200 })
            return;
        } else if (item.phone == phone) {
            res.json({ 'data': '学生手机号存在', 'status': 'No', 'code': 200 })
            return;
        } else if (item.family_phone == phone) {
            res.json({ 'data': '学生手机号在家长存在', 'status': 'No', 'code': 200 })
            return;
        } else if (item.family_phone == family_phone) {
            res.json({ 'data': '家长手机号存在', 'status': 'No', 'code': 200 })
            return;
        } else if (item.phone == family_phone) {
            res.json({ 'data': '家长手机号在学生存在', 'status': 'No', 'code': 200 })
            return;
        }
    })

    const createstu = await stumodel.create(content)
    res.json({ 'data': createstu, 'status': 'Yes', 'code': 200 })
});

router.put('/stu/:id', async function(req, res, next) {
    const id = req.params.id;
    const content = req.body;
    delete content._id;
    const editstu = await stumodel.updateOne({ _id: id }, { $set: content })
    res.json({ 'data': editstu, 'code': 200 })
});

router.delete('/stu/:id', async function(req, res, next) {
    const id = req.params.id
    const delstu = await stumodel.deleteOne({ _id: id })
    res.json({ 'data': delstu, 'code': 200 })
});

module.exports = router;