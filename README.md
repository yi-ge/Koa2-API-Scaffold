Koa2 RESTful API 服务器脚手架
=============================

这是一个基于Koa2的轻量级RESTful API Server脚手架，支持ES6。

**注意：因升级Koa版本至2.3.0，为配合相应的依赖项，故需要Node.js版本大于等于v8.0.0（建议v9.9.0），NPM大于等于v5.0.0。建议使用yarn代替npm。**

约定使用JSON格式传输数据，POST、PUT、DELET方法支持的Content-Type为`application/x-www-form-urlencoded、multipart/form-data、application/json`可配置支持跨域。非上传文件推荐application/x-www-form-urlencoded。通常情况下返回application/json格式的JSON数据。

可选用redis等非关系型数据库。考虑RESTful API Server的实际开发需要，这里通过sequelize.js作为PostgreSQL, MySQL, MariaDB, SQLite, MSSQL关系型数据库的ORM，如无需关系型ORM，`npm remove sequelize -S`，然后删除`src/lib/sequelize.js`文件。

此脚手架只安装了一些和Koa2不冲突的搭建RESTful API Server的必要插件，附带每一个插件的说明。采用ESlint进行语法检查。

因此脚手架主要提供RESTful API，故暂时不考虑前端静态资源处理，只提供静态资源访问的基本方法便于访问用户上传到服务器的图片等资源。基本目录结构与vue-cli保持一致，可配合React、AngularJS、Vue.js等前端框架使用。在Cordova/PhoneGap中使用时需要开启跨域功能。

**免责声明：** 此脚手架仅为方便开发提供基础环境，任何人或组织均可随意克隆使用，使用引入的框架需遵循原作者规定的相关协议（部分框架列表及来源地址在下方）。采用此脚手架产生的任何后果请自行承担，本人不对此脚手架负任何法律责任，使用即代表同意此条。

目前暂未加入软件测试模块，下一个版本会加入该功能并提供集成方案。建议自行集成jest。

开发使用说明
------------

```
$ git clone https://github.com/yi-ge/koa2-API-scaffold.git

$ cd mv koa2-API-scaffold
$ npm install
$ npm run dev # 可执行npm start跳过ESlint检查。
```

访问： http://127.0.0.1:3000/

调试说明
--------

```
$ npm run dev --debug

Or

$ npm start --debug
```

支持Node.js原生调试功能：https://nodejs.org/api/debugger.html

开发环境部署
------------

生成node直接可以执行的代码到dist目录：

```
$ npm run build
```

```
$ npm run production # 生产模式运行

Or

$ node dist/app.js
```

### PM2部署说明

提供了PM2部署RESTful API Server的示例配置，位于“pm2.js”文件中。

```
$ pm2 start pm2.js
```

PM2配合Docker部署说明： http://pm2.keymetrics.io/docs/usage/docker-pm2-nodejs/

### Docker部署说明

```
$ docker pull node
$ docker run -itd --name RESTfulAPI -v `pwd`:/usr/src/app -w /usr/src/app node node ./dist/app.js
```

通过'docker ps'查看是否运行成功及运行状态

### Linux/Mac 直接后台运行生产环境代码

有时候为了简单，我们也这样做：

```
$ nohup node ./dist/app.js > logs/out.log &
```

查看运行状态（如果有'node app.js'出现则说明正在后台运行）：

```
$ ps aux|grep app.js
```

查看运行日志

```
$ cat logs/out.log
```

监控运行状态

```
$ tail -f logs/out.log
```

### 配合Vue-cli部署说明

Vue-cli（Vue2）运行'npm run build'后会在'dist'目录中生成所有静态资源文件。推荐使用Nginx处理静态资源以达最佳利用效果，然后通过上述任意一种方法部署RESTful API服务器。前后端是完全分离的，请注意Koa2 RESTful API Server项目中config/main.json里面的跨域配置。

推荐的Nginx配置文件：

```
server
    {
        listen 80;
        listen [::]:80;
        server_name abc.com www.abc.com; #绑定域名
        index index.html index.htm;
        root  /www/app/dist; #Vue-cli编译后的dist目录

        location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$
        {
            expires      30d;
        }

        location ~ .*\.(js|css)?$
        {
            expires      12h;
        }

        location ~ /\.
        {
            deny all;
        }

        access_log off; #访问日志路径
    }
```

Docker中Nginx运行命令(将上述配置文件任意命名放置于nginx_config目录中即可)：

```
$ docker run -itd -p 80:80 -p 443:443 -v `pwd`/nginx_config:/etc/nginx/conf.d nginx
```

### 关于Token使用的特别说明（JWT身份认证）
`src\app.js`目录中有一行代码：
```.use(jwt({ secret: publicKey }).unless({ path: [/^\/public|\/user\/login|\/assets/] }))```

在path里面的开头路径则不进行身份认证，否则都将进行鉴权。

前端处理方案：
```
import axios from "axios"
import { getToken } from "./tool"

const DevBaseUrl = "http://127.0.0.1:8080"
const ProdBashUrl = "https://xxx.xxx"

let config = {
  baseURL: process.env.NODE_ENV !== "production" ? DevBaseUrl : ProdBashUrl // 配置API接口地址
}

let token = getToken()
if (token) {
  config.headers = { Authorization: "Bearer " + token }
}

let request = axios.create(config)

// http request 拦截器
axios.interceptors.request.use(
  config => {
    if (window) {
      let token = getToken()
      if (token) {
        // 判断是否存在token，如果存在的话，则每个http header都加上token
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    // if (config.method === 'get') {
    //   config.url = config.url + 'timestamp=' + Date.now().toString()
    // }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

export default request
```

`tool.js`文件
```

// 写 cookies
export let setCookie = function setCookie(name, value, time) {
  if (time) {
    let strsec = getsec(time);
    let exp = new Date();
    exp.setTime(exp.getTime() + parseInt(strsec));
    document.cookie = name +
      "=" +
      escape(value) +
      ";expires=" +
      exp.toGMTString();
  } else {
    document.cookie = name + "=" + escape(value);
  }
};

// 读 cookies
export let getCookie = function(name) {
  let reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  let arr = document.cookie.match(reg);
  return arr ? unescape(arr[2]) : null;
};

// 删 cookies
export let delCookie = function(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null) {
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
  }
};

// 获取Token
export let getToken = function() {
  if (window.sessionStorage && window.sessionStorage.Bearer) {
    return window.sessionStorage.Bearer;
  } else if (window.localStorage && window.localStorage.Bearer) {
    return window.localStorage.Bearer;
  } else if (window.document.cookie) {
    return getCookie("Bearer");
  }
};

// 设置Token
export let setToken = function(token, rememberTime) {
  if (window.sessionStorage) {
    window.sessionStorage.Bearer = token;
  }

  if ((rememberTime && window.localStorage) || !window.sessionStorage) {
    window.localStorage.Bearer = token;
  }

  if (
    window.document.cookie && !window.sessionStorage && !window.localStorage
  ) {
    if (rememberTime) {
      setCookie("Bearer", token, rememberTime);
    } else {
      setCookie("Bearer", token);
    }
  }
};

// 删除Token
export let delToken = function() {
  if (window.sessionStorage && window.sessionStorage.Bearer) {
    window.sessionStorage.removeItem("Bearer");
  }

  if (window.localStorage && window.localStorage.Bearer) {
    window.localStorage.removeItem("Bearer");
  }

  if (window.document.cookie) {
    delCookie("Bearer");
  }
};
```

大概原理：
通过某个API（通常是登录API）获取成功后的Token，存于本地，然后每次请求的时候在Header带上`Authorization: "Bearer " + token`，通常情况下无需担心本地Token被破解。

引入插件介绍
------------

> 引入插件的版本将会持续更新

引入的插件：  
`koa@2 koa-body@2 koa-router@next koa-static2 koa-compose require-directory babel-cli babel-register babel-plugin-transform-runtime babel-preset-es2015 babel-preset-stage-2 gulp gulp-eslint eslint eslint-config-standard eslint-friendly-formatter eslint-plugin-html eslint-plugin-promise nodemailer promise-mysql 等`

**koa2**: HTTP框架  
&nbsp;Synopsis: HTTP framework.  
&nbsp;From: https://github.com/koajs/koa v2

**koa-body**: body解析器  
&nbsp;Synopsis: A full-feature koa body parser middleware.  
&nbsp;From: https://github.com/dlau/koa-body

**koa-router**: Koa路由  
&nbsp;Synopsis: Router middleware for koa.  
&nbsp;From: https://github.com/alexmingoia/koa-router/tree/master/

**koa-static2**: 静态资源中间件  
&nbsp;Synopsis: Middleware for Koa2 to serve a folder under a name declared by user.  
&nbsp;From: https://github.com/Secbone/koa-static2

**koa-compose**: 多个中间件组合成一个  
&nbsp;Synopsis: Compose several middleware into one.  
&nbsp;From: https://github.com/koajs/compose

**require-directory**: 递归遍历指定目录  
&nbsp;Synopsis: Recursively iterates over specified directory.  
&nbsp;From: https://github.com/troygoode/node-require-directory

**babel-cli**: Babel编译ES6代码为ES5代码  
&nbsp;Synopsis: Babel is a JavaScript compiler, ES6 to ES5.  
&nbsp;From: https://github.com/babel/babel/tree/master/packages/babel-cli

**babel-register**: Babel开发环境实时编译ES6代码  
&nbsp;Synopsis: Babel hook.  
&nbsp;From: https://github.com/babel/babel/tree/master/packages/babel-cli

**babel-plugin-transform-runtime**: Babel配置ES6的依赖项  
**babel-preset-es2015**: 同上  
**babel-preset-stage-2**: 同上

**gulp**: 基于流的自动化构建工具  
&nbsp;Synopsis: Gulp is a toolkit for automating painful or time-consuming tasks.  
&nbsp;From: https://github.com/gulpjs/gulp

**gulp-eslint**: gulp的ESLint检查插件  
&nbsp;Synopsis: A gulp plugin for ESLint.  
&nbsp;From: https://github.com/adametry/gulp-eslint

**gulp-nodemon**: 修改JS代码后自动重启  
&nbsp;Synopsis: nodemon will watch the files in the directory in which nodemon was started, and if any files change, nodemon will automatically restart your node application.  
&nbsp;From: https://github.com/remy/nodemon

**eslint**: JavaScript语法检查工具  
&nbsp;Synopsis: A fully pluggable tool for identifying and reporting on patterns in JavaScript.  
&nbsp;From:

**eslint-config-standard**: 一个ESlint配置&nbsp;Synopsis: ESLint Shareable Config for JavaScript Standard Style.  
&nbsp;From: https://github.com/feross/eslint-config-standard

**eslint-friendly-formatter**: 使得ESlint提示在Sublime Text或iterm2中更友好，Atom也有对应的ESlint插件。  
&nbsp;Synopsis: A simple formatter/reporter for ESLint that's friendly with Sublime Text and iterm2 'click to open file' functionality  
&nbsp;From: https://github.com/royriojas/eslint-friendly-formatter

**eslint-plugin-html**: 检查HTML文件中的JS代码规范  
&nbsp;Synopsis: An ESLint plugin to extract and lint scripts from HTML files.  
&nbsp;From: https://github.com/BenoitZugmeyer/eslint-plugin-html

**eslint-plugin-promise**: 检查JavaScript promises  
&nbsp;Synopsis: Enforce best practices for JavaScript promises.&nbsp;From: https://github.com/xjamundx/eslint-plugin-promise

**eslint-plugin-promise**: ESlint依赖项  
&nbsp;Synopsis: ESlint Rules for the Standard Linter.&nbsp;From: https://github.com/xjamundx/eslint-plugin-standard

**nodemailer**: 发送邮件  
&nbsp;Synopsis: Send e-mails with Node.JS.  
&nbsp;From: https://github.com/nodemailer/nodemailer

**promise-mysql**: 操作MySQL数据库依赖  
&nbsp;Synopsis: Promise Mysql.  
&nbsp;From: https://github.com/lukeb-uk/node-promise-mysql

**sequelize**: 关系型数据库ORM  
&nbsp;Synopsis: Sequelize is a promise-based ORM for Node.js.  
&nbsp;From: https://github.com/sequelize/sequelize

**mysql**: MySQL库  
&nbsp;Synopsis: A pure node.js JavaScript Client implementing the MySql protocol.  
&nbsp;From: https://github.com/mysqljs/mysql

支持Koa2的中间件列表：https://github.com/koajs/koa/wiki

**其它经常配合Koa2的插件：**

**koa-session2**: Session中间件  
&nbsp;Synopsis: Middleware for Koa2 to get/set session.  
&nbsp;From: https://github.com/Secbone/koa-session2

**koa-nunjucks-2**:  
一个好用的模版引擎，可用于前后端，nunjucks：https://github.com/mozilla/nunjucks

**koa-favicon**:  
Koa的favicon中间件：https://github.com/koajs/favicon

**koa-server-push**:  
HTTP2推送中间件：https://github.com/silenceisgolden/koa-server-push

**koa-convert**: 转换旧的中间件支持Koa2  
&nbsp;Synopsis: Convert koa generator-based middleware to promise-based middleware.  
&nbsp;From: https://github.com/koajs/convert

**koa-logger**: 请求日志输出，需要配合上面的插件使用  
&nbsp;Synopsis: Development style logger middleware for Koa.  
&nbsp;From: https://github.com/koajs/logger

**koa-onerror**:  
Koa的错误拦截中间件，需要配合上面的插件使用：https://github.com/koajs/onerror

**koa-multer**: 处理数据中间件  
&nbsp;Synopsis: Multer is a node.js middleware for handling multipart/form-data for koa.  
&nbsp;From: https://github.com/koa-modules/multer

目录结构说明
------------

```bash
.
├── README.md
├── .babelrc                # Babel 配置文件
├── .editorconfig           # 编辑器风格定义文件
├── .eslintignore           # ESlint 忽略文件列表
├── .eslintrc.js            # ESlint 配置文件
├── .gitignore              # Git 忽略文件列表
├── gulpfile.js             # Gulp配置文件
├── package.json            # 描述文件
├── pm2.js                  # pm2 部署示例文件
├── build                   # build 入口目录
│   └── dev-server.js       # 开发环境 Babel 实时编译入口
├── src                     # 源代码目录，编译后目标源代码位于 dist 目录
│   ├── app.js              # 入口文件
│   ├── config.js           # 主配置文件（*谨防泄密！）
│   ├── plugin              # 插件目录
│       └── smtp_sendemail  # 示例插件 - 发邮件
│   ├── tool                # 工具目录
│       ├── PluginLoader.js # 插件引入工具
│       └── Common.js       # 示例插件 - 发邮件
│   ├── lib                 # 库目录
│   ├── controllers         # 控制器
│   ├── models              # 模型
│   ├── routes              # 路由
│   └── services            # 服务
├── assets                  # 静态资源目录
└── logs                    # 日志目录
```

集成NUXT请求时身份认证说明
--------------------------

```
import Vue from 'vue'
import axios from 'axios'

const DevBaseUrl = 'http://127.0.0.1:3000'
const ProdBashUrl = 'https://api.xxx.com'

let config = {
  baseURL: process.env.NODE_ENV !== 'production' ? DevBaseUrl : ProdBashUrl // 配置API接口地址
}

if (process.env.VUE_ENV !== 'server') {
  let token = getToken() // 此函数自行实现
  if (token) {
    config.headers = {Authorization: 'Bearer ' + token}
  }
}

let request = axios.create(config)

// http request 拦截器
axios.interceptors.request.use(
  (config) => {
    if (window) {
      let token = getToken()
      if (token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

Vue.prototype.$request = request
```

各类主流框架调用RESTful API的示例代码（仅供参考）
-------------------------------------------------

### AngularJS (Ionic同)

```
$http({
	method: 'post',
	url: 'http://localhost:3000/xxx',
	data: {para1:'para1',para2:'para2'},
	headers: {
	    'Content-Type': 'application/x-www-form-urlencoded'
	}
 }).success(function (data) {
 }).error(function (data) {
 })
```

### jQuery

```
$.ajax({
  cache: false,
  type: 'POST',
  url: 'http://localhost:3000/xxx',
  data: {
      para1: para1
  },
  async: false,
  dataType: 'json',
  success: function (result) {
  },
  error: function (err) {
      console.log(err)
  }
})

// 上传文件
//创建FormData对象
var data = new FormData()
//为FormData对象添加数据
//
$.each($('#inputfile')[0].files, function (i, file) {
  data.append('upload_file', file)
})
$.ajax({
  url: 'http://127.0.0.1:3000/api/upload_oss_img_demo',
  type: 'POST',
  data: data,
  cache: false,
  contentType: false,    //不可缺
  processData: false,    //不可缺
  success: function (data) {
    console.log(data)
    if (data.result == 'ok') {
      $('#zzzz').attr('src', data.img_url)
    }

  }
})
```

### MUI

```
mui.ajax({ url: 'http://localhost:3000/xxx', dataType: 'json',
  success: function(data){

  },
  error: function(data){
      console.log('error!')
  }
})
```

### JavaScript

```
  var xhr = new XMLHttpRequest()
  xhr.open('POST', 'http://localhost:3000/xxx', true) //POST或GET，true（异步）或 false（同步）
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
  xhr.withCredentials = true
  xhr.onreadystatechange = function () {
      if (obj.readyState == 4 && obj.status == 200 || obj.status == 304) {
          var gotServices = JSON.parse(xhr.responseText)
      }else{
          console.log('ajax失败了')
      }
  }
  xhr.send({para1: para1})
```

### vue-resource

https://github.com/pagekit/vue-resource

```
// global Vue object
Vue.http.post('/someUrl', [body], {
  headers: {'Content-type', 'application/x-www-form-urlencoded'}
}).then(successCallback, errorCallback)
```

### fetch

https://github.com/github/fetch

```
fetch('/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Hubot',
    login: 'hubot',
  })
}).then(function(response) {
  // response.text()
}).then(function(body) {
  // body
})

// 文件上传
var input = document.querySelector('input[type='file']')

var data = new FormData()
data.append('file', input.files[0])
data.append('user', 'hubot')

fetch('/avatars', {
  method: 'POST',
  body: data
})
```

### superagent

https://github.com/visionmedia/superagent

```
request.post('/user')
 .set('Content-Type', 'application/json')
 .send('{'name':'tj','pet':'tobi'}')
 .end(callback)
```

### request

https://github.com/request/request

```
request.post('/api').form({key:'value'}), function(err,httpResponse,body){ /* ... */ })
```

在React中可以将上述任意方法其置于componentDidMount()中，Vue.js同理。

彻底移除ESlint方法
------------------

删除package.json的devDependencies中所有eslint开头的插件，根目录下的“.eslintignore、.eslintrc.js”文件，并且修改package.json的dev为：

```
'dev': 'gulp start'
```

删除gulpfile.js中的lint、eslint_start两个任务，并且把default改为“gulp.task('default', ['start']”。

更新说明
--------

*v0.2.6 2018年03月24日22:16:43*

1.	升级依赖项版本（node9.9.0）。

*v0.2.5 2018年01月13日10:37:29*

1.	升级依赖项版本（node9.3.0）。
2.	添加了Token使用说明。

*v0.2.4 2017年12月01日14:16:03*

1.	升级依赖项版本（node9.2.0）。

*v0.2.3 2017年10月23日23:26:56*

1.	升级依赖项版本（node8.7.0）。

*v0.2.2 2017年09月17日17:45:07*

1.	升级依赖项版本（在node8.5.0测试）。

*v0.2.1 2017年07月19日19:38:19*

1.	移除MySQL模块（重复了）。
2.	添加更详细的说明。

*v0.2 2017年07月16日22:48:34*

1.	升级koa为2.3.0版本。
2.	将koa-session2替换为koa-jwt，添加了jsonwebtoken。
3.	升级了以下依赖的版本： koa@2.3.0, koa-body@2.3.0, koa-router@7.2.1, babel-cli@6.24.1, babel-preset-es2015@6.24.1, babel-preset-stage-2@6.24.1, babel-register@6.24.1, eslint-plugin-promise@3.5.0, koa-compose@4.0.0, nodemailer@4.0.1, sequelize@4.3.2, eslint@4.2.0, eslint-config-standard@10.2.1, eslint-friendly-formatter@3.0.0, eslint-plugin-html@3.1.0, gulp-eslint@4.0.0, koa-logger@3.0.1

*v0.1 2017年04月07日11:46:02*

1.	升级koa为2.2.0版本。
2.	升级了以下依赖版本到“建议版本”：

```
依赖项                     原版本  建议版本 最新版本        项目
eslint                   3.18.0  3.19.0  3.19.0  koa2-API-scaffold
eslint-plugin-standard    2.1.1   3.0.1   3.0.1  koa2-API-scaffold
koa-router                7.1.0   7.1.1   7.1.1  koa2-API-scaffold
promise-mysql             3.0.0   3.0.1   3.0.1  koa2-API-scaffold
sequelize                3.30.2  3.30.4  3.30.4  koa2-API-scaffold
```

*v0.0.9_1 2017年03月30日15:51:03*

1.	完善了gulpfile.js，不是重要的更新。

*v0.0.9 2017年03月27日17:25:58*

1.	修改了`src/controllers/upload.js`文件，添加了上传文件示例代码。
2.	修复了`src/lib/mysql.js`引用路径错误的BUG。
3.	修改了`src/controllers/api.js`GET参数获取的示例。

*v0.0.8 2017年03月01日23:03:44*  
1、在src/app.js 18行 后添加了

```
    jsonLimit: '20mb',
    formLimit: '10mb',
    textLimit: '20mb',
```

以免表单过长导致提交失败。

*v0.0.7 2017年02月18日19:01:48*  
1、修改了index.js、config.js（详情请看github记录），完善了对跨域的处理。 更新建议：对应github修改记录同步修改，方便将来部署调试。

*v0.0.6 2017年02月17日21:17:23*  
1、修改了src/lib/sequelize.js文件,添加了对utf8mb4的支持（要求MySQL版本>5.5）。

*v0.0.5 2017年02月12日01:25:34*  
1、修改了gulpfile.js文件，在更改文件热重启的时候无需检查全部文件，仅检查改动文件，开发速度更快。  
2、修改了package.json中"start"项的值为"gulp nodemon"配合gulpfile.js文件的修改。

*v0.0.4 2017年02月07日15:57:17*  
1、修改了部分配置文件的配置方法，使之更为规范（老版本用户无须理会，对程序没有影响）。  
2、修改了eslintrc.js文件中的JavaScript版本配置，改为ES8，兼容async、await。  
3、修改gulpfile.js文件第12行，检查`src/**/*.js`文件。
