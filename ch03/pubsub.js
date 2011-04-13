var PubSub = {
  setup: function(){
    this.o = jQuery({});
  },
  
  subscribe: function() {
    this.o.bind.apply( this.o, arguments );
  },
  
  publish: function() {
    this.o.trigger.apply( this.o, arguments );
  }
};