const src=function(filePath){return "../src/"+filePath};
const errors=function(filePath){return "../src/errors/"+filePath};

const assert=require('assert');
const chai = require('chai').assert;
const Parser=require(src('index.js')).Parser;
const Parsed = require(src('parsed.js'));
const MissingValueError=require(errors('missingValueError.js'));
const MissingEndQuoteError=require(errors('missingEndQuoteError.js'));
const MissingKeyError=require(errors('missingKeyError.js'));
const MissingAssignmentOperatorError=require(errors('missingAssignmentOperatorError.js'));
const IncompleteKeyValuePairError=require(errors('incompleteKeyValuePairError.js'));

var kvParser;
var expected;

describe("parse basic key values",function(){
  beforeEach(function(){
    kvParser=new Parser();
    expected=new Parsed();
  });

  it("parses an empty string",function(){
    let actual=kvParser.parse("");
    chai.equal(0,actual.length());
  });

  it("parse key=value",function(){
    let actual=kvParser.parse("key=value");
    chai.equal("value",actual.key);
    chai.equal(1,actual.length());
  });

  it("parse when there are leading spaces before key",function(){
    let actual=kvParser.parse(" key=value");
    expected.key='value';
    chai.deepEqual(expected,kvParser.parse(" key=value"));
  });

  it("parse when there are spaces after key",function(){
    expected.key='value';
    chai.deepEqual(expected,kvParser.parse("key =value"));
  });

  it("parse when there are spaces before and after key",function(){
    expected.key='value';
    chai.deepEqual(expected,kvParser.parse(" key =value"));
  });

  it("parse when there are spaces before value",function(){
    expected.key='value';
    chai.deepEqual(expected,kvParser.parse("key= value"));
  });

  it("parse when there are spaces after value",function(){
    expected.key='value';
    chai.deepEqual(expected,kvParser.parse("key=value "));
  });
});

describe("parse digits and other special chars",function(){
  beforeEach(function(){
    kvParser=new Parser();
    expected=new Parsed();
  });

  it("parse keys with a single digit",function(){
    expected['1']='value';
    chai.deepEqual(expected,kvParser.parse("1=value"));
  });

  it("parse keys with only multiple digits",function(){
    expected['123']="value";
    chai.deepEqual(expected,kvParser.parse("123=value"));
  });

  it("parse keys with leading 0s",function(){
    expected['0123']="value";
    chai.deepEqual(expected,kvParser.parse("0123=value"));
  });

  it("parse keys with underscores",function(){
    expected['first_name']="value";
    chai.deepEqual(expected,kvParser.parse("first_name=value"));
  });

  it("parse keys with a single underscore",function(){
    expected['_']="value";
    chai.deepEqual(expected,kvParser.parse("_=value"));
  });

  it("parse keys with multiple underscores",function(){
    expected['__']="value";
    chai.deepEqual(expected,kvParser.parse("__=value"));
  });

  it("parse keys with alphabets and digits(digits leading)",function(){
    expected['0abc']="value";
    chai.deepEqual(expected,kvParser.parse("0abc=value"));
  });

  it("parse keys with alphabets and digits(alphabets leading)",function(){
    expected['a0bc']="value";
    chai.deepEqual(expected,kvParser.parse("a0bc=value"));
  });
});

describe("multiple keys",function(){
  beforeEach(function(){
    kvParser=new Parser();
    expected=new Parsed();
  });

  it("parse more than one key",function(){
    expected.key="value";
    expected.anotherkey="anothervalue";
    chai.deepEqual(expected,kvParser.parse("key=value anotherkey=anothervalue"));
  });

  it("parse more than one key when keys have leading spaces",function(){
    expected.key="value";
    expected.anotherkey="anothervalue";
    chai.deepEqual(expected,kvParser.parse("   key=value anotherkey=anothervalue"));
  });

  it("parse more than one key when keys have trailing spaces",function(){
    expected.key="value";
    expected.anotherkey="anothervalue";
    chai.deepEqual(expected,kvParser.parse("key  =value anotherkey  =anothervalue"));
  });

  it("parse more than one key when keys have leading and trailing spaces",function(){
    expected.key="value";
    expected.anotherkey="anothervalue";
    chai.deepEqual(expected,kvParser.parse("  key  =value anotherkey  =anothervalue"));
  });
});

describe("single values with quotes",function(){
  beforeEach(function(){
    kvParser=new Parser();
    expected=new Parsed();
  });

  it("parse a single value with quotes",function(){
    expected.key="value";
    chai.deepEqual(expected,kvParser.parse("key=\"value\""));
  });

  it("parse a single quoted value that has spaces in it",function(){
    expected.key="va lue";
    assert.deepEqual(expected,kvParser.parse("key=\"va lue\""));
  });

  it("parse a single quoted value that has spaces in it and leading spaces",function(){
    expected.key="va lue";
    assert.deepEqual(expected,kvParser.parse("key=   \"va lue\""));
  });

  it("parse a single quoted value that has spaces in it and trailing spaces",function(){
    expected.key="va lue";
    chai.deepEqual(expected,kvParser.parse("key=\"va lue\"   "));
  });
});

describe("multiple values with quotes",function(){
  it("parse more than one value with quotes",function(){
    expected.key="va lue";
    expected.anotherkey="another value";
    chai.deepEqual(expected,kvParser.parse("key=\"va lue\" anotherkey=\"another value\""));
  });

  it("parse more than one value with quotes with leading spaces",function(){
    expected.key="va lue";
    expected.anotherkey="another value";
    chai.deepEqual(expected,kvParser.parse("key= \"va lue\" anotherkey= \"another value\""));
  });

  it("parse more than one value with quotes when keys have trailing spaces",function(){
    expected.key="va lue";
    expected.anotherkey="another value";
    chai.deepEqual(expected,kvParser.parse("key = \"va lue\" anotherkey = \"another value\""));
  });
});

describe("mixed values with both quotes and without",function(){
  it("parse simple values with and without quotes",function(){
    expected.key="value";
    expected.anotherkey="anothervalue";
    chai.deepEqual(expected,kvParser.parse("key=value anotherkey=\"anothervalue\""));
  });

  it("parse simple values with and without quotes and leading spaces on keys",function(){
    expected.key="value";
    expected.anotherkey="anothervalue";
    chai.deepEqual(expected,kvParser.parse("   key=value anotherkey=\"anothervalue\""));
  });

  it("parse simple values with and without quotes and trailing spaces on keys",function(){
    expected.key="value";
    expected.anotherkey="anothervalue";
    chai.deepEqual(expected,kvParser.parse("key  =value anotherkey  =\"anothervalue\""));
  });

  it("parse simple values with and without quotes and leading and trailing spaces on keys",function(){
    expected.key="value";
    expected.anotherkey="anothervalue";
    chai.deepEqual(expected,kvParser.parse("  key  =value anotherkey  = \"anothervalue\""));
  });

  it("parse simple values with and without quotes(quoted values first)",function(){
    expected.key="value";
    expected.anotherkey="anothervalue";
    chai.deepEqual(expected,kvParser.parse("anotherkey=\"anothervalue\" key=value"));
  });
});

const errorChecker=function(key,pos,typeOfError) {
    return function(err) {
      if(err instanceof typeOfError && err.key==key && err.position==pos)
        return true;
      return false;
    }
}

describe("error handling",function(){
  beforeEach(function(){
    kvParser=new Parser();
  });

  it("throws error on missing value when value is unquoted",function(){
    assert.throws(
      () => {
        kvParser.parse("key=")
      },
      errorChecker("key",3,MissingValueError))
  });

  it("throws error on missing value when value is quoted",function(){
    assert.throws(
      () => {
        kvParser.parse("key=\"value")
      },
      errorChecker("key",9,MissingEndQuoteError)
    )
  });

  it("throws error on missing key",function(){
    assert.throws(
      () => {
        var p=kvParser.parse("=value");
      },
      errorChecker(undefined,0,MissingKeyError)
    )
  });

  it("throws error on invalid key",function(){
    assert.throws(
      () => {
        var p=kvParser.parse("'foo'=value");
      },
      errorChecker(undefined,0,MissingKeyError)
    )
  });

  it("throws error on missing assignment operator",function(){
    assert.throws(
      () => {
        var p=kvParser.parse("key value");
      },
      errorChecker(undefined,4,MissingAssignmentOperatorError)
    )
  });

  it("throws error on incomplete key value pair",function(){
    assert.throws(
      () => {
        var p=kvParser.parse("key");
      },
      errorChecker(undefined,2,IncompleteKeyValuePairError)
    )
  });

});
