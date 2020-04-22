const
    request = require("request"),
    fs = require("fs"),
    cheerio = require("cheerio"),
    writeToExcel = require("./setData");
let start = 1;
let end = 5;
// cookie 会随时变化，需随时获取
let cookie = `_uab_collina=158756013666729543965803; lastCity=100010000; __c=1587560137; __g=-; Hm_lvt_194df3105ad7148dcf2b98a91b5e727a=1587560137; __l=l=%2Fwww.zhipin.com%2Fc100010000%2F%3Fka%3Dopen_joblist&r=https%3A%2F%2Fwww.zhipin.com%2Fweb%2Fcommon%2Fsecurity-check.html%3Fseed%3D06r61I%252Fv8v6ZbaOE7KZt2E5rTxMWmUDWx2pTwy8trlU%253D%26name%3D43649d6a%26ts%3D1587560135358%26callbackUrl%3D%252Fc100010000%252F%253Fka%253Dopen_joblist%26srcReferer%3D&friend_source=0&friend_source=0; __a=84099647.1587560137..1587560137.33.1.33.33; Hm_lpvt_194df3105ad7148dcf2b98a91b5e727a=1587566329; __zp_stoken__=8a2dLmpMB0jxFdEM97vhDqaOc4aZxJ7rFKqRSwy%2FDn%2BmwQdNDDYBB4UvGtnl%2BMU1eTouTDGhzHKhu2FTymsqnx1c0PVXevReR%2BagyiSA2nRo6J5orsspMKAg3SGE5U3hmv06`
let dataList = [];

let getData = function(body){
    let $ = cheerio.load(body);
    let htmlList = $("li .job-primary");
    htmlList.each(function (item) {
        let text = "";
        let edu = $(this).find(".job-limit p").text();
        $(this).find(".info-append .tags").each(function (item) {
            text += $(this).find(".tag-item").text();
        })
        dataList.push({
            "序号": 0,
            "类别": "",
            "创建时间": JSON.stringify(new Date()).split("T")[0].split("-").join("/").split('"')[1],
            "过期时间": "",
            "工作地点": $(this).find(".job-area").text(),
            "公司名称": $(this).find(".company-text a").attr("title"),
            "链接地址": `https://www.zhipin.com${$(this).find(".primary-box").attr("href")}?ka=${$(this).find(".primary-box").attr("ka")}${$(this).find(".primary-box").attr("target")}&lid=${$(this).find(".primary-box").attr("data-lid")}`,
            "职务名称": $(this).find(".job-name a").text(),
            "是否推荐": "否",
            "公司性质": $(this).find(".company-text p a").text(),
            "职务性质": text,
            "教育背景": edu.substring(edu.length-2,edu.length)
        })
    })
}

let timer = setInterval(function () {
    request({
        url:`https://www.zhipin.com/c100010000/?page=${start}&ka=page-${start}`,
        method:"GET",
        headers:{
            "user-agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.113 Safari/537.36`,
            cookie:cookie,
            referer: `https://www.zhipin.com/c100010000/?page=${start}`
        },
        query:{
            page: start,
            ka:'page-'+start
        }
    },function (err,res,body) {
        if (err) throw err;
        getData(body);
        console.log(dataList.length,start);
        start++;
        if(start===end){
            writeToExcel(dataList);
            clearInterval(timer);
        }
    })
},3000);


