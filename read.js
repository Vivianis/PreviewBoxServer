'use strict';

var picture = require('./picture');
var fs = require('fs');

//文件解析
function analyseFile() {
    fs.readFile('./MyDesign2.SCH', 'ascii', function (err, data) {
        if (err) throw err;
        var elementsSet = pickUpElements(data);
        fs.writeFile('./outputFile.json', JSON.stringify(elementsSet), function (err) {
            if (err) throw err;
            console.log('文件写入成功');
        });
    });
}

//提取图形信息
function pickUpElements(data) {
    var elementsSet = new picture.ElementsSet([], 0, [], 0);
    var symbol;
    var i = data.search(/\(sheet/);
    var refSite;
    while (i < data.length) {
        var k = data.slice(i).search(/\(symbol |\(line/);
        if (k != -1) {
            i = i + k;
            if (data[i + 1] == "s") {
                symbol = pickUpSymbol(data, i);
                if (symbol.name.name.search(/HEADER/) != -1) {
                    elementsSet.nHeaders[elementsSet.nHeadersNum++] = symbol;
                }
                else {
                    console.log('not return a header');
                }
            }
            else {
                symbol = pickUpLine(data, i);
                elementsSet.lines[elementsSet.linesNum++] = symbol;
            }
            i++;
        } else break;
    }
    console.log(elementsSet);
    return elementsSet;
}

//提取“symbol”信息
function pickUpSymbol(data, symbolSite) {
    var symbolName;
    var i = 0, j, k = 0, m, n;
    i = symbolSite + data.slice(symbolSite).search(/"/);
    j = i + 1 + data.slice(i + 1).search(/"/);
    symbolName = data.slice(i + 1, j);
    var searchString = new RegExp("symbolDef \"" + symbolName + "\"");
    m = data.search(searchString);
    if ((symbolName.search(/HEADER/)) != -1) {
        var nHeader = pickUpNHeader(data, symbolName, symbolSite, m);
        return nHeader;
    }
    else {
        console.log('not header');
    }
}

//提取“line”信息
function pickUpLine(data, lineSite) {
    var i, j;
    var line;
    i = lineSite + data.slice(lineSite).search(/ /);
    j = i + 1 + data.slice(i + 1).search(/ /);
    var startX = Number(data.slice(i + 1, j));
    i = j;
    j = i + data.slice(i).search(/\)/);
    var startY = Number(data.slice(i + 1, j));
    i = j + data.slice(j).search(/ /);
    j = i + 1 + data.slice(i + 1).search(/ /);
    var endX = Number(data.slice(i + 1, j));
    i = j;
    j = i + data.slice(i).search(/\)/);
    var endY = Number(data.slice(i + 1, j));
    line = new picture.Line(startX, startY, endX, endY);
    return line;
}

//提取“pin”信息
function pickUpPin(data, pinSite) {
    var pinNum = 0, footX, footY, rotation, length;
    var pinNumX, pinNumY;
    var i, j;
    i = pinSite + data.slice(pinSite).search(/pt/) + 3;
    j = i + data.slice(i).search(/ /);
    footX = Number(data.slice(i, j));
    i = j;
    j = i + data.slice(i).search(/\)/);
    footY = Number(data.slice(i + 1, j));
    i = j + data.slice(j).search(/rotation/) + 9;
    j = i + data.slice(i).search(/\)/);
    rotation = Number(data.slice(i, j));
    i = j + data.slice(j).search(/pinLength/) + 10;
    j = i + data.slice(i).search(/\)/);
    length = Number(data.slice(i, j));
    i = j + data.slice(j).search(/pinName/);
    i = i + data.slice(i).search(/pt/) + 3;
    j = i + data.slice(i).search(/ /);
    pinNumX = Number(data.slice(i, j));
    i = j;
    j = i + data.slice(i).search(/\)/);
    pinNumY = Number(data.slice(i + 1, j));
    i = j + data.slice(j).search(/"/) + 1;
    j = i + data.slice(i).search(/"/);
    pinNum = data.slice(i, j);
    var pin = new picture.Pin(pinNum, pinNumX, pinNumY, footX, footY, rotation, length);
    return pin;
}

//提取“Header”信息
function pickUpNHeader(data, symbolName, symbolSite, refSite) {
    var headerX, headerY, refDesX, refDesY, nameX, nameY;
    var headerRotation;
    var lines = [], linesNum = 0;
    var pins = [], pinsNum = 0;
    var i, j;
    i = symbolSite + data.slice(symbolSite).search(/pt/) + 3;
    j = i + data.slice(i).search(/ /);
    headerX = Number(data.slice(i, j));
    i = j + 1;
    j = i + data.slice(i).search(/\)/);
    headerY = Number(data.slice(i, j));
    i = i + data.slice(i).search(/rotation/) + 9;
    j = i + data.slice(i).search(/\)/);
    headerRotation = Number(data.slice(i, j));
    i = j + data.slice(j).search(/pt/) + 3;
    j = i + data.slice(i).search(/ /);
    refDesX = Number(data.slice(i, j));
    i = j;
    j = i + data.slice(i).search(/\)/);
    refDesY = Number(data.slice(i + 1, j));
    i = j + data.slice(j).search(/pt/) + 3;
    j = i + data.slice(i).search(/ /);
    nameX = Number(data.slice(i, j));
    i = j;
    j = i + data.slice(i).search(/\)/);
    nameY = Number(data.slice(i + 1, j));
    var refEnd = refSite + 1 + data.slice(refSite + 1).search(/\(symbolDef|\(compDef/);
    i = refSite;
    while (i < refEnd) {
        i = i + data.slice(i).search(/pin |line/);
        if (i < refEnd) {
            if (data[i] == 'p') {
                pins[pinsNum++] = pickUpPin(data, i);
            }
            else if (data[i] == 'l') {
                lines[linesNum++] = pickUpLine(data, i);
            }
            i++;
        }
    }
    var nHeader = new picture.NHeader(symbolName, nameX, nameY, refDesX, refDesY, headerX, headerY, headerRotation, lines, pins);
    return nHeader;
}

module.exports = { analyseFile: analyseFile };