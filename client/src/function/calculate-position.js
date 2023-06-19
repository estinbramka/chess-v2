function getPosRelativetoParentinTransPer(parent, xClient, yClient) {
    let bounds = parent.getBoundingClientRect();
    //let elmntDim = elmnt.getBoundingClientRect();
    //let x = e.clientX - bounds.left - (elmntDim.width / 2);
    //let y = e.clientY - bounds.top - (elmntDim.height / 2);
    let xPer = (xClient - bounds.left) / bounds.width;
    let yPer = (yClient - bounds.top) / bounds.height;
    //if (xPer <= 0) x = - (elmntDim.width / 2);
    //if (xPer >= 1) x = bounds.width - (elmntDim.width / 2);
    //if (yPer <= 0) y = - (elmntDim.height / 2);
    //if (yPer >= 1) y = bounds.height - (elmntDim.height / 2);
    if (xPer <= 0) xPer = 0;
    if (xPer >= 1) xPer = 1;
    if (yPer <= 0) yPer = 0;
    if (yPer >= 1) yPer = 1;
    let xTrans = 800 * xPer - 50;
    let yTrans = 800 * yPer - 50;
    return { x: xTrans, y: yTrans };
}

function getPosRelativetoParentinPer(parent, xClient, yClient) {
    let bounds = parent.getBoundingClientRect();
    let xPer = (xClient - bounds.left) / bounds.width;
    let yPer = (yClient - bounds.top) / bounds.height;
    if (xPer <= 0) xPer = 0;
    if (xPer >= 1) xPer = 1;
    if (yPer <= 0) yPer = 0;
    if (yPer >= 1) yPer = 1;
    return { x: xPer, y: yPer };
}

export function getIndexPos(parent, xClient, yClient) {
    let pos = getPosRelativetoParentinPer(parent, xClient, yClient)
    let x = pos.x;
    let y = pos.y;
    let indexY = 0;
    for (let i = 1; i <= 8; i++) {
        if (y <= i / 8 && y >= (i - 1) / 8) {
            indexY = i;
        }
    }
    indexY = Array.from({ length: 8 }, (_, i) => (i + 1)).reverse()[indexY - 1];
    let indexX = 0;
    for (let i = 1; i <= 8; i++) {
        if (x <= i / 8 && x >= (i - 1) / 8) {
            indexX = i;
        }
    }

    return { x: indexX, y: indexY };
}

export function setPiecePos(piece, parent, xClient, yClient) {
    let pos = getPosRelativetoParentinTransPer(parent, xClient, yClient);
    piece.style.zIndex = 2;
    piece.style.transform = `translate(${pos.x}%,${pos.y}%)`;
}

export function calculateMove(pieceElm, piece, parent, xClient, yClient, pov, makeMove) {
    let pos = getIndexPos(parent, xClient, yClient);
    let x = pos.x;
    let y = pos.y;
    let yAxis = Array.from({ length: 8 }, (_, i) => (i + 1));
    let xAxis = Array.from('abcdefgh');
    if (pov === 'black') {
        yAxis = yAxis.reverse();
        xAxis = xAxis.reverse();
    }
    let xPrev = parseInt(Array.from(piece.pos)[0]);
    let yPrev = parseInt(Array.from(piece.pos)[1]);
    let from = xAxis[xPrev - 1] + yAxis[yPrev - 1];
    let to = xAxis[x - 1] + yAxis[y - 1];

    makeMove(from, to, piece, pieceElm);
    //console.log(from, to, pov);
}