var express = require('express');
var router = express.Router();
const scoresubmodel = require('../module/ScoreSub')

router.get('/sub', async function(req, res, next) {
    const content = req.query.content
    const expel = req.query.expel
    const Disciplinetype = req.query.Disciplinetype
    let serch = {}
    const ser = [{ 'value': content, 'value1': { 'content': content } },
        { 'value': expel, 'value1': { 'expel': expel } },
        { 'value': Disciplinetype, 'value1': { 'Disciplinetype': Disciplinetype } },
    ]
    ser.forEach(item => {
        if (item.value || typeof(item.value) == 'string') {
            serch = Object.assign(item.value1, serch)
        } else {
            return;
        }
    })
    const page = req.query.page
    const pagesize = req.query.pagesize
    if ((content || Disciplinetype || typeof(expel) == 'string') && (page && pagesize)) {
        const content1 = new RegExp(content, 'i')
        serch.content = content1
        console.log('搜索', serch)
        const sublist = await scoresubmodel.find(serch).limit(Number(pagesize)).skip((Number(page) - 1) * Number(pagesize));
        const total = await scoresubmodel.find(serch)
        const total1 = total.length
        res.json({ 'data': sublist, 'code': 200, 'count': total1 })
    } else if (page && pagesize) {
        const sublist = await scoresubmodel.find({}).limit(Number(pagesize)).skip((Number(page) - 1) * Number(pagesize))
        const total = await scoresubmodel.find({})
        const total1 = total.length
        res.json({ 'data': sublist, 'code': 200, 'count': total1 })
    } else {
        await scoresubmodel.find({}).exec(function(err, data) {
            if (err) {
                console.log(err)
            } else {
                res.json({ 'data': data, 'code': 200 });
            }
        });

    }
});

router.get('/sub/:id', async function(req, res, next) {
    const sublist = await scoresubmodel.find({ _id: req.params.id })
    res.json({ 'data': sublist, 'code': 200 })
});

router.post('/sub', async function(req, res, next) {
    const content = req.body
    const createsub = await scoresubmodel.create(content)
    res.json({ 'data': createsub, 'code': 200 })
});

router.put('/sub/:id', async function(req, res, next) {
    const id = req.params.id;
    const content = req.body;
    delete content._id;
    // console.log(id, content)
    const editsub = await scoresubmodel.updateOne({ _id: id }, { $set: content })
    res.json({ 'data': editsub, 'code': 200 })
});

router.delete('/sub/:id', async function(req, res, next) {
    const id = req.params.id
    const delsub = await scoresubmodel.deleteOne({ _id: id })
    res.json({ 'data': delsub, 'code': 200 })
});

module.exports = router;