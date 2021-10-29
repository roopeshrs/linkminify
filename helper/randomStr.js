function generateShortUrl(){
    let rndStr = "";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
  
    for(let i=0; i<5; i++){
      rndStr += characters.charAt(
        Math.floor(Math.random()*charactersLength)
      )
    }
    return rndStr;
  }


  module.exports = {
      generateShortUrl: generateShortUrl
  }