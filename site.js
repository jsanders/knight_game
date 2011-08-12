var COLS = 3;
var ROWS = 3;
var LEGAL_MOVES = [];
var save;
var freshBoard;


Event.observe(window, 'load', function() { 
  $('regenerate').observe('click', setupGame);
  $('restart').observe('click', function() {restoreState(freshBoard)});
  $('save').observe('click', function() {save = saveState()});
  $('load').observe('click', function() {restoreState(save)});
  setupGame();
});

function setupGame() {
  generateBoard();
  generateGame();
  setHandlerForLegalMoves();
  save = freshBoard = saveState();
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
         ].compact().reject(function(item) {
           return ($(item).hasClassName('visited'));
         });
}

function legalMoves(cell) {
  LEGAL_MOVES = legalMovesForGeneration(cell).select(function(item) {
    return ($(item).hasClassName('unvisited')); 
  });
  return LEGAL_MOVES;
}

String.prototype.col = function() {
  return parseInt(this.slice(this.indexOf('_') + 1, this.lastIndexOf('_')));
}

String.prototype.row = function() {
  return parseInt(this.slice(this.lastIndexOf('_') + 1));
}

String.prototype.offset = function(x, y) {
  var idCol = this.col() + x;
  var idRow = this.row() + y;

  if(idCol > COLS || idRow > ROWS || idCol < 1 || idRow < 1) {
    return null;
  } else {
    return '_' + idCol + '_' + idRow;
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
      cell.writeAttribute('id', '_' + colNum + '_' + rowNum);

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
  do {
    var startCell = $('_' + rand(COLS) + '_' + rand(ROWS));
  } while(legalMovesForGeneration(startCell).length == 0);

  var knight = $(document.createElement('img'));
  
  startCell.addClassName('visited');

  knight.writeAttribute('src', 'black_knight.png');
  knight.writeAttribute('id', 'knight');
  startCell.insert( { top: knight } );

  findNextCell(startCell, 1);
  setHandlerForLegalMoves($('knight').parentNode);
}

function findNextCell(cell, alreadyFound) {
  if( alreadyFound > (ROWS * COLS) * (5.0 / 8.0) || legalMovesForGeneration(cell).length == 0) {
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

function saveState() {
  return {
    visited: $$('.visited'),
    current: $('knight').parentNode
  }
}

function restoreState(state) {
  if (!state) return;

  var knight = $('knight');
  $$('.visited').each(function(cell){ cell.removeClassName('visited'); cell.addClassName('unvisited')})
  state['visited'].each(function(cell) { cell.addClassName('visited') });
  state['current'].appendChild(knight);
  LEGAL_MOVES.each(function(item) { $(item).stopObserving('click'); });
  setHandlerForLegalMoves(knight.parentNode)
}

function rand(max) {
  return Math.floor(Math.random() * max + 1);
}
