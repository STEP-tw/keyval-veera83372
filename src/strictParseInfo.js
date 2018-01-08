const Parsed=require("./parsed.js");
const ParseInfo=require("./parseInfo.js");
const InvalidKeyError=require("./errors/invalidKeyError.js");


var StrictParseInfo=function(initialParsingFunction,validKeys,checker) {
  ParseInfo.call(this,initialParsingFunction);
  this.checker=checker;
  this.validKeys=validKeys;
}

StrictParseInfo.prototype=Object.create(ParseInfo.prototype);

StrictParseInfo.prototype.pushKeyValuePair=function() {
  if(!this.checker(this.validKeys,this.currentKey))
    throw new InvalidKeyError("invalid key",this.currentKey,this.currentPos);
  this.parsedKeys[this.currentKey]=this.currentValue;
  this.resetKeysAndValues();
}

module.exports=StrictParseInfo;
