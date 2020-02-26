const express = require('express')
const db = require('./data/db.js') // 파일 로드를 위한 모듈
const cors = require('cors')
const app = express()

// https://brunch.co.kr/@adrenalinee31/1
app.use(cors())
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
app.route('/api/detail/:idx')
    .get(async(req, res) => {
        const result = { success: true }
        const idx = req.params.idx
        try {
            const json = await db.getData()
            list = []
            json.detail.forEach((v, idx) => {
                if (v.idx === idx) {
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
        const idx = req.params.idx
        try {
            const json = await db.getData()
            detail.idx = idx
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
        const idx = req.params.idx
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
        const idx = req.params.idx
    })

app.listen(8226, () => {
    console.log("Server has been started")
})