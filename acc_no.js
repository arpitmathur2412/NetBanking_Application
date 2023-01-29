module.exports.getaccno=function(){
    var digits = Math.floor(Math.random() * 9000000000) + 1000000000;
    return digits;
}