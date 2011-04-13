describe("Model", function(){
  var Asset;
  
  beforeEach(function(){
    Asset = Model.setup();
    Asset.attributes = ["name"];
  });
  
  it("can create records", function(){
    var asset = Asset.create({name: "test.pdf"});
    expect(Asset.first()).toEqual(asset);
  });

  it("can update records", function(){
    var asset = Asset.create({name: "test.pdf"});

    expect(Asset.first().name).toEqual("test.pdf");

    asset.name = "wem.pdf";
    asset.save();
    
    expect(Asset.first().name).toEqual("wem.pdf");
  });
  
  it("can destroy records", function(){
    var asset = Asset.create({name: "test.pdf"});

    expect(Asset.first()).toEqual(asset);
    
    asset.destroy();
    
    expect(Asset.first()).toBeFalsy();
  });
});