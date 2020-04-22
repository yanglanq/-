const request = require("request");
const writeToExcel = require("./setData")
const fs = require("fs");
module.exports = {
    getData: function (req, res) {
        request({
                method: "POST",
                url: `https://www.lagou.com/jobs/positionAjax.json?px=new&needAddtionalResult=false&isSchoolJob=1`,
                headers: {
                    "Host": "www.lagou.com",
                    "Origin": "https://www.lagou.com",
                    referer: `https://www.lagou.com/jobs/list_?isSchoolJob=1`,
                    "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.113 Safari/537.36`,
                    "Upgrade-Insecure-Requests": 1,
                    cookie:`user_trace_token=20200421211849-c9968f4d-3e74-4d1a-b254-a34a190e7532; LGUID=20200421211856-ebb54ca0-df49-41ab-a6b1-98db3bccbbd6; _ga=GA1.2.1300883797.1587475137; _gid=GA1.2.1400994741.1587475137; index_location_city=%E5%85%A8%E5%9B%BD; WEBTJ-ID=20200422192645-171a1a3e6aba51-0ca33c38e05f16-6373664-1327104-171a1a3e6acb12; JSESSIONID=ABAAAECAAEBABII926F2F234BF3AAD6C3277B8CF0C035DB; Hm_lvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1587452798,1587554806; X_MIDDLE_TOKEN=9cab75bc246cf99f500b3b4baad752bc; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%221719ce8573b896-0de5fa89ff321a-6373664-1327104-1719ce8573ca4f%22%2C%22%24device_id%22%3A%221719ce8573b896-0de5fa89ff321a-6373664-1327104-1719ce8573ca4f%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_referrer%22%3A%22%22%2C%22%24latest_referrer_host%22%3A%22%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%7D%7D; SEARCH_ID=45f0980dffd8418a9eb8d4cd660957f1; X_HTTP_TOKEN=33c639fadc1ae57715465578518a9a5f8079f3840c; Hm_lpvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1587556451; PRE_UTM=; PRE_HOST=localhost; PRE_SITE=http%3A%2F%2Flocalhost; PRE_LAND=http%3A%2F%2Flocalhost%3A63342%2F%25E7%2588%25AC%25E8%2599%25AB%2F%25E6%258B%2589%25E9%2592%25A9%2Fapi%2Fdata.html%3F%5Fijt%3Dc67f9voic2vs1tk9qhq6lv8ca2; LGSID=20200422203723-b72bef39-65c8-4c43-ac38-c1799dfc3995; TG-TRACK-CODE=search_code; LGRID=20200422205328-738f6a9a-bc4d-4c9e-b842-4bf2538b694a`
                },
                qs: {
                    px: "new",
                    needAddtionalResult: false,
                    isSchoolJob: 1
                },
            }, function (err, response, body) {
                let n = 0;
                let data1 = JSON.parse(body).content.positionResult.result;
                let finalData;
                fs.readFile("./data.txt", function (err, data) {
                    finalData = JSON.parse(data.toString());
                    data1.forEach((item, index) => {
                        finalData.push({
                            "序号": index + n * JSON.parse(body).content.positionResult.resultSize,
                            "类别": item.firstType,
                            "创建时间": item.createTime.split(" ")[0].split("-").join("/"),
                            "过期时间": "",
                            "工作地点": item.city + " " + item.district,
                            "公司名称": item.companyFullName,
                            "链接地址": `https://www.lagou.com/jobs/${item.positionId}.html?show=${JSON.parse(body).content.showId}`,
                            "职务名称": item.positionName,
                            "公司性质": item.industryField,
                            "职务性质": item.firstType,
                            "教育背景": item.education
                        })
                    })
                    fs.writeFile("./data.txt", JSON.stringify(finalData), {
                        flags: "w"
                    }, function (err) {
                        console.log("写入成功",finalData.length);
                        res.send(JSON.stringify(finalData));
                    })

                })
            }
        )
    }
}