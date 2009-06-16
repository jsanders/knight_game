Event.observe(window, 'load', function() { 
  setHandlerForLegalMoves($('knight').parentNode);
});

function move(event) {
  var element = event.element();

  element.removeClassName('unvisited');
  element.addClassName('visited');
  element.appendChild($('knight'));

  LEGAL_MOVES.each(function(item) { $(item).stopObserving('click'); });
  
  setHandlerForLegalMoves(element);

  if($$('.unvisited').length == 0) {
    $('announcements').innerHTML = 'You win!';
  }
}

function setHandlerForLegalMoves(element) {
  legalMoves(element).each(function(item) {
    console.log('observing ' + item);
    $(item).observe('click', move);
  });
}

function legalMoves(cell) {
  LEGAL_MOVES = 
    [ cell.id.offset(1, 2), cell.id.offset(2, 1),
      cell.id.offset(-1, 2), cell.id.offset(-2, 1),
      cell.id.offset(-1, -2), cell.id.offset(-2, -1),
      cell.id.offset(1, -2), cell.id.offset(2, -1)
    ].compact().reject(function(item) { return $(item).hasClassName('unvisitable') });
  return LEGAL_MOVES;
}

var COLS = 3;
var ROWS = 3;
var LEGAL_MOVES = [];

String.prototype.offset = function(x, y) {
  var idCol = parseInt(this[1]) + x;
  var idRow = parseInt(this[2]) + y;

  if(idCol > COLS || idRow > ROWS || idCol < 1 || idRow < 1) {
    return null;
  } else {
    return '_' + idCol + idRow;
  }
}
