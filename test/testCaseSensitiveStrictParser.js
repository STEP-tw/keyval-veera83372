const src=function(filePath){return "../src/"+filePath};

const assert=require('chai').assert;
const Parsed=require(src('parsed.js'));
const StrictParser=require(src('index.js')).StrictParser;

describe("strict parser that is case insensitive",function(){
  it("should parse when specified keys are in lower case and actual is not",function(){
    let kvParser=new StrictParser(["name"],false);
    // false indicates that case sensitive is false. By default it is true
    let expected=new Parsed();
    expected["NAME"]="jayanth";
    let parsed=kvParser.parse("NAME=jayanth");
    assert.deepEqual(parsed,expected);
  });

  
});

describe("strict parser that is case sensitive",function(){
  it("should throw error when specified keys are in lower case and actual is not",function(){
    let kvParser=new StrictParser(["name"],true);
    // true indicates that parser is case sensitive
    assert.throws(()=>{
      kvParser.parse("NAME=jayanth");
    })
  });

  it('should parse when specified keys are in same case as actual ',function () {
    let kvParser=new StrictParser(["Name"]);
    let actual = kvParser.parse("Name=veera");
    let expected=new Parsed();
    expected.Name="veera";
    assert.deepEqual(actual,expected);
  })

  it('should parse when specified keys are in same case and contains digits ',function () {
    let kvParser = new StrictParser(["Adithi1"]);
    let actual=kvParser.parse("Adithi1=object");
    let expected=new Parsed();
    expected['Adithi1']="object";
    assert.deepEqual(actual,expected);
  })

  it("should parse when specified keys are in same case and contains special symbols ",function () {
    let kvParser = new StrictParser(['Name_2']);
    let expected = new Parsed();
    let actual=kvParser.parse('Name_2=gollum');
    expected['Name_2']="gollum";
    assert.deepEqual(actual,expected);
  })
});
