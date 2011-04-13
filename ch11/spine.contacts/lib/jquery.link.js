// 
// JLink does two things:
//  * adds a 'change' callback onto standard objects
//  * add a utility function to bind up jQuery elements and objects
// 
// var object  = {
//   name: "Test Name"
// };
//       
// $("#user").link(object, function(e, data){
//   $(this).empty();
//   $(this).append($("#userTmpl").tmpl(data));  
// });
// 
// object.change();

(function($){
  
  var checkChange = function(ob){
    if ("change" in ob && typeof ob.change != "function")
      throw("change is already defined in " + ob);
    return( !!ob.change );
  }
  
  $.addChange = function(ob){
    if (checkChange(ob)) return;
    
    ob.change = function(callback){
      if (callback) {
        if ( !this._change ) this._change = [];
        this._change.push(callback);
      } else {
        if ( !this._change ) return;
        for (var i=0; i < this._change.length; i++)
          this._change[i].apply(this);
      }
    };    
  };
  
  $.fn.link = $.fn.jlink = function(object, callback){
    var element = $(this);
    
    if ( !object )
      throw("You must provide an object")
    
    $.addChange(object);
    
    object.change(function(){
      element.trigger("render", this); 
    });
    
    if ( callback )
      element.bind("render", callback);
    
    return element;
  };
  
  $.fn.render = function(callback) {
    callback ? this.bind("render", callback) : this.trigger("render");
  };
  
  $.fn.item = function(){
    var item = $(this).tmplItem().data;
    if (typeof item.reload == "function")
      item = item.reload();
    return item;
  };
})(jQuery);