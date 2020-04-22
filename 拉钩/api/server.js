const bodyParser = require("body-parser");
const express = require("express");
let app = express();
//允许跨域请求
app.all("*", function(req, res, next) {
    res.header("X-Powered-By", " 3.2.1");
    res.header({
        "Access-Control-Allow-Credentials": true
        ,"Access-Control-Allow-Origin": req.headers.origin || "*"
        ,"Access-Control-Allow-Headers":"Content-Type,Content-Length, Authorization, Accept,X-Requested-With"
        ,"Access-Control-Allow-Methods":"PUT,POST,GET,DELETE,OPTIONS"
        ,"Content-Type":"application/json;charset=utf-8"
    })
    /*让options请求快速返回*/
    if (req.method === "OPTIONS") res.status(200).send("OK");
    else next();
});
// bodyParser 帮助解析数据
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
const {getData} = require("./getData");
app.get("/data",getData);
app.listen(8089);