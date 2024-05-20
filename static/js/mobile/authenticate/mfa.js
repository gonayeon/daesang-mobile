$(function(){
    if(findAppToken() !== null) {
        $('#autoConnectCheckbox').attr('checked', true);
    }
});
function startMfaAuthenticate() {
    requestBioAuthOnWeb();
}
function requestBioAuthOnWeb(){
    commonLoadingModalOn(modalMessage.modal_loading_title_vpn, modalMessage.modal_loading_message_mfa_auth, true, modalMessage.modal_loading_message_mfa_auth_addButton);
    let mfaAuthenticationRemainTime = 120;
    let timer;

    let eventSource = new EventSource("/api/v1/sse/subscribe");
    eventSource.addEventListener("AUTH_TOKEN_RESULT", function(event) {
        clearInterval(timer);
        eventSource.close();

        switch (event.data) {
            case "SUCCESS":
                $('#m_modal_loading').hide();
                twoFactorSecurityAuthenticateMobile();
                break;

            case "ERROR":
                commonMessageModalOn(modalMessage.modal_common_title_error, modalMessage.authenticate_error_message_mfa, modalMessage.modal_common_button_confirm);
                $('#m_modal_message-box #modalCloseButton').on('click', function () {
                    $('#m_modal_message-box').hide();
                    return;
                });
                break;
        }
    });
    eventSource.addEventListener("error", function(event) {
        clearInterval(timer);
        eventSource.close();

        commonMessageModalOn(modalMessage.modal_common_title_error, modalMessage.authenticate_error_unknown_message_mfa, modalMessage.modal_common_button_confirm);
        $('#m_modal_message-box #modalCloseButton').on('click', function () {
            $('#m_modal_message-box').hide();
            return;
        });
    });

    callNPassAgentPushNotificationApi().then(response => {
        if(response.status === 200) {
            timer = setInterval(function() {
                updateDomText('mfaAuthRemainTime', mfaAuthenticationRemainTime);
                mfaAuthenticationRemainTime--;

                if (mfaAuthenticationRemainTime < 0) {
                    clearInterval(timer);
                    eventSource.close();
                    $('#m_modal_loading').hide();
                }
            }, 1000);
        }

        if(response.status === 400) {
            eventSource.close();

            switch (response.code) {
                case 'A005':
                    location.href = response.data;
                    break;

                case 'N003':
                    commonMessageModalOn(modalMessage.modal_common_title_error, modalMessage.modal_message_notFound_mfaDevice, modalMessage.modal_common_button_close);
                    $('#m_modal_message-box #modalCloseButton').on('click', function() {
                        $('#m_modal_message-box').hide();
                        return;
                    });

                    break;

                case 'M006' :
                    commonMessageModalOn(modalMessage.modal_common_title_error, modalMessage.modal_message_notValid_mfaAuth, modalMessage.modal_button_otp_send);
                    $('#m_modal_message-box #modalCloseButton').on('click', function() {
                        sendOtpCode(false);
                        return;
                    });

                    break;
            }
        }
    });

    $('#vpnLoadingCancelButton').on('click', function() {
        clearInterval(timer);
        eventSource.close();
        $('#m_modal_loading').hide();
    });

    $('#vpnLoadingOtpButton').on('click', function() {
        clearInterval(timer);
        eventSource.close();
        $('#m_modal_loading').hide();

        sendOtpCode(false);
    });
}
function twoFactorSecurityAuthenticateMobile() {
    let twoFactorAuthenticateDto = {
        "otpCode" : "",
        "twoFactorAuthenticateType" : twoFactorAuthenticateType.MFA
    }

    callTwoFactorAuthenticateApi(twoFactorAuthenticateDto).then(response => {
        response.data["ACCESS_OBJECT"] === "vpnAccess"
            ? location.href = "/vpn/open-start"
            : location.href = "/device/management";
    });
}