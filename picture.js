function Line(startX, startY, endX, endY) {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
}

function Pin(name, nameX, nameY, nameDisplay, des, desX, desY, desDisplay, outsideEdge, siteX, siteY, rotation, length) {
    this.nameMsg = { name, nameX, nameY, nameDisplay };
    this.desMsg = { des, desX, desY, desDisplay };
    this.outsideEdge = outsideEdge;
    this.footSite = { siteX, siteY };
    this.rotation = rotation;
    this.length = length;
}

function Arc(oX, oY, radius, startAngle, sweepAngle, width) {
    this.oX = oX;
    this.oY = oY;
    this.radius = radius;
    this.startAngle = startAngle;
    this.sweepAngle = sweepAngle;
    this.width = width;
}

function Text(siteX, siteY, content, rotation) {
    this.site = { siteX, siteY };
    this.content = content;
    this.rotation = rotation;
}

function Symbol(name, nameX, nameY, refDes, refDesX, refDesY, siteX, siteY, rotation, lines, pins, arcs, texts) {
    this.nameMsg = { name, nameX, nameY };
    this.refDesMsg = { refDes, refDesX, refDesY };
    this.site = { siteX, siteY };
    this.rotation = rotation;
    this.lines = lines;
    this.pins = pins;
    this.arcs = arcs;
    this.texts = texts;
}

function ElementsSet(lines, linesNum, symbols, symbolsNum) {
    this.linesMsg = { lines, linesNum };
    this.symbolsMsg = { symbols, symbolsNum };
}

module.exports = {
    Line: Line,
    Pin: Pin,
    Arc: Arc,
    Text: Text,
    Symbol: Symbol,
    ElementsSet: ElementsSet
}
