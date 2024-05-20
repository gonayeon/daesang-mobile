$(function () {

    if (pageName === "PC_MAIN") {
        findNoticeTop5();
    }

});

function findNoticeTop5() {
    callFindNoticeTop5Api().then(response => {
        if (response.status === 200) {
            drawNoticeTop5Dom(response.data);
            if ($("#nt_ct li").length > 1) { 
                $("#nt_ct li").each(function () {
                    const anchorElement = $(this).find("a");
                    const divElement = $(this).find("div");
        
                    if (anchorElement.outerWidth() > divElement.outerWidth()) {
                        divElement.addClass("marquee");
                    }
                });

                let interval = setInterval(nextSlide, 10000);
        
                $(".up_arrow").click(function () {
                    clearInterval(interval);
                    nextSlide();
                    interval = setInterval(nextSlide, 10000);
                });
        
                $(".down_arrow").click(function () {
                    clearInterval(interval);
                    prevSlide();
                    interval = setInterval(nextSlide, 10000);
                });
        
                function nextSlide() {
                    $("#nt_ct").animate({
                        top: "-100%"
                    }, function () {
                        $("#nt_ct > li").eq(0).appendTo("#nt_ct");
                        $("#nt_ct").css({
                            top: 0
                        });
                    });
                }
        
                function prevSlide() {
                    $("#nt_ct > li:last").prependTo("#nt_ct");
                    $("#nt_ct").css({
                        top: "-100%"
                    });
                    $("#nt_ct").animate({
                        top: 0
                    });
                }
            }
        }
    });
}

function drawNoticeTop5Dom(notices) {
    let noticeTop5Area = document.getElementById('nt_ct');
    noticeTop5Area.innerHTML = "";

    if(notices.length === 0) {
        const newList = document.createElement('li');
        let html = `<div>${domMessage.pc_mainLanding_notice_message_empty}</div>`;
        newList.innerHTML = html;
        noticeTop5Area.appendChild(newList);
    } else {
        let head = (locale === "ko" || locale === "ko_KR") ? "[새안내]" : "[NEW]";
        notices.forEach(notice => {
            const newList = document.createElement('li');
            let html = `<div${getContainerClass(notice.noticeTitle, head)}><a href="/notice/detail/${notice.noticeId}">${head} ${notice.noticeTitle}</a></div>`;
            newList.innerHTML = html;
            noticeTop5Area.appendChild(newList);
        });
    }
}

function getContainerClass(title, head) {
    const divTag = `<div><a href="/notice/detail">${head} Test</a></div>`;
    const anchorTag = `<a href="/notice/detail">${head} Test</a>`;
    return title.length > divTag.length ? ' class="marquee"' : '';
}

async function callFindNoticeTop5Api() {
    const res = await fetch(`/api/v1/notices/top5`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    }).then(response => {
        if(response.status === 200 || response.status === 400) {
            return response;
        }

        if(response.status === 500) {
            location.href = "/error/500";
            return;
        }
    }).catch(error => {
        console.log(error);
    });
    return await res.json();
}

function startVpn() {
    osCode === "W" ? checkVpnClientWindows() : checkAppToken();
}

function checkVpnClientWindows() {
    commonLoadingModalOn(modalMessages.vpnModal_pc_vpnClient_check_vpn, modalMessages.vpnModal_pc_vpnClient_check_message);
    setTimeout(() => callWindowsVpnClientStatusCheckApi(), 2000);
}

function checkAppToken() {
    findAppToken() === null ? location.href = "/authenticate/sign-in" : startVpnUserStatus(null, null, authenticationMethod.APP_TOKEN, false, null,null);
}

function startDownloadVpnClient() {
    downloadVpnClient(osCode, null);
}

function startDownloadVpnAgent() {
    downloadVpnAgent(osCode, vpnAgentFileRef);
}