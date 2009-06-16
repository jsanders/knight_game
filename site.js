var COLS = 3;
var ROWS = 3;
var LEGAL_MOVES = [];

Event.observe(window, 'load', function() { 
  setupGame();
});

function setupGame() {
  generateBoard();
  generateGame();
  setHandlerForLegalMoves();
}

function move(event) {
  var element = event.element();

  element.removeClassName('unvisited');
  element.addClassName('visited');
  element.appendChild($('knight'));

  LEGAL_MOVES.each(function(item) { $(item).stopObserving('click'); });
  
  setHandlerForLegalMoves(element);

  if($$('.unvisited').length == 0) {
    ROWS++;
    COLS++;
    setupGame();
  }
}

function setHandlerForLegalMoves(element) {
  var element = $('knight').parentNode
  legalMoves(element).each(function(item) {
    $(item).observe('click', move);
  });
}

function legalMovesForGeneration(cell) {
  return [ cell.id.offset(1, 2), cell.id.offset(2, 1),
           cell.id.offset(-1, 2), cell.id.offset(-2, 1),
           cell.id.offset(-1, -2), cell.id.offset(-2, -1),
           cell.id.offset(1, -2), cell.id.offset(2, -1)
         ].compact();
}

function legalMoves(cell) {
  LEGAL_MOVES = legalMovesForGeneration(cell).select(function(item) {
    return ($(item).hasClassName('visited') || $(item).hasClassName('unvisited')); 
  });
  return LEGAL_MOVES;
}

String.prototype.offset = function(x, y) {
  var idCol = parseInt(this[1]) + x;
  var idRow = parseInt(this[2]) + y;

  if(idCol > COLS || idRow > ROWS || idCol < 1 || idRow < 1) {
    return null;
  } else {
    return '_' + idCol + idRow;
  }
}

function generateBoard() {
  $$('.row').invoke('remove');
  ROWS.times(function(j) {
    var rowNum = j + 1;
    var row = $(document.createElement('div'));
    row.addClassName('row');
    row.writeAttribute('id', 'row' + rowNum);

    COLS.times(function(i) {
      var colNum = i + 1;
      var cell = $(document.createElement('div'));
      cell.addClassName('cell');
      cell.writeAttribute('id', '_' + colNum + rowNum);

      if(colNum == 1) cell.addClassName('first');
      if(colNum == COLS) cell.addClassName('last');
      if(rowNum == 1) cell.addClassName('bottom');
      if(rowNum == ROWS) cell.addClassName('top');

      row.appendChild(cell);
    });
    $('board').insert( { top: row } );
  });
}

function generateGame() {
  var startCell = $('_' + rand(COLS) + rand(ROWS));
  var knight = $(document.createElement('img'));
  
  startCell.addClassName('visited');

  knight.writeAttribute('src', 'black_knight.png');
  knight.writeAttribute('id', 'knight');
  startCell.insert( { top: knight } );

  findNextCell(startCell, 1);
  setHandlerForLegalMoves($('knight').parentNode);
}

function findNextCell(cell, alreadyFound) {
  if( alreadyFound > (ROWS * COLS) * (5.0 / 8.0) ) {
    return;
  } else {
    var moves = legalMovesForGeneration(cell);
    var nextCell = $(moves[ rand(moves.length) - 1 ]);

    if(nextCell.hasClassName('unvisited') || nextCell.hasClassName('visited')) {
      findNextCell(nextCell, alreadyFound);
    } else {
      nextCell.addClassName('unvisited');
      findNextCell(nextCell, alreadyFound + 1);
    }
  }
}

function rand(max) {
  return Math.floor(Math.random() * max + 1);
}
