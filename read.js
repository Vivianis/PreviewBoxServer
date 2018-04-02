'use strict';

var picture = require('./picture');
var fs = require('fs');

function analyseFile() {
    fs.readFile('MyDesign1.SCH', 'ascii', function (err, data) {
        if (err) throw err;
        var elementsSet = dealWithFile(data);
        fs.writeFile('./outputFile.json', JSON.stringify(elementsSet), function (err) {
            if (err) throw err;
            console.log('文件写入成功');
        });
    });
}
analyseFile();
//文件解析器
function dealWithFile(data) {
    var selectedData = pickUpMessage(data);
    var lines = selectLines(selectedData);
    var elementsSet = new picture.ElementsSet(lines);
    return elementsSet;
}

//提取文件图像信息
function pickUpMessage(data) {
    var i = data.search(/\(sheet/);
    var j = data.search(/\(programState/);
    var message = data.slice(i, j - 1);
    return message;
}

//图像信息处理
function selectLines(data) {
    var i = 0, j;
    var lineNum = 0;
    var lines = [];
    while (data.slice(i).search(/\(line/) != -1) {
        i = i + data.slice(i).search(/\(line/);
        i = i + data.slice(i).search(/ /);
        j = i + 1 + data.slice(i + 1).search(/ /);
        var startX = Number(data.slice(i + 1, j));
        i = j;
        j = j + data.slice(j).search(/\)/);
        var startY = Number(data.slice(i + 1, j));
        i = j + data.slice(j).search(/ /);
        j = i + 1 + data.slice(i + 1).search(/ /);
        var endX = Number(data.slice(i + 1, j));
        i = j;
        j = j + data.slice(j).search(/\)/);
        var endY = Number(data.slice(i + 1, j));
        lines[lineNum++] = new picture.Line(startX, startY, endX, endY);
    }
    return lines;
}
module.exports = { analyseFile: analyseFile };