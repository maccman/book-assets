(function($){

var getUrl = function(object){
  if (!(object && object.url)) return null;
  return $.isFunction(object.url) ? object.url() : object.url;
};

var methodMap = {
  "create": "POST",
  "update": "PUT",
  "delete": "DELETE",
  "read"  : "GET"
};

var urlError = function() {
  throw new Error("A 'url' property or function must be specified");
};

var ajaxSync = function(method, record){
  var params = {
    type:          methodMap[method];,
    contentType:  "application/json",
    dataType:     "json",
    processData:  false
  };
  
  params.url = getUrl(record) || throw("Invalid URL");
  
  if (record && (method == "create" || method == "update"))
    params.data = JSON.stringify(record);

  params.error = function(e){
    if (record) record.trigger("error", e);
  };
  
  $.ajax(params);
};


Spine.Model.Ajax = {
  extended: function(){
    this.sync(ajaxSync);
    this.fetch(this.proxy(function(e){
      ajaxSync(e, "read", this);
    }));
    
    this.include({
      url: function(){
        var base = getUrl(this.parent);
        base += (base.charAt(base.length - 1) == "/" ? "" : "/");
        base += encodeURIComponent(this.id);
        return base;        
      }
    })
  },
  
  url: function() {
    return "/" + this.name + "s"
  }
};

})(jQuery);