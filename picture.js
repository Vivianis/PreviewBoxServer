function Line(startX, startY, endX, endY) {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
};

function Pin(pinNum, pinNumX, pinNumY, footX, footY, rotation, length) {
    this.pinNum = { pinNum, pinNumX, pinNumY };
    this.outsideRadius = 25;
    this.footX = footX;
    this.footY = footY;
    this.rotation = rotation;
    this.length = length;
};

function NHeader(name, nameX, nameY, refDesX, refDesY, headerX, headerY, headerRotation, lines, pins) {
    this.name = { name, nameX, nameY };
    this.refDes = { refDesX, refDesY };
    this.headerX = headerX;
    this.headerY = headerY;
    this.headerRotation = headerRotation;
    this.lines = lines;
    this.pins = pins;
}

function ElementsSet(lines, linesNum, nHeaders, nHeadersNum) {
    this.lines = lines;
    this.linesNum = linesNum;
    this.nHeaders = nHeaders;
    this.nHeadersNum = nHeadersNum;
};

module.exports = {
    Line: Line,
    Pin: Pin,
    NHeader: NHeader,
    ElementsSet: ElementsSet
};
