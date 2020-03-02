let http = require('http');
let fs = require('fs');
let url = require('url');
let qs = require('querystring');
let template = require('./lib/template');

let app = http.createServer(function (request, response) {
    let _url = request.url;
    let queryData = url.parse(_url, true).query;
    let pathName = url.parse(_url, true).pathname;
    if (pathName === '/') {
        if (queryData.id === undefined) {
            fs.readdir('data', function (err, fileList) {
                let title = 'Welcome';
                let description = 'Hello, Node.js';
                let list = template.list(fileList);
                let html = template.html(title, list,
                    `<h2>${title}</h2>${description}`,
                    `<a href="/create">create</a>`
                );
                response.writeHead(200);
                response.end(html);
            })
        } else {
            fs.readdir('data', function (err, fileList) {
                fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
                    let title = queryData.id;
                    let list = template.list(fileList);
                    let html = template.html(title, list,
                        `<h2>${title}</h2>${description}`,
                        `<a href="/create">create</a>
                         <a href="/update?id=${title}">update</a>
                         <form action="/process_delete" method="post">
                            <input type="hidden" name="id" value="${title}">
                            <input type="submit" value="delete">
                         </form>`
                    );
                    response.writeHead(200);
                    response.end(html);
                });
            });
        }
    } else if (pathName === '/create') {
        fs.readdir('data', function (err, fileList) {
            let title = 'WEB - create';
            let list = template.list(fileList);
            let html = template.html(title, list, `
            <form action="/process_create" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p><textarea name="description" placeholder="description"></textarea></p>
                <p><input type="submit" value="SUBMIT"></p>
            </form>
            `);
            response.writeHead(200);
            response.end(html);
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
            fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end();
            });
        });
    } else if (pathName === '/update') {
        fs.readdir('data', function (err, fileList) {
            fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
                let title = queryData.id;
                let list = template.list(fileList);
                let html = template.html(title, list, `
                <form action="/process_update" method="post">
                    <input type="hidden" name="id" value="${title}">
                    <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                    <p><textarea name="description" placeholder="description">${description}</textarea></p>
                    <p><input type="submit" value="SUBMIT"></p>
                </form>`,
                    `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
                );
                response.writeHead(200);
                response.end(html);
            });
        });
    } else if (pathName === '/process_update') {
        let body = '';
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            let post = qs.parse(body);
            let id = post.id;
            let title = post.title;
            let description = post.description;
            fs.rename(`data/${id}`, `data/${title}`, function (err) {
                fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
                    response.writeHead(302, {Location: `/?id=${title}`});
                    response.end();
                });
            });
        });
    } else if (pathName === '/process_delete') {
        let body = '';
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            let post = qs.parse(body);
            let id = post.id;
            fs.unlink(`data/${id}`, function (err) {
                response.writeHead(302, {Location: `/`});
                response.end();
            });
        });
    } else {
        response.writeHead(404);
        response.end('Not Found');
    }
});
app.listen(8226, function(){
    console.log("server started!");
});