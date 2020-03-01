'use strict';
var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }

    return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

// DOM function
var one = function one(ele) {
    return document.querySelector(ele);
};

var all = function all(ele) {
    return document.querySelectorAll(ele);
};

var create = function create(name, attr) {
    var ele = document.createElement(name);
    for (var k in attr) {
        var v = attr[k];
        switch (k) {
            case 'html':
                ele.innerHTML = v;
                break;
            case 'event':
                for (var e in v) {
                    ele.addEventListener(e, v[e]);
                }
                break;
            default:
                ele.setAttribute(k, v);
                break;
        }
    }
    return ele;
};

// myAjax
var Ajax = function () {
    function Ajax() {
        _classCallCheck(this, Ajax);
    }

    _createClass(Ajax, null, [{
        key: 'get',
        value: async function get(url) {
            var json = await fetch(url).then(function (res) {
                return res.json();
            });
            if (!json.success) throw json.err;
            return json.data;
        }
    }, {
        key: 'set',
        value: async function set(url, data) {
            var method = arguments.length <= 2 || arguments[2] === undefined ? 'post' : arguments[2];

            var headers = {'Content-Type': 'application/json'};
            var params = {method: method, headers: headers, body: JSON.stringify(data)};
            var json = await fetch(url, params).then(function (res) {
                return res.json();
            });
            if (!json.success) throw json.err;
            return json.data;
        }
    }]);

    return Ajax;
}();

// DataBase
var Model = function () {
    function Model() {
        _classCallCheck(this, Model);
    }

    _createClass(Model, [{
        key: 'getTodos',
        value: async function getTodos() {
            return await Ajax.get('/api/todos');
        }
    }, {
        key: 'setTodos',
        value: async function setTodos(todos) {
            await Ajax.set('/api/todos', {todos: todos});
        }
    }, {
        key: 'getDetail',
        value: async function getDetail(idx) {
            return (await Ajax.get('/api/detail/' + idx)) || [];
        }
    }, {
        key: 'addDetail',
        value: async function addDetail(detail, idx) {
            await Ajax.set('/api/detail/' + idx, {detail: detail});
        }
    }, {
        key: 'setDetail',
        value: async function setDetail(detail, idx) {
            await Ajax.set('/api/detail/' + idx, {detail: detail}, 'put');
        }
    }]);

    return Model;
}();
// Renderer


var Renderer = function () {
    function Renderer(model) {
        _classCallCheck(this, Renderer);

        this.model = model;
        this.todosInput = one('.todos-input');
        this.todosList = one('.todos-list');
        this.detailList = one('.detail-list');
        this.todosInput.onkeyup = this.addTodos();
    }

    _createClass(Renderer, [{
        key: 'addTodos',
        value: function addTodos() {
            var $this = this;
            return async function (e) {
                if (e.keyCode === 13) {
                    var todos = await $this.model.getTodos();
                    todos.push({name: e.target.value});
                    await $this.model.setTodos(todos);
                    $this.todosRender(todos);
                    e.target.value = '';
                    e.target.focus;
                }
            };
        }
    }, {
        key: 'addDetail',
        value: function addDetail(todosEvent, idx) {
            var $this = this;
            return async function (inputEvent) {
                if (inputEvent.keyCode === 13) {
                    await $this.model.addDetail({name: inputEvent.target.value, state: false}, idx);
                    todosEvent.target.click();
                }
            };
        }
    }, {
        key: 'setDetail',
        value: function setDetail(v) {
            var $this = this;
            return async function (e) {
                v.state = !v.state;
                await $this.model.setDetail(v, v.idx);
                e.target.style.color = v.state ? '#09F' : '';
            };
        }
    }, {
        key: 'todosRender',
        value: function todosRender(todos) {
            var _this = this;

            var ul = create('ul');
            todos.forEach(function (v, k) {
                ul.appendChild(create('li', {html: v.name, event: {click: _this.detailRender(v.name, k)}}));
            });
            this.todosList.innerHTML = '';
            this.todosList.appendChild(ul);
        }
    }, {
        key: 'detailRender',
        value: function detailRender(todosName, idx) {
            var $this = this;
            return async function (e) {
                var title = create('h3', {html: todosName});
                var ul = create('ul');
                var detail = await $this.model.getDetail(idx);
                var input = create('input', {
                    class: 'detail-input',
                    size: 20,
                    placeholder: 'detail 입력',
                    event: {keyup: $this.addDetail(e, idx)}
                });
                var close = create('button', {
                    type: 'button', html: '닫기', event: {
                        click: function click(e) {
                            return $this.detailList.innerHTML = '';
                        }
                    }
                });
                detail.forEach(function (v) {
                    return ul.appendChild($this.detailChildRender(v));
                });
                $this.detailList.innerHTML = '';
                var _arr = [title, input, ul, close];
                for (var _i = 0; _i < _arr.length; _i++) {
                    var ele = _arr[_i];
                    $this.detailList.appendChild(ele);
                }
            };
        }
    }, {
        key: 'detailChildRender',
        value: function detailChildRender(v) {
            var $this = this;
            return create('li', {
                html: v.name,
                style: v.state ? 'color:#09F' : '',
                event: {click: $this.setDetail(v)}
            });
        }
    }]);

    return Renderer;
}();

window.onload = async function (_) {
    var model = new Model();
    var renderer = new Renderer(model);
    var todos = await model.getTodos();
    renderer.todosRender(todos);
};