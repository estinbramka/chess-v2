class Cell {
    constructor(pos, piece) {
        this.pos = pos;
        this.piece = piece;
    }
}
//  returns an array of range 1, n
const range = (n) => {
    return Array.from({ length: n }, (_, i) => i + 1);
};

/**
 *
 * @param {String} fenString rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
 * @returns {Cell[]}
 */
export const createBoard = (fenString, pov) => {
    const fen = fenString.split(' ')[0]; //Get the first portion

    const fenPieces = fen.split('/').join(''); //remove the row delimiters '/'
    //rnbqkbnrpppppppp8888PPPPPPPPRNBQKBNR
    let pieces
    if (pov === 'black') {
        pieces = Array.from(fenPieces).reverse();
    } else if (pov === 'white') {
        pieces = Array.from(fenPieces);
    }

    //Save individual pieces for each of the 64 cells
    Array.from(fenPieces).forEach((item, index) => {
        if (isFinite(item)) {
            pieces.splice(index, 1, range(item).fill(''));
        }
    });
    pieces = pieces.flat();
    for (let i = 0; i < pieces.length; i++) {
        if (pieces[i] === pieces[i].toLowerCase() && pieces[i] !== '') {
            pieces[i] = 'b' + pieces[i];
        } else if (pieces[i] === pieces[i].toUpperCase() && pieces[i] !== '') {
            pieces[i] = 'w' + pieces[i].toLowerCase();
        }
    }

    const rows = range(8)
        .map((n) => n.toString())
        .reverse(); //["8", "7", "6", "5", "4", "3", "2", "1"]

    const columns = range(8)
        .map((n) => n.toString());

    const cells = []; //[a1, b1, c1..., h8]
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        for (let j = 0; j < columns.length; j++) {
            const col = columns[j];
            cells.push(col + row); //e.g a1, b1, c1...
        }
    }
    const board = [];
    for (let i = 0; i < cells.length; i++) {
        //'cells', and 'pieces' have the same length of 64
        const cell = cells[i];
        const piece = pieces[i];
        board.push(new Cell(cell, piece));
    }

    return board;
};

//console.log(createBoard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'));