const xlsx = require('xlsx');
const fs = require('fs');

let writeToExcel = ( data = []) => {
    let ss = xlsx.utils.json_to_sheet(data); //通过工具将json转表对象
    let keys = Object.keys(ss).sort(); //排序 [需要注意，必须从A1开始]
    let ref = 'A1:' + keys[keys.length-1][0]+(data.length+1); //这个是定义一个字符串 也就是表的范围
    let workbook = { //定义操作文档
        SheetNames: ['Sheet1'], //定义表明
        Sheets: {
            'Sheet1': Object.assign({}, ss, {
                '!ref': ref
            }) //表对象[注意表明]
        },
    }
    xlsx.writeFile(workbook, `./${new Date().getTime()}.xls`); //将数据写入文件
}
module.exports = writeToExcel;
// fs.readFile("./data.txt",function (err,data) {
//     if(err){
//         throw err;
//     }
//     let finalData = JSON.parse(data.toString());
//     writeToExcel(finalData);
// })