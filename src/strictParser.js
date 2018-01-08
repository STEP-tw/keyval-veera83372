const Parser=require("./keyValueParser.js");
const strictParseInfoCreator=require("./parseInfoCreator.js").strict;
const contains=function(list,key) {
  return list.find(function(validKey){
    return key==validKey;
  });
}

const ignoreCaseContains = function(list,key) {
  return list.find(function(validKey){
    return key.toLowerCase()==validKey.toLowerCase();
  });
}

var StrictParser=function(listOfKeys,caseSensitive=true) {
  let checker = caseSensitive ? contains : ignoreCaseContains;
  Parser.call(this);
  let sanitisedListOfKeys=listOfKeys||[];
  this.parseInfoCreator=strictParseInfoCreator(sanitisedListOfKeys,checker);
}

StrictParser.prototype=Object.create(Parser.prototype);
module.exports=StrictParser;
