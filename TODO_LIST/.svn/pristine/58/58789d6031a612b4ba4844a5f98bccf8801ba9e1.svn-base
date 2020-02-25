const express = require('express')
const db = require('./data/db.js')    // 파일 로드를 위한 모듈
const app = express()
 
app.use(express.json())
app.use(express.static('public'))
app.locals.pretty = true
app.set('views', './view_file')
app.set('view engine', 'pug')
app.listen(8226, () => {
  console.log("Server has been started")
})
 
// 최상위 라우트로 접속 시 /hello로 리다이렉트 
app.get("/", (req, res) => {
  res.redirect('/hello')
})
 
app.get("/hello", (req, res) => {
  // html 파일 로드
  fs.readFile('index.html', (error, data) => {
    if(error) {
      console.log('error :'+error)
    }
    else {
      res.writeHead(200, {'ContentType':'text/html'})
      res.end(data)   // 응답 프로세스 종료 
    }
  })
})

app.get('/todos',(req,res) => {
    return res.json(todos);
})

let todos = [
    {
        id:1,
        name: 'test1'
    },
    {
        id:2,
        name: 'test2'
    },
    {
        id:3,
        name: 'test3'
    }
]
