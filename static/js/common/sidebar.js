$(function () {
    initLanguageSelectDom();

    $(".language_toggle").click(function () {
        $(".language_toggle_list").slideToggle();
        $(".toggle_arrow_box .m_up_arrow").toggle();
        $(".toggle_arrow_box .m_down_arrow").toggle();
    });

    $(".m_hamburger_button").click(function () {
        $("#side_dim").show();
        $("#side_bar").animate({left: 0});
    });

    $('#side_dim').on('click', function (event) {
        if (!$(event.target).closest('#side_bar').length && $('#side_bar').is(':visible')) {
            $('.language_toggle_list').slideUp();
            $("#side_bar").animate({left: "-55%"});
            $("#side_dim").fadeOut();
            event.stopPropagation();
        }
    });

    $('.m_hamburger_button').on('click', function (event) {
        event.stopPropagation();
    });

    $('#side_bar #language li').click(function() {
        let selectedId = $(this).attr("id");
        let selectedLanguage = selectedId.split("_")[1];
        $('#side_dim .language_toggle span').text(selectedLanguage).attr('selectedLanguage', selectedId);
        changeLanguage(selectedLanguage);
    });
});
function initLanguageSelectDom() {
    let text;
    let id;

    switch (locale) {
        case 'ko':
            text = $('#language > li:first-child').text();
            id = $('#language > li:first-child').attr('id');
            break;

        case 'ko_KR':
            text = $('#language > li:first-child').text();
            id = $('#language > li:first-child').attr('id');
            break;

        case 'en':
            text = $('#language > li:nth-child(2)').text();
            id = $('#language > li:nth-child(2)').attr('id');
            break;

        default:
            text = $('#language > li:nth-child(2)').text();
            id = $('#language > li:nth-child(2)').attr('id');
            break;
    }

    $('#side_dim .language_toggle span').text(text).attr('id', id);
}
function changeLanguage(selectedLanguage) {
    let searchParams = new URLSearchParams(location.search);
    searchParams.set('lang', selectedLanguage);

    location.href = window.location.protocol
        .concat("//")
        .concat(window.location.host)
        .concat(window.location.pathname)
        .concat("?")
        .concat(searchParams);
}

function checkTwoAuthenticateDeviceManagement() {
    if(isApp()) {
        findVpnUserMfaDeviceInfo().then(response => {
            if(response.status === 400) {
                location.href = '/authenticate/start';
            }

            if(response.status === 200) {
                if(response.data) {
                    location.href = '/authenticate/mfa';
                } else {
                    callSendOtpCodeApi(false, false).then(response => {
                        location.href = '/authenticate/otp';
                    });
                }
            }
        })

    } else {
        openAgentApp(true);
    }
}


function checkTwoAuthenticateVpnAccess() {
    if(isApp()) {
        findVpnUserMfaDeviceInfo().then(response => {
            if(response.status === 400) {
                findAppToken() === null
                    ? location.href="/authenticate/sign-in?accessObject=vpnAccess"
                    : startVpnUserStatus(null, null, authenticationMethod.APP_TOKEN, false, null, null, "vpnAccess");
            }

            if(response.status === 200) {
                if(response.data) {
                    location.href = '/authenticate/mfa?accessObject=vpnAccess';
                } else {
                    callSendOtpCodeApi(false, false).then(response => {
                        location.href = '/authenticate/otp?accessObject=vpnAccess';
                    });
                }
            }
        })

    } else {
        openAgentApp(true);
    }
}

function moveToDeviceManagement() {
    isApp()
        ? location.href = '/device/management'
        : openAgentApp(true);
}

function vpnDisconnectModal() {
    const mobileModalShow = document.getElementById('m_modal_show');
    mobileModalShow.innerHTML = "";
        
    let html = `
        <div class="mobileModal vpn-disconnect" id="m_modal_message-box">
            <div>
                <div>
                    <div class="m_modal_message-box">
                        <div>
                            <p>${modalMessage.modal_disconnect_vpn_message}</p>     
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

    mobileModalShow.innerHTML= html;
    $('#m_modal_message-box').show();
    $('#modalCloseButton').click(function(){
        $('#m_modal_show').hide();
    });
    $('.language_toggle_list').slideUp();
    $("#side_bar").animate({left: "-55%"});
    $("#side_dim").fadeOut();
}

async function findVpnUserMfaDeviceInfo() {
    const res = await fetch(`/api/v1/vpn-users/info/mfa-device`, {
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