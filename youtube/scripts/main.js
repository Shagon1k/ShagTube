//(function(){
    var mPrev, mCurr, pagesCount = 0, prevPagesCount, currentPage = 0;
    var searchButton = document.querySelector(".icon-search"),
        searchInput = document.querySelector("#searchInput");
    var mainContent = document.querySelector('.mainContent'),
        content = document.querySelector('.content'),
        footer = document.querySelector('footer');
    var searchOrder = document.querySelector('.searchOrder'),
        enableSearchOrder = document.querySelector('#enableSearchOrder');
    var searchDuration = document.querySelector('.searchDuration'),
        enableSearchDuration = document.querySelector('#enableSearchDuration');
    var searchAfter = $("#searchAfter"),
        dateAfterChooser = document.querySelector('.dateAfterChooser'),
        searchAfterButton = document.querySelector('#searchAfterButton'),
        enableSearchAfter = document.querySelector('#enableSearchAfter');
    var searchButtons = document.querySelectorAll('.searchWrap .filterButton');
    var ord;       //date , rating , relevance , title , viewCount
    var duration;  //short, medium, long
    var dateAfter; //date

    var filterStatusText = '';
        filterStatus = document.querySelector('.filterStatus');

    var videoParser = new VideoParser();

    searchOrder.addEventListener('click', function(e){
        if (e.target.tagName === 'LI') {
            if (searchInput.value) {
                ord = e.target.id;
                duration = undefined;
                videoLoadEvent();

                filterStatusText = '<b>Filter: </b>';
                if(ord) {
                    filterStatusText+=ord+' ';
                }
                if(duration) {
                    filterStatusText+=duration;
                }
                filterStatus.innerHTML = filterStatusText;

                searchOrder.classList.toggle('hide');
                for(var i = 0; i < searchButtons.length; i++) {
                    searchButtons[i].classList.toggle('hide');
                }
            }
        }
    });

    searchDuration.addEventListener('click', function(e) {
        if(e.target.tagName === 'LI') {
            if (searchInput.value) {
                duration = e.target.id;
                videoLoadEvent();

                filterStatusText = '<b>Filter: </b>';
                if(ord) {
                    filterStatusText+=ord+' ';
                }
                if(duration) {
                    filterStatusText+=duration;
                }
                filterStatus.innerHTML = filterStatusText;

                searchDuration.classList.toggle('hide');
                for(var i = 0; i < searchButtons.length; i++) {
                    searchButtons[i].classList.toggle('hide');
                }
            }
        }
    });

    searchAfterButton.addEventListener('click', function(e) {
        if(searchAfter.val() && searchInput.value) {
            dateAfter = searchAfter.val()+'T00:00:00Z';
            videoLoadEvent();
        }
        else if (!searchAfter.val()) {
            dateAfter = undefined;
            videoLoadEvent();
        }
        dateAfterChooser.classList.toggle('hide');
        for(var i = 0; i < searchButtons.length; i++) {
            searchButtons[i].classList.toggle('hide');
        }
    });

    searchAfter.datepicker({
      showOtherMonths: true,
      selectOtherMonths: true,
      changeMonth: true,
      changeYear: true,
      maxDate: new Date(),
      dateFormat: "yy-mm-dd"
    });

    enableSearchOrder.addEventListener('click', function(e) {
        for(var i = 0; i < searchButtons.length; i++) {
            searchButtons[i].classList.toggle('hide');
        }
        searchOrder.classList.toggle('hide');
    });

    enableSearchDuration.addEventListener('click', function(e) {
        for(var i = 0; i < searchButtons.length; i++) {
            searchButtons[i].classList.toggle('hide');
        }
        searchDuration.classList.toggle('hide');
    });

    enableSearchAfter.addEventListener('click', function(e) {
        for(var i = 0; i < searchButtons.length; i++) {
            searchButtons[i].classList.toggle('hide');
        }
        dateAfterChooser.classList.toggle('hide');
    });

    searchOrder.classList.toggle('hide');
    searchDuration.classList.toggle('hide');
    dateAfterChooser.classList.toggle('hide');

    //Resize event
    function resize() {
        prevPagesCount = pagesCount;
        var componentsLength = document.querySelectorAll(".component").length;
        if (document.body.clientWidth > 1530) {
            content.style.width = "calc(25vw *" + componentsLength + ")";
            pagesCount = Math.ceil(componentsLength/4);
        }
        else if (document.body.clientWidth > 1200) {
            content.style.width = "calc("+100/3+"vw *" + componentsLength + ")";
            pagesCount = Math.ceil(componentsLength/3);
        }
        else if (document.body.clientWidth > 750) {
            content.style.width = "calc(50vw *" + componentsLength + ")";
            pagesCount = Math.ceil(componentsLength/2);
        }
        else {
            content.style.width = "calc(100vw *" + componentsLength + ")";
            pagesCount = componentsLength;
        }
        repaintContent(0);
    }
    window.addEventListener("resize", resize);
    window.addEventListener("resize", function(){
        if ((prevPagesCount !== pagesCount)) {
            currentPage = Math.round(currentPage/prevPagesCount*pagesCount);
            repaintContent(0);
            repaintButtons();
            colorButtons();
        }
    });
    //------------
    //Repaint function
    function repaintContent(time){
        content.style.transition = "transform "+time+"s";
        content.style.transform = "translate3D(-" + document.body.clientWidth*currentPage + "px, 0, 0)";
    }
    //------------
    //Buttons events
    function colorButtons() {
        if (pagesCount <= 15) {
            var liElems;
            if (currentPage < pagesCount-1) {
                liElems = document.querySelectorAll('.buttonsList li');
                for (var i = 0; i < pagesCount-1; i++) {
                        liElems[i].classList.remove('bg-curr');
                        liElems[i].classList.add('bg-normal');
                        liElems[i].querySelector('span').style.display="none";
                    }
                liElems[currentPage].classList.remove('bg-normal');
                liElems[currentPage].classList.add('bg-curr');
                liElems[currentPage].querySelector('span').style.display="inline";
            }
        }
    }

    function repaintButtons() {
        if (pagesCount <= 15) {
            var ul, li, liElems, span;
            ul = document.createElement('ul');
            ul.classList.add('buttonsList');
            if (document.body.clientWidth > 950) {
                ul.style.width = ((pagesCount)*36)+"px";
            }
            else {
                ul.style.width = ((pagesCount)*18)+"px";
            }
            for (var i = 0; i < pagesCount-1; i++) {
                li = document.createElement('li');
                span = document.createElement('span');
                span.innerHTML = i+1;
                li.setAttribute('data-page', i);
                li.appendChild(span);
                li.classList.add('bg-normal');
                ul.appendChild(li);
            }
            footer.innerHTML = '';
            footer.appendChild(ul);
            liElems = document.querySelectorAll('.buttonsList li');
            for (var i = 0; i < pagesCount-1; i++) {
                liElems[i].addEventListener ("mousedown", function() {
                    currentPage = +this.getAttribute('data-page');
                    if (currentPage > pagesCount-3) {
                        videoParser.parseVideos(ord, duration, dateAfter);
                        resize();
                        repaintButtons();
                        colorButtons();
                    }
                    colorButtons();
                    repaintContent(0.5);
                });
            }
        }
        else {
            footer.innerHTML = '<span class="pageViewer">'+(currentPage+1)+'/'+pagesCount+'</span>';
        }
    }
    //------------
    //Slide event
    function moveEvent(e) {
        var step;
        content.style.transition = "transform 0.05s";
        if (e.type === "mousemove") {
            mCurr = e.clientX;
        }
        else {
            mCurr = e.changedTouches[0].clientX;
        }
        if (mCurr < mPrev) {
            step = (+document.body.clientWidth*currentPage) + (mPrev - mCurr);
            step = step.toString();
            content.style.transform = "translate3D(-" + step + "px, 0, 0)";
        }
        else {
            if (currentPage === 0) {
                mainContent.removeEventListener(e.type, moveEvent);
            }
            step = (+document.body.clientWidth*currentPage) - (mCurr - mPrev);
            step = step.toString();
            content.style.transform = "translate3D(-" + step + "px, 0, 0)";
        }
    }

    function upEvent(e) {
        if (e.type === "mouseup") {
            mCurr = e.clientX;
        }
        else {
            mCurr = e.changedTouches[0].clientX;
        }
        if (Math.abs(mCurr - mPrev) > 50) {
            if (mCurr < mPrev) {
                if (currentPage > pagesCount-3) {
                    videoParser.parseVideos(ord, duration, dateAfter);
                    resize();
                    repaintButtons();
                    colorButtons();
                }
                currentPage++;
            }
            else {
                if (currentPage === 0) return;
                currentPage--;
            }
            repaintButtons();
            colorButtons();
        }
        repaintContent(1);
        if (e.type === "mouseup") {
            mainContent.removeEventListener("mousemove", moveEvent);
        }
        else if(e.type ==="touchend") {
            mainContent.removeEventListener("touchmove", moveEvent);
        }
    }

    mainContent.addEventListener("mousedown", function(e){
        mPrev = e.clientX;
        mainContent.addEventListener("mousemove", moveEvent);
        mainContent.addEventListener("mouseup", upEvent);
    });

    mainContent.addEventListener("touchstart", function(e){
        mPrev = e.changedTouches[0].clientX;
        mainContent.addEventListener("touchmove", moveEvent);
        mainContent.addEventListener("touchend", upEvent);
    });
    //------------
    //Video parsing
    function videoLoadEvent () {
        videoParser.nextPageToken = '';
        content.innerHTML = '';
        currentPage = 0;
        repaintContent(0);
        videoParser.parseVideos(ord, duration, dateAfter);
        resize();
        repaintButtons();
        colorButtons();
    }
    searchButton.addEventListener('click', function(e){
        filterStatus.innerHTML = '';
        ord = undefined;
        duration = undefined;
        dateAfter = undefined;
        videoLoadEvent();
    });
    searchInput.addEventListener('keydown', function(e){
        filterStatus.innerHTML = '';
        ord = undefined;
        duration = undefined;
        dateAfter = undefined;
        if (e.keyCode === 13) {
            videoLoadEvent();
        }
    });
    //------------
//}());