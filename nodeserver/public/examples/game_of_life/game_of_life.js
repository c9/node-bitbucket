var stepTime = 1;
var col = undefined;

var Cell = Backbone.Model.extend({
  x: -1,
  y: -1,
  alive: false,
  nextAlive: false,

  initialize: function() {
    this.id = this.get('x')+","+this.get('y');
  },

  computeNextState: function(){
    var na = col.neighbors(this);

    if(this.get('alive')){
      if(na == 2 || na == 3){
        this.set({'nextAlive': true})
      } else {
        this.set({'nextAlive': false})
      }
    }else{
      if(na == 3){
        this.set({'nextAlive': true})
      } else {
        this.set({'nextAlive': false})
      }
    }
  },

  transition: function(){
    this.set({'alive': this.get('nextAlive')});
  }
});

var CellView = Backbone.View.extend({
  tagName: 'td',
  initialize: function() {
    this.model.bind('change:alive', _.bind(this.reRender, this));
  },
  render: function(){
    $(this.el).attr({'width': 6, 'height': 4});
    this.reRender();
  },
  reRender: function(){
    $(this.el).attr({'bgcolor': this.model.get('alive') ? '#000' : '#FFF'});
  }
});

var CellCollection = Backbone.Collection.extend({
  model: Cell,
  neighbors: function(model){
    var ns = 0;

    _([-1,0,1]).each(function(xd) {
      _([-1,0,1]).each(function(yd) {
        if(xd == 0 && yd == 0){
        } else {
          n = col.get((model.get('x')+xd)+","+(model.get('y')+yd))
          if (n && n.get('alive')) {
            ns ++;
          }
        }
      });
    });
    return ns;
  }
});

function stepGame(){
  col.each( function(e){
    e.computeNextState();
  });
  col.each( function(e){
    e.transition();
  });
  setTimeout("stepGame()", stepTime);
}

$(function(){
  var models = new Array();
  var trs = $(document.createElement('tbody'));
  for(var x=0; x< 100; x++){
    var tr = $(document.createElement('tr'));
    for(var y=0; y<100; y++){
      var alive = (Math.floor(Math.random() * 100) % 2) == 1;
      var cell = new Cell({'x': x, 'y': y, 'alive': alive});
      models.push(cell);
      var cv = new CellView({model: cell});
      cv.render();
      tr.append(cv.el);
    }
    trs.append(tr)
  }
  $('#world').html(trs)
  col = new CellCollection(models);

  setTimeout("stepGame()", stepTime);
});