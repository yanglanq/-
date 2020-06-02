const xlsx = require('node-xlsx')
const fs=require('fs');

let data = xlsx.parse("../file/1.xlsx");
let reg = /】\S+((公司)|(集团)|(学校)|(事务所)|(服务中心))/g
for (let i = 0; i < data.length; i++) {
    console.log(data[i].name)
    for (let j = 0; j < data[i].data.length; j++) {
        if (i>=7){
            if(data[i].data[j]&&data[i].data[j][0]&&data[i].data[j][0].match(reg)){
                let str = data[i].data[j][0].match(reg)[0].split("】")[1];
                data[i].data[j][3] = str;
                console.log(data[i].name,j,data[i].data[j][3]);
            }
        }else {
            if(data[i].data[j]&&data[i].data[j][2]&&data[i].data[j][2].match(reg)){
                let str = data[i].data[j][2].match(reg)[0].split("】")[1];
                data[i].data[j][12] = str;
                console.log(data[i].name,j,data[i].data[j][12]);
            }
        }
    }
}
let buffer = xlsx.build(data);
fs.writeFile("../file/result.xlsx", buffer, function(err){
    if (err) {
        console.log(err);
        return ;
    }
});
