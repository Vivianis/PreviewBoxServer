'use strict';

var picture = require('./picture');
var fs = require('fs');

//文件解析
function analyseFile() {
    fs.readFile('./MyDesign.SCH', 'ascii', function (err, data) {
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
    var element;
    var i = data.search(/\(sheet/);
    var refSite;
    while (i < data.length) {
        var k = data.slice(i).search(/\(symbol |\(line/);
        if (k != -1) {
            i = i + k;
            if (data[i + 1] == "s") {
                element = pickUpSymbol(data, i);
                elementsSet.symbolsMsg.symbols[elementsSet.symbolsMsg.symbolsNum++] = element;
            }
            else {
                element = pickUpLine(data, i);
                elementsSet.linesMsg.lines[elementsSet.linesMsg.linesNum++] = element;
            }
            i++;
        } else break;
    }
    console.log(elementsSet);
    return elementsSet;
}

//提取“symbol”信息
function pickUpSymbol(data, symbolSite) {
    var name;
    var i = 0, j, k = 0;
    i = symbolSite + data.slice(symbolSite).search(/"/);
    j = i + 1 + data.slice(i + 1).search(/"/);
    name = data.slice(i + 1, j);
    var searchString = new RegExp("symbolDef \"" + name + "\"");
    var refSite = data.search(searchString);

    var siteX, siteY, refDes, refDesX, refDesY, rotation, nameX, nameY;
    var lines = [], linesNum = 0;
    var pins = [], pinsNum = 0;
    var arcs = [], arcsNum = 0;
    var i, j;
    i = symbolSite + data.slice(symbolSite).search(/refDesRef/) + 11;
    j = i + data.slice(i).search(/"/);
    refDes = data.slice(i, j);
    i = j + data.slice(j).search(/pt/) + 3;
    j = i + data.slice(i).search(/ /);
    siteX = Number(data.slice(i, j));
    i = j + 1;
    j = i + data.slice(i).search(/\)/);
    siteY = Number(data.slice(i, j));
    i = i + data.slice(i).search(/rotation/) + 9;
    j = i + data.slice(i).search(/\)/);
    rotation = Number(data.slice(i, j));
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
        i = i + data.slice(i).search(/\(pin |\(line|\(arc/);
        if (i < refEnd) {
            if (data[i + 1] == 'p') {
                pins[pinsNum++] = pickUpPin(data, i);
            }
            else if (data[i + 1] == 'l') {
                lines[linesNum++] = pickUpLine(data, i);
            }
            else if (data[i + 1] == 'a') {
                arcs[arcsNum++] = pickUpArc(data, i);
            }
            i++;
        }
    }
    var symbol = new picture.Symbol(name, nameX, nameY, refDes, refDesX, refDesY, siteX, siteY, rotation, lines, pins, arcs);
    return symbol;
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
    var name, nameX, nameY, outsideEdge, siteX, siteY, rotation, length;
    var i, j;
    i = pinSite + data.slice(pinSite).search(/pt/) + 3;
    j = i + data.slice(i).search(/ /);
    siteX = Number(data.slice(i, j));
    i = j;
    j = i + data.slice(i).search(/\)/);
    siteY = Number(data.slice(i + 1, j));
    i = j + data.slice(j).search(/rotation/) + 9;
    j = i + data.slice(i).search(/\)/);
    rotation = Number(data.slice(i, j));
    i = j + data.slice(j).search(/pinLength/) + 10;
    j = i + data.slice(i).search(/\)/);
    length = Number(data.slice(i, j));
    i = j + data.slice(j).search(/pinName/);
    var k = data.slice(j, i).search(/outsideEdgeStyle/);
    if ((k != -1) && (data.slice(j + k, j + k + 20) == "outsideEdgeStyle Dot")) {
        outsideEdge = "Dot";
    }
    else {
        outsideEdge = "";
    }
    i = i + data.slice(i).search(/pt/) + 3;
    j = i + data.slice(i).search(/ /);
    nameX = Number(data.slice(i, j));
    i = j;
    j = i + data.slice(i).search(/\)/);
    nameY = Number(data.slice(i + 1, j));
    i = j + data.slice(j).search(/"/) + 1;
    j = i + data.slice(i).search(/"/);
    name = data.slice(i, j);
    var pin = new picture.Pin(name, nameX, nameY, outsideEdge, siteX, siteY, rotation, length);
    return pin;
}

function pickUpArc(data, arcSite) {
    var oX, oY, radius, startAngle, sweepAngle, width;
    var i, j;
    i = arcSite + data.slice(arcSite).search(/pt/) + 3;
    j = i + data.slice(i).search(/ /);
    oX = Number(data.slice(i, j));
    i = j;
    j = i + data.slice(i).search(/\)/);
    oY = Number(data.slice(i + 1, j));
    i = j + data.slice(j).search(/radius/) + 7;
    j = i + data.slice(i).search(/\)/);
    radius = Number(data.slice(i, j));
    i = j + data.slice(j).search(/startAngle/) + 11;
    j = i + data.slice(i).search(/\)/);
    startAngle = Number(data.slice(i, j));
    i = j + data.slice(j).search(/sweepAngle/) + 11;
    j = i + data.slice(i).search(/\)/);
    sweepAngle = Number(data.slice(i, j));
    i = j + data.slice(j).search(/width/) + 6;
    j = i + data.slice(i).search(/\)/);
    width = Number(data.slice(i, j));
    var arc = new picture.Arc(oX, oY, radius, startAngle, sweepAngle, width);
    return arc;
}
module.exports = { analyseFile: analyseFile };