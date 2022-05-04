class YouTubeComment {
    /*
    private _text;
    private _likeCount;
    private _timestamps;
    private _keywords; 
    */
  
    constructor(text, likeCount, timestamps = [], keywords) {
      this.text = text;
      this.likeCount = likeCount;
      this.timestamps = timestamps;
      this.keywords = keywords;
    }
    
    /*
    get text() {
      return this.text;
    }
  
    get likeCount() {
      return this.likeCount;
    }
  
    get timestamps() {
      return this.timestamps;
    }
  
    set timestamps(value) {
      this.timestamps = value;
    }
  
    get keywords() {
      return this.keywords;
    }
  
    set keywords(value) {
      this.keywords = value;
    }*/
}

module.exports = YouTubeComment;