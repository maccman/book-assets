module("Model test", {
  setup: function(){
    this.Asset = Model.setup();
  }
});

test("load()", function(){
  var a = this.Asset.init();
  a.load({
    local: true, 
    name: "test.pdf"
  });
  
  ok(a.local, "Load sets properties");
  equals(a.name, "test.pdf", "load() sets properties (2)");
  
  var b = this.Asset.init({
    name: "test2.pdf"
  });
  
  equals(b.name, "test2.pdf", "Calls load() on instantiation");
});

test("attributes()", function(){
  this.Asset.attributes = ["name"];

  var a = this.Asset.init();
  a.name = "test.pdf";
  a.id   = 1;

  same(a.attributes(), {
    name: "test.pdf",
    id: 1
  });
});

test("find()", function(){
  var a = this.Asset.create();
  
  equals(this.Asset.find(a.id).id, a.id, "Returns saved assets");
  
  raises(function(){
    this.Asset.find("non-existant-id");
  }, "Raises when Asset doesn't exist");
});