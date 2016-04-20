function VideoParser() {
    this.nextPageToken = '';
}

VideoParser.prototype.parseVideos = function(order, duration, dateAfter) {
    var that = this;
    var gettedVideos, getStatRequest = '';
    var searchInput = document.getElementById('searchInput').value;
    var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
    var getVideos = new XHR(),
        getVideosStat = new XHR();

    var date, link, orderBy = '', videoDuration = '', publishedAfter = '';

    if (typeof order === 'string') {
        orderBy = '&order='+order;
    }
    if (typeof duration === 'string') {
        videoDuration = '&videoDuration='+duration;
    }
    if (typeof dateAfter === 'string') {
        publishedAfter = '&publishedAfter='+dateAfter;
    }

    if (!that.nextPageToken) {
        getVideos.open('GET', 'https://www.googleapis.com/youtube/v3/search?key=AIzaSyC9AZy3c2QN1Kl5XCUpKl56ggYQe2Wfx-0&type=video&part=snippet&maxResults=15'+orderBy+videoDuration+publishedAfter+'&q=${'+searchInput+'}', false);
    }
    else {
        getVideos.open('GET', 'https://www.googleapis.com/youtube/v3/search?key=AIzaSyC9AZy3c2QN1Kl5XCUpKl56ggYQe2Wfx-0&type=video&part=snippet&maxResults=15'+orderBy+videoDuration+publishedAfter+'&q='+searchInput+'&pageToken='+that.nextPageToken, false);
    }

    getVideos.send();
    gettedVideos = JSON.parse(getVideos.responseText);
    that.nextPageToken = gettedVideos.nextPageToken;
    for (var i = 0; i < 15; i++) {
        getStatRequest += gettedVideos.items[i].id.videoId + ',';
    }
    getVideosStat.open('GET', 'https://www.googleapis.com/youtube/v3/videos?key=AIzaSyC9AZy3c2QN1Kl5XCUpKl56ggYQe2Wfx-0&id='+getStatRequest+'&part=snippet,statistics', false);
    getVideosStat.send();
        gettedVideos = JSON.parse(getVideosStat.responseText);
        for (var i = 0; i < 15; i++) {
            date = new Date(gettedVideos.items[i].snippet.publishedAt);
            date = date.toString();
            date = date.substr(4, 11);
            link = "https://www.youtube.com/watch?v="+gettedVideos.items[i].id;
            that.addNewVideo(gettedVideos.items[i].snippet.title, gettedVideos.items[i].snippet.thumbnails.high.url, gettedVideos.items[i].snippet.channelTitle, gettedVideos.items[i].statistics.viewCount, date, gettedVideos.items[i].snippet.description, link);
        }
};

VideoParser.prototype.addNewVideo = function(name, imageURL, author, views, date, description, link) {
    var content = document.querySelector(".content");
    content.innerHTML += '<ul class="component clearfix"><span class="icon-video"></span><li><h1 id="componentName"><a href="'+link+'">'+name+'</a></h1></li><li><img id="componentImage" src="'+imageURL+'"></li><li><span id="componentAuthor">'+author+'</span></li><li><span id="componentViews">'+views+'</span><span id="componentDate">'+date+'</span></li><li><span id="componentDescription"><p>'+description+'</p></span></li></ul>';
};
