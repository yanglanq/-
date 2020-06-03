const
    request = require("request"),
    fs = require("fs"),
    cheerio = require("cheerio"),
    writeToExcel = require("./setData");

let hrefList = [];
let infoList = [];
let getHref = function(body) {
    let $ = cheerio.load(body);
    let htmlList = $(".info .title a");
    for (let i = 0; i < htmlList.length; i++) {
        hrefList.push(htmlList[i].attribs.href);
    }
}

let getInfo = function(body){
    let $ = cheerio.load(body);
    let data = {};
    data.ImgUrl = $(".content .infodata img").attr("src");
    data.Name = $(".content .cont .name").text();
    data.Alias = $(".content .cont .cate").eq(0).text().split("：")[1]
    data.Classify = $(".content .cont .cate").eq(1).text().split("：")[1]
    // data.Florescence = $(".content .cont .cate").eq(2).text().split("：")[1].split(" ").filter(item=>item).join("、")
    data.Florescence = $(".content .cont .cate").eq(3).text().split("：")[1]
    data.Feature =  $(".content .options dd").eq(0).text()
    data.Habit = $(".content .options dd").eq(1).text()
    data.Purpose = $(".content .options dd").eq(2).text()
    infoList.push(data)
}

function get(s){
    if(s===hrefList.length){
        writeToExcel(infoList.filter(item=>item.ImgUrl))
        return;
    }
    setTimeout(function () {
        request({
            url:hrefList[s],
            method:"GET",
            headers:{
                "user-agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36`,
            }
        },function (err,res,body) {
            if (err) throw err;
            getInfo(body);
            s++;
            get(s)
        })
    },1500)

}
// 1，6 6，11 11,16 16,21
let n = 21; href(n)
function href(n){
    if(n===24){
        get(0)
        return;
    }
    request({
        url:`http://www.aihuhua.com/so/hua-%E5%A4%9A%E8%82%89/page-${n}.html`,
        method:"GET",
        headers:{
            "user-agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36`,
            Host:"Host: www.aihuhua.com"
        }
    },function (err,res,body) {
        if (err) throw err;
        getHref(body);
        n++;
        href(n);
    })
}

