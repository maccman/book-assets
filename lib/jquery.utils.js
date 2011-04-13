(function($){
  $.fn.serializeForm = function(){
    var result = {};
    $.each($(this).serializeArray(), function(i, item){
      result[item.name] = item.value;
    });
    return result;
  };
  
  $.fn.reload = function(){
    if (!this.selector) throw "No selector";
    return $(this.selector);
  };
})(jQuery);