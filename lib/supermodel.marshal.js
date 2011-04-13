//= require <supermodel>

SuperClass.Marshaler = new SuperClass;

SuperClass.Marshaler.extend({
  records: [],
  saveAll: function(){
    for(var i in this.records)
      this.records[i].save();
  },
  
  loadAll: function(){
    for(var i in this.records)
      this.records[i].load();
  }
})

SuperClass.Marshaler.include({  
  init: function(key, getFunc, setFunc){
    this.key     = key;
    this.getFunc = getFunc;
    this.setFunc = setFunc;
    this._class.records.push(this);
  },
  
  remove: function(){
    localStorage.removeItem(this.key);
  },
  
  save: function(){
    var value = JSON.stringify(this.getFunc());
    if (typeof value == "undefined") return;
    localStorage.setItem(this.key, value);
  },
  
  load: function(){
    var value = localStorage.getItem(this.key);
    if (!value) return;
    value = JSON.parse(value);
    this.setFunc(value);
  }
});

SuperClass.marshal = function(base, getFunc, setFunc, key){
  if (!key) {
    key = (typeof getFunc == "string") ? getFunc : base;
    key = "sm-" + key;
  }
  
  if (!setFunc) setFunc = getFunc;

  if (typeof getFunc == "string") {
    var getAttribute = getFunc;
    getFunc = function(){ return base[getAttribute]; };
  }
      
  if (typeof setFunc == "string") {
    var setAttibute  = setFunc;
    setFunc = function(v){ base[setAttibute] = v; };
  }
  
  var marshal = new SuperClass.Marshaler(key, getFunc, setFunc);
  marshal.load();
  return marshal;
};

SuperModel.Marshal = {  
  extended: function(base){
    var key = "sm-" + base.className;
    
    var getFunc = function(){
      return base.serializeRecords();
    };
    
    var setFunc = function(value){
      var records = {}
      for (var key in value) {
        records[key] = new base(value[key]);
        records[key].newRecord = false;
      }
      base.records = records;
    };
    
    var marshal = new SuperClass.Marshaler(
      key, getFunc, setFunc
    );
    marshal.load();
    base.afterSave(function(){
      marshal.save();
    });
  }
};

SuperClass.marshalEnabled = true;

jQuery(window).unload(function(){
  if (SuperClass.marshalEnabled) {
    SuperClass.Marshaler.saveAll();
  } else {
    localStorage.clear()
  }
});