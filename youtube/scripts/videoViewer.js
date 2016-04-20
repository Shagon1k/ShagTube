var content = document.querySelector('.content'),
    overlay = $('.overlay'),
    closeVideo = document.querySelector('#closeVideo'),
    ytPlayer = document.querySelector('#ytPlayer');
var videoLink = '';

content.addEventListener('click', function(e){
    var shortLink;
    if(e.target.tagName === 'IMG'){
        videoLink = e.target.parentNode.parentNode.querySelector('a').getAttribute('href');
        shortLink = videoLink.split('=')[1];
        ytPlayer.setAttribute('src', "http://www.youtube.com/embed/"+shortLink+"?autoplay=1&autohide=1&color=white");
        overlay.toggle();
    }
});

overlay.on('dblclick', function(e){
    if(e.target.classList.contains('overlay')){
        overlay.toggle();
        videoLink = '';
        ytPlayer.setAttribute('src', "");
    }
});

closeVideo.addEventListener('click', function(e){
    overlay.toggle();
    videoLink = '';
    ytPlayer.setAttribute('src', "");
});

