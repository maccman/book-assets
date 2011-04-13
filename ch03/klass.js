if (typeof Object.create !== "function")
    Object.create = function(o) {
      function F() {}
      F.prototype = o;
      return new F();
    };

var Klass = {
  init: function(){},

  prototype: {
    init: function(){}
  },

  create: function(){
    var object = Object.create(this);
    object.parent = this;
    object.init.apply(object, arguments);
    return object;
  },

  inst: function(){
    var instance = Object.create(this.prototype);
    instance.parent = this;
    instance.init.apply(instance, arguments);
    return instance;
  },
  
  proxy: function(func){
    var thisObject = this;
    return(function(){ 
      return func.apply(thisObject, arguments); 
    });
  },
  
  include: function(obj){
    var included = obj.included || obj.setup;
    
    delete obj.included;
    delete obj.extended;
    delete obj.setup;

    for(var i in obj)
      this.fn[i] = obj[i];
    if (included) included.apply(this);
  },
  
  extend: function(obj){
    var extended = obj.extended || obj.setup;
    
    delete obj.included;
    delete obj.extended;
    delete obj.setup;
    
    for(var i in obj)
      this[i] = obj[i];
    if (extended) extended.apply(this);
    delete extended;
  }
};

Klass.fn = Klass.prototype;
Klass.fn.proxy = Klass.proxy;