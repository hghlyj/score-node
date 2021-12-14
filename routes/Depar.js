var express = require('express');
var router = express.Router();
const deparmodel = require('../module/Depar')
const usermodel = require('../module/user')


router.get('/depar', async function(req, res, next) {
    const depar_id = req.query.depar_id
    const role = req.query.role
        // console.log(depar_id, role, 111)
    let serch = {}
    const ser = [{ 'value': depar_id, 'value1': { 'depar_id': depar_id } },
        { 'value': role, 'value1': { 'role': role } },
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
    if (depar_id && (page && pagesize)) {
        const name1 = new RegExp(name, 'i')
        const deparlist = await deparmodel.find({ name: name1 }).limit(Number(pagesize)).skip((Number(page) - 1) * Number(pagesize));
        const total = await deparmodel.find({ name: name1 })
        const total1 = total.length
        res.json({ 'data': deparlist, 'code': 200, 'count': total1 })
    } else if (page && pagesize) {
        const deparlist = await deparmodel.find({}).limit(Number(pagesize)).skip((Number(page) - 1) * Number(pagesize))
        const total = await deparmodel.find({})
        const total1 = total.length
        res.json({ 'data': deparlist, 'code': 200, 'count': total1 })
    } else if (depar_id || role) {
        console.log(serch)
        const userlist = await usermodel.find(serch)
        res.json({ 'data': userlist, 'code': 200 })
    } else {
        const deparlist = await deparmodel.find({})
        res.json({ 'data': deparlist, 'code': 200 })
    }
});


router.post('/depar', async function(req, res, next) {
    const content = req.body
    const name = content.name
    const deparlist = await deparmodel.find({})
    deparlist.forEach(item => {
        if (name == item.name) {
            res.json({ 'data': '该部门已存在', 'status': 'No', 'code': 200 })
        }
    })

    const createdepar = await deparmodel.create(content)
    res.json({ 'data': createdepar, 'status': 'Yes', 'code': 200 })
});

router.get('/depar/:id', async function(req, res, next) {
    const deparlist = await deparmodel.find({ _id: req.params.id })
    res.json({ 'data': deparlist, 'code': 200 })
});

router.put('/depar/:id', async function(req, res, next) {
    const id = req.params.id;
    const content = req.body;
    delete content._id;
    // console.log(id, content)
    const editdepar = await deparmodel.updateOne({ _id: id }, { $set: content })
    res.json({ 'msg': editdepar, 'code': 200 })
});

router.delete('/depar/:id', async function(req, res, next) {
    const id = req.params.id
    const deldepar = await deparmodel.deleteOne({ _id: id })
    res.json({ 'msg': deldepar, 'code': 200 })
});

module.exports = router;