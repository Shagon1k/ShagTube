var body = document.querySelector('body'),
    container = document.createElement('div'),
    header = document.createElement('header'),
    footer = document.createElement('footer'),
    mainContent = document.createElement('div'),
    content = document.createElement('div');
container.classList.add("container");
header.classList.add("clearfix");

header.innerHTML = '<a href="#"><img class="logo" src="images/MyTube.png" alt="youtubeLogo"></a><div class="searchWrap"><input id="searchInput" type="text"><span class="icon-search"></span></div><div class="contacts"><a href="https://twitter.com/Shagon1k" class="contactTwitter"></a><a href="https://www.facebook.com/profile.php?id=100001128590317" class="contactFB"></a></div>';
mainContent.classList.add("mainContent");
content.classList.add("content");
mainContent.appendChild(content);
container.appendChild(header);
container.appendChild(mainContent);
container.appendChild(footer);
body.appendChild(container);