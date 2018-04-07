function Line(startX, startY, endX, endY) {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
}

function Pin(name, nameX, nameY, outsideEdge, siteX, siteY, rotation, length) {
    this.nameMsg = { name, nameX, nameY };
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

function Symbol(name, nameX, nameY, refDes, refDesX, refDesY, siteX, siteY, rotation, lines, pins, arcs) {
    this.nameMsg = { name, nameX, nameY };
    this.refDesMsg = { refDes, refDesX, refDesY };
    this.site = { siteX, siteY };
    this.rotation = rotation;
    this.lines = lines;
    this.pins = pins;
    this.arcs = arcs;
}

function ElementsSet(lines, linesNum, symbols, symbolsNum) {
    this.linesMsg = { lines, linesNum };
    this.symbolsMsg = { symbols, symbolsNum };
}

module.exports = {
    Line: Line,
    Pin: Pin,
    Arc: Arc,
    Symbol: Symbol,
    ElementsSet: ElementsSet
}
