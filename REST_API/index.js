const express = require('express')
const db = require('./data/db.js') // 파일 로드를 위한 모듈
const app = express()

app.use(express.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('index') // index.html render
})

// index page
app.get('/', (req, res) => {
        res.render('index') // index.html render
    })
    // todos
app.route('/api/todos')
    .get(async(req, res) => {
        const result = { success: true }
        try {
            const json = await db.getData()
            result.data = json.todos
        } catch (err) {
            result.success = false
            result.err = err
        }
        res.json(result)
        console.log(result)
    })
    .post(async(req, res) => {
        const result = { success: true }
        const todos = req.body.todos
        try {
            const json = await db.getData()
            json.todos = todos
            await db.setData(json)
        } catch (err) {
            result.success = false
            result.err = err
        }
        res.json(result)
    })
    // detail
app.route('/api/detail/:parent')
    .get(async(req, res) => {
        const result = { success: true }
        const parent = req.params.parent
        try {
            const json = await db.getData()
            list = []
            json.detail.forEach((v, idx) => {
                if (v.parent === parent) {
                    v.idx = idx
                    list.push(v)
                }
            })
            result.data = list
        } catch (err) {
            result.success = false
            result.err = err
        }
        res.json(result)
    })
    .post(async(req, res) => {
        const result = { success: true }
        const detail = req.body.detail
        const parent = req.params.parent
        try {
            const json = await db.getData()
            detail.parent = parent
            json.detail.push(detail)
            await db.setData(json)
        } catch (err) {
            result.success = false
            result.err = err
        }
        res.json(result)
    })
    .put(async(req, res) => {
        const result = { success: true }
        const detail = req.body.detail
        const idx = req.params.parent
        try {
            const json = await db.getData()
            json.detail[idx] = detail
            await db.setData(json)
        } catch (err) {
            result.success = false
            result.err = err
        }
        res.json(result)
    })
    .delete(async(req, res) => {
        const result = { success: true }
        const detail = req.body.detail
        const idx = req.params.parent
    })

app.listen(8226, () => {
    console.log("Server has been started")
})