var express = require('express');
var router = express.Router();
const scoreawamodel = require('../module/ScoreAwa')

router.get('/awa', async function(req, res, next) {
    const content = req.query.content
    let serch = {}
    const ser = [{ 'value': content, 'value1': { 'content': content } }, ]
    ser.forEach(item => {
        if (item.value) {
            serch = Object.assign(item.value1, serch)
        } else {
            return;
        }
    })
    const page = req.query.page
    const pagesize = req.query.pagesize
    if (content && (page && pagesize)) {
        const content1 = new RegExp(content, 'i')
        serch.content = content1
        console.log('搜索', serch)
        const awalist = await scoreawamodel.find(serch).limit(Number(pagesize)).skip((Number(page) - 1) * Number(pagesize));
        const total = await scoreawamodel.find(serch)
        const total1 = total.length
        res.json({ 'data': awalist, 'code': 200, 'count': total1 })
    } else if (page && pagesize) {
        const awalist = await scoreawamodel.find({}).limit(Number(pagesize)).skip((Number(page) - 1) * Number(pagesize))
        const total = await scoreawamodel.find({})
        const total1 = total.length
        res.json({ 'data': awalist, 'code': 200, 'count': total1 })
    } else {
        await scoreawamodel.find({}).exec(function(err, data) {
            if (err) {
                console.log(err)
            } else {
                res.json({ 'data': data, 'code': 200 });
            }
        });

    }
});

router.get('/awa/:id', async function(req, res, next) {
    const awalist = await scoreawamodel.find({ _id: req.params.id })
    res.json({ 'data': awalist, 'code': 200 })
});

router.post('/awa', async function(req, res, next) {
    const content = req.body
    const createawa = await scoreawamodel.create(content)
    res.json({ 'data': createawa, 'code': 200 })
});

router.put('/awa/:id', async function(req, res, next) {
    const id = req.params.id;
    const content = req.body;
    delete content._id;
    // console.log(id, content)
    const editawa = await scoreawamodel.updateOne({ _id: id }, { $set: content })
    res.json({ 'data': editawa, 'code': 200 })
});

router.delete('/awa/:id', async function(req, res, next) {
    const id = req.params.id
    const delawa = await scoreawamodel.deleteOne({ _id: id })
    res.json({ 'data': delawa, 'code': 200 })
});

module.exports = router;