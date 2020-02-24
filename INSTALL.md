# Rasberry-Pi 에 NodeJs 설치하기 - 기본 설정
```sh
# 패키지 관리자 업데이트
sudo apt-get update

# 패키지 관리자 업그레이드
sudo apt-get upgrade -y

# upgrade 실행 후 아래 에러가 발생한다면 [ sudo apt-get update -fix-missing ] 실행
# - E: http://archive.raspberrypi.org/debian/pool/main/r/raspberrypi-firmware/libraspberrypi-dev_1.20190925+1-1_armhf.deb 파일을 받는데 실패했습니다  503  Service Unavailable [IP: 93.93.130.39 80]
# - E: 아카이브를 받을 수 없습니다. 아마도 apt-get update를 실행해야 하거나 --fix-missing 옵션을 줘서 실행해야 할 것입니다.

# 패키지 관리자를 통해 nodejs 를 설치할 경우 최신버전으로 설치할 수 없음
# - 따라서 curl 코드를 사용
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -

# nodejs 설치
sudo apt-get install -y nodejs

# 정상적으로 설치가 되었는지 nodejs 버전 확인
node --version

mkdir 디렉토리경로/프로젝트명
cd 디렉토리경로/프로젝트명

# npm command not found 시
sudo apt-get install -y npm

# 정상적으로 설치가 되었는지 npm 버전 확인
npm -v

# npm does not support Node.js v10.15.2 경우 [ sudo curl https://www.npmjs.com/install.sh | sudo sh ] 실행

# npm 을 통한 프로젝트 파일 생성
# - 프로젝트에 필요한 기본 설정값 입력
# -- package name: (nodetest)
# -- version: (1.0.0)
# -- description:
# -- entry point: (index.js)
# -- test command:
# -- git repository:
# -- keywords:
# -- author:
# -- license: (ISC)
npm init

#실행화면=====================================================================#
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help json` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (nodetest)
version: (1.0.0)
description:
entry point: (index.js)
test command:
git repository:
keywords:
author:
license: (ISC)
About to write to /home/pi/app/projects/nodetest/package.json:

{
  "name": "nodetest",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}


Is this OK? (yes) y
#=============================================================================#

# 개발 프레임워크 express 설치
sudo npm install express

# 서버 구동 확인 코드
vi index.js

#코드입력=====================================================================#
var express = require('express')
var app = express()
port = 8224
 
app.locals.pretty = true
app.listen(port, () => {
  console.log("Server has been started")
})
#=============================================================================#

# 서버 구동
node index.js
```

<hr>
<br>

# Rasberry-Pi 에 NodeJs 설치하기 - 라우팅 설정 및 html 파일 로드
```sh
# index.js 수정
vi index.js

#코드입력=====================================================================#
var express = require('express')
var fs = require('fs')    // 파일 로드를 위한 모듈
var app = express()
var port = 8224

app.locals.pretty = true
app.set('views', './view_file')
app.set('view engine', 'pug')
app.listen(port, () => {
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
      // 응답 프로세스 종료 
      res.end(data)
    }
  })
})
#=============================================================================#

# index.html 작성
vi index.html

#코드입력=====================================================================#
<html>
  <head>
    <title>Hello</title>
  </head>
  <body>
    <h1>Hello World!!!</h1>
  </body>
</html>
#=============================================================================#
```

<hr>
<br>
