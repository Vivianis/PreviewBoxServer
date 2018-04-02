function Line(startX, startY, endX, endY) {
    this.name = 'line';
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
};

function ElementsSet(lines) {
    this.lines = lines;
};

module.exports = {
    Line: Line,
    ElementsSet: ElementsSet
};
