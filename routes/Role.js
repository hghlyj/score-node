var express = require('express');
var router = express.Router();
const rolemodel = require('../module/Role')


router.get('/role', async function(req, res, next) {
    const name = req.query.name
    const page = req.query.page
    const pagesize = req.query.pagesize
    if (name) {
        const name1 = new RegExp(name, 'i')
        const rolelist = await rolemodel.find({ name: name1 }).populate("depar_id").populate("depar_id").limit(Number(pagesize)).skip((Number(page) - 1) * Number(pagesize));
        const total = await rolemodel.find({ name: name1 })
        const total1 = total.length
        res.json({ 'data': rolelist, 'code': 200, 'count': total1 })
    } else if (page && pagesize) {
        const rolelist = await rolemodel.find({}).populate("depar_id").limit(Number(pagesize)).skip((Number(page) - 1) * Number(pagesize))
        const total = await rolemodel.find({})
        const total1 = total.length
        res.json({ 'data': rolelist, 'code': 200, 'count': total1 })
    } else {
        await rolemodel.find({}).populate("depar_id").exec(function(err, data) {
            if (err) {
                console.log(err)
            } else {
                res.json({ 'data': data, 'code': 200 });
            }
        });

    }
});

router.get('/depar-role', async function(req, res, next) {
    id = req.query.id
    const rolelist = await rolemodel.find({ depar_id: id })
    res.json({ 'data': rolelist, 'code': 200 })
});

router.get('/role/:id', async function(req, res, next) {
    const rolelist = await rolemodel.find({ _id: req.params.id })
    res.json({ 'data': rolelist, 'code': 200 })
});

router.post('/role', async function(req, res, next) {
    const content = req.body
    const createrole = await rolemodel.create(content)
    res.json({ 'data': createrole, 'code': 200 })
});

router.put('/role/:id', async function(req, res, next) {
    const id = req.params.id;
    const content = req.body;
    delete content._id;
    // console.log(id, content)
    const editrole = await rolemodel.updateOne({ _id: id }, { $set: content })
    res.json({ 'data': editrole, 'code': 200 })
});

router.delete('/role/:id', async function(req, res, next) {
    const id = req.params.id
    const delrole = await rolemodel.deleteOne({ _id: id })
    res.json({ 'data': delrole, 'code': 200 })
});

module.exports = router;