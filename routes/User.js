var express = require('express');
var router = express.Router();
const usermodel = require('../module/user')
const deparmodel = require('../module/Depar')

router.get('/user', async function(req, res, next) {
    const name = req.query.name
        // const name1 = new RegExp(name, 'i')
    const depar_id = req.query.depar_id
    const role = req.query.role
    const is_active = req.query.is_active
    console.log(is_active, typeof(is_active), is_active == null, is_active == '')
    let serch = {}
    const ser = [{ 'value': name, 'value1': { 'name': name } },
        { 'value': depar_id, 'value1': { 'depar_id': depar_id } },
        { 'value': role, 'value1': { 'role': role } },
        { 'value': is_active, 'value1': { 'is_active': is_active } },
    ]
    ser.forEach(item => {
        if (item.value || typeof(item.value) == 'boolean' || typeof(item.value) == 'number') {
            serch = Object.assign(item.value1, serch)
        } else {
            return;
        }
    })

    const page = req.query.page
    const pagesize = req.query.pagesize
    if ((name || depar_id || role || typeof(is_active) == 'boolean' || typeof(is_active) == 'string') && (page && pagesize)) {
        const name1 = new RegExp(name, 'i')
        serch.name = name1
        console.log('搜索', serch)
        const userlist = await usermodel.find(serch).limit(Number(pagesize)).skip((Number(page) - 1) * Number(pagesize));
        const total = await usermodel.find(serch)
        const total1 = total.length
        res.json({ 'data': userlist, 'code': 200, 'count': total1 })
    } else if ((name || depar_id || role || typeof(is_active) == 'boolean')) {
        const userlist = await usermodel.find(serch)
        const total = await usermodel.find(serch)
        const total1 = total.length
        res.json({ 'data': userlist, 'code': 200, 'count': total1 })
    } else if (page && pagesize) {
        // console.log(111, page, pagesize)
        const userlist = await usermodel.find({}).limit(Number(pagesize)).skip((Number(page) - 1) * Number(pagesize))
        const total = await usermodel.find({})
        const total1 = total.length
        res.json({ 'data': userlist, 'code': 200, 'count': total1 })
    } else {
        const userlist = await usermodel.find({})
        res.json({ 'data': userlist, 'code': 200 })
    }
});

router.post('/user', async function(req, res, next) {
    const content = req.body
    const phone = req.body.phone
    const zhanghao = req.body.zhanghao
    const userlist = await usermodel.find({})
    userlist.forEach(item => {
        if (item.zhanghao == zhanghao && item.phone == phone) {

            res.json({ 'data': '账号以及手机号存在', "status": 'No', 'code': 200 })
            return;
        } else if (item.zhanghao == zhanghao) {
            res.json({ 'data': "账号存在", "status": 'No', 'code': 200 })
            return;
        } else if (item.phone == phone) {
            res.json({ 'data': "手机号存在", "status": 'No', 'code': 200 })
            return;
        }
    })
    const createuser = await usermodel.create(content)
    res.json({ 'data': createuser, "status": 'Yes', 'code': 200 })
});

router.get('/user/:id', async function(req, res, next) {
    let userlist = await usermodel.find({ _id: req.params.id })
    let content = JSON.stringify(userlist)
    let content1 = JSON.parse(content)

    res.json({ 'data': content1, 'code': 200 })

    // content1[0].role_id.forEach((item) => {
    //     const length = content1[0].role_id.length
    //     let deparlist = await deparmodel.find({ _id: item.depar_id })
    //     console.log(deparlist[0])
    //     item.depar_id = deparlist[0]
    // })
    // if ()
    //     content1[0].lll = 444
    // content1[0].role_id[0].zxc = 789
    // console.log(content1[0])



});

router.put('/user/:id', async function(req, res, next) {
    const id = req.params.id;
    const content = req.body;
    delete content._id;
    // console.log(id, content)
    const edituser = await usermodel.updateOne({ _id: id }, { $set: content });
    res.json({ 'data': edituser, 'code': 200 });

});
router.delete('/user/:id', async function(req, res, next) {
    const id = req.params.id
    const deluser = await usermodel.deleteOne({ _id: id })
    res.json({ 'data': deluser, 'code': 200 })
});

module.exports = router;