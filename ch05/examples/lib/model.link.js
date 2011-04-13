Model.extend({
  extended: function() {
    this.subscribe("create update destroy", this.proxy(function(e, record){
      this.publish("change", record);
    }));
  },
  
  change: function(callback){
    if (typeof callback == "function")
      this.subscribe("change", callback);
    else
      this.publish("change", callback);
  }
});

Model.include({
  change: function(callback){
    if (typeof callback == "function")
      this.parent.change(this.proxy(function(e, record){
        if (this.eql(record)) callback(record);
      }));
    else
      this.parent.change(this);
  }
});