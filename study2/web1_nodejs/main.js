let http = require('http');
let fs = require('fs');
let url = require('url');
let qs = require('querystring');

function templateHTML(title, list, body) {
    return `
                <!doctype html>
                <html>
                <head>
                  <title>WEB1 - ${title}</title>
                  <meta charset="utf-8">
                </head>
                <body>
                  <h1><a href="/">WEB</a></h1>
                    ${list}
                    <a href="/create">create</a>
                    ${body}
                </body>
                </html>
                `;
}

function templateList(fileList) {
    let list = '<ul>';
    let i = 0;
    while (i < fileList.length) {
        list = list + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
        i = i + 1;
    }
    list = list + '</ul>';
    return list;
}

let app = http.createServer(function (request, response) {
    let _url = request.url;
    let queryData = url.parse(_url, true).query;
    let pathName = url.parse(_url, true).pathname;
    if (pathName === '/') {
        if (queryData.id === undefined) {
            fs.readdir('data', function (err, fileList) {
                let title = 'Welcome';
                let description = 'Hello, Node.js';
                let template = templateHTML(title, templateList(fileList), `<h2>${title}</h2>${description}`);
                response.writeHead(200);
                response.end(template);
            })
        } else {
            fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
                fs.readdir('data', function (err, fileList) {
                    let list = '<ul>';
                    let i = 0;
                    while (i < fileList.length) {
                        list = list + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
                        i = i + 1;
                    }
                    list = list + '</ul>';
                    let title = queryData.id;
                    let template = templateHTML(title, templateList(fileList), `<h2>${title}</h2>${description}`);
                    response.writeHead(200);
                    response.end(template);
                });
            });
        }
    } else if (pathName === '/create') {
        fs.readdir('data', function (err, fileList) {
            let title = 'WEB - create';
            let template = templateHTML(title, templateList(fileList), `
            <form action="http://localhost:8226/process_create" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p><textarea name="description" placeholder="description"></textarea></p>
                <p><input type="submit" value="SUBMIT"></p>
            </form>
            `);
            response.writeHead(200);
            response.end(template);
        });
    } else if (pathName === '/process_create') {
        let body = '';
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            let post = qs.parse(body);
            let title = post.title;
            let description = post.description;
            console.log(title, description);
        });
        response.writeHead(200);
        response.end("success");
    } else {
        response.writeHead(404);
        response.end('Not Found');
    }
});
app.listen(8226);