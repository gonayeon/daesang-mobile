$(function(){
    if(findAppToken() !== null) {
        $('#autoConnectCheckbox').attr('checked', true);
    }
});

function startMfaAuthenticate() {
    commonLoadingModalOn(modalMessages.vpn_mfaAuthenticate_title, modalMessages.vpn_mfaAuthenticate_message, true, modalMessages.vpn_mfaAuthenticate_addButton);

    let mfaAuthenticationRemainTime = 120;
    let timer;

    let eventSource = new EventSource("/api/v1/sse/subscribe");
    eventSource.addEventListener("AUTH_TOKEN_RESULT", function(event) {
        clearInterval(timer);
        eventSource.close();

        switch (event.data) {
            case "SUCCESS":
                $('#vpnLoadingModal').hide();
                twoFactorSecurityAuthenticate();
                break;

            case "ERROR":
                commonMessageModalOn(modalMessages.authenticate_error_message_mfa);
                $('#commonMessageModal .closeButton').on('click', function() {
                    $('#commonMessageModal').hide();
                    return;
                });
                break;
        }
    });
    eventSource.addEventListener("error", function(event) {
        clearInterval(timer);
        eventSource.close();

        commonMessageModalOn(modalMessages.authenticate_error_unknown_message_mfa);
        $('#commonMessageModal .closeButton').on('click', function() {
            $('#commonMessageModal').hide();
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
                    $('#vpnLoadingModal').hide();
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
                    commonMessageModalOn(modalMessages.modal_error_message_notFound_mfaDevice);
                    $('#commonMessageModal .closeButton').on('click', function() {
                        location.href = '/authenticate/two-factor/log-out';
                        return;
                    });

                    break;

                case 'M006' :
                    let buttonTag = '<button type="button" style="margin-top: 2rem;" onclick="sendOtpCode(false);">OTP</button><br>'
                    commonMessageModalOn(modalMessages.modal_error_message_notValid_mfaAuth, true, buttonTag);
                    updateDomCss('commonMessageModal .closeButton', 'margin', '0');
                    $('#commonMessageModal .closeButton').on('click', function() {
                        $('#commonMessageModal').hide();
                        return;
                    });

                    break;
            }
        }
    });

    $('#vpnLoadingCancelButton').on('click', function() {
        clearInterval(timer);
        eventSource.close();
        $('#vpnLoadingModal').hide();
    });

    $('#vpnLoadingOtpButton').on('click', function() {
        commonMessageModalOn(modalMessages.modal_mfaAuth_toOtpAuth_message, false, '');
        updateDomText('commonMessageModal .closeButton', modalMessages.modal_common_confirm_button);

        $('#commonMessageModal .closeButton').on('click', function() {
            clearInterval(timer);
            eventSource.close();
            sendOtpCode(false);
        });
    });
}
function twoFactorSecurityAuthenticate() {
    let twoFactorAuthenticateDto = {
        "otpCode" : "",
        "twoFactorAuthenticateType" : twoFactorAuthenticateType.MFA
    }

    callTwoFactorAuthenticateApi(twoFactorAuthenticateDto).then(response => {
        if(response.status === 200) {
            requestVpnTunnelingOpen(osCode);
        }
    });
}