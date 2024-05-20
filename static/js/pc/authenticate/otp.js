$(function(){
    $('#inputOtpCode').focus();

    if(findAppToken() !== null) {
        $('#autoConnectCheckbox').attr('checked', true);

        if(pageName === "PC_OTP-INIT") {
            $('#autoConnectCheckbox').attr('checked', false);
            updateVpnAppToken();
        }
    }

    $('#inputOtpCode').on('keyup', function(event) {
        if(event.keyCode == 13) {
            if(pageName === 'PC_OTP-SECOND_AUTHENTICATE') {
                otpSecondAuthenticate();
            }

            if(pageName === 'PC_OTP-INIT') {
                otpCheck();
            }
        }
    });
});
function otpCheck() {
    let inputOtp = $('#inputOtpCode').val().trim();
    if(inputOtp === "" || inputOtp.length === 0) {
        commonMessageModalOn(modalMessages.authenticate_validation_message_noInput_otp);
        $('#commonMessageModal .closeButton').on('click', function() {
            $('#commonMessageModal').hide();
        });
        return false;
    }

    callOtpCheckApi(inputOtp).then(response => {
        if(response.status === 200) {
            location.href = "/authenticate/set-password";
        }

        if(response.status === 400) {
            switch (response.code) {
                case "A005":
                    location.href = response.data;
                    break;

                case "A006":
                    otpErrorModalOn(modalMessages.authenticate_error_message_notExist_otp);
                    break;

                case "A007":
                    otpErrorModalOn(modalMessages.authenticate_error_message_expire_otp);
                    break;

                case "A008":
                    otpErrorProcessWhenLock(response.data["FAIL_COUNT"], response.data["REMAIN_SECOND_TIME"])
                    break;

                case "A009":
                    updateDomAfterOtpCheckLockTimeOut();
                    break;

                case "A010":
                    otpErrorProcessWhenFail(response.data["FAIL_COUNT"], response.data["REMAIN_SECOND_TIME"])
                    break;
            }
        }
    });
}
function otpSecondAuthenticate() {
    let inputOtp = $('#inputOtpCode').val().trim();

    if(inputOtp === "" || inputOtp.length === 0) {
        commonMessageModalOn(modalMessages.authenticate_validation_message_noInput_otp);
        $('#commonMessageModal .closeButton').on('click', function() {
            $('#commonMessageModal').hide();
        });
        return false;
    }

    let twoFactorAuthenticateDto = {
        "otpCode" : inputOtp,
        "twoFactorAuthenticateType" : twoFactorAuthenticateType.OTP
    }

    callTwoFactorAuthenticateApi(twoFactorAuthenticateDto).then(response => {
        if(response.status === 200) {
            requestVpnTunnelingOpen(osCode);
        }

        if(response.status === 400) {
            switch (response.code) {
                case "A006":
                    otpErrorModalOn(modalMessages.authenticate_error_message_notExist_otp);
                    break;

                case "A007":
                    otpErrorModalOn(modalMessages.authenticate_error_message_expire_otp);
                    break;

                case "A008":
                    otpErrorProcessWhenLock(response.data["FAIL_COUNT"], response.data["REMAIN_SECOND_TIME"])
                    break;

                case "A009":
                    updateDomAfterOtpCheckLockTimeOut();
                    break;

                case "A010":
                    otpErrorProcessWhenFail(response.data["FAIL_COUNT"], response.data["REMAIN_SECOND_TIME"])
                    break;
            }
        }
    });
}
function updateOtpFailCount(failCount) {
    updateDomText('otpCheckFailCount', failCount);
}
function updateOtpFailCountCss(addOrRemove) {
    const className = 'pointC';
    addOrRemove === true ? domAddClass('otpFailCheckDom', className) : domRemoveClass('otpFailCheckDom', className);
}
function updateLeftDomArea(domId, upMessage, downMessage) {
    let html = `<h2 class="subC">${upMessage}</h2>`;

    if(downMessage !== null) {
        html += `<h1 class="pointC">${downMessage}</h1>`;
    }

    updateDomHtml(domId, html);
}
function updateDomAfterOtpCheckLockTimeOut() {
    updateOtpFailCount(0);
    updateInputDomValue('inputOtpCode', '');
    updateDomAttribute('inputOtpCode', 'disabled', true);
    updateDomAttribute('inputOtpCode', 'placeholder', domMessage.pc_otp_right_otp_input_placeholder_reSend);
    updateOtpButtonStatus(false, domMessage.pc_otp_right_otpReSend_button, 'sendOtpCode(true);');
    updateOtpFailCountCss(false);
    domRemoveClass('inputOtpCode', 'errorInput');
}
function updateOtpButtonStatus(disabled, buttonText, onclickFunctionName) {
    updateDomAttribute('otpButton', 'disabled', disabled);
    updateDomText('otpButton', buttonText);
    removeDomAttribute('otpButton', 'onclick');
    updateDomAttribute('otpButton', 'onclick', onclickFunctionName);
}
function initOtpInitDom(maskingContactInfo) {
    updateInputDomValue('inputOtpCode', '');
    updateDomAttribute('inputOtpCode', 'disabled', false);
    updateDomAttribute('inputOtpCode', 'placeholder', domMessage.pc_otp_right_otp_input_placeholder);
    updateOtpButtonStatus(false, domMessage.pc_otp_right_otpCheck_button, 'otpCheck()');

    let html = `<h2>${domMessage.pc_otp_left_otpCheck_init_message_up}</h2>
                        <h2>
                            <div><span id="maskingContactInfo">${maskingContactInfo}</span></div>
                            <span>${domMessage.pc_otp_left_otpCheck_init_message_down}</span>
                        </h2>`;

    updateDomHtml('pc_auth_otp_left_contents', html);
}
function initOtpSecondAuthenticateDom(maskingContactInfo) {
    updateInputDomValue('inputOtpCode', '');
    updateDomAttribute('inputOtpCode', 'disabled', false);
    updateDomAttribute('inputOtpCode', 'placeholder', domMessage.pc_otp_right_otp_input_placeholder);
    updateOtpButtonStatus(false, domMessage.pc_otp_right_otpCheck_button, 'otpSecondAuthenticate()');

    let html = `<h2>${domMessage.pc_otp_left_otpCheck_message_up}</h2>
                        <h2>
                            <div><span id="maskingContactInfo">${maskingContactInfo}</span></div>
                            <span>${domMessage.pc_otp_left_otpCheck_init_message_down}</span>
                        </h2>`;

    updateDomHtml('pc_auth_otp_left_contents', html);
}
function otpErrorModalOn(message) {
    commonMessageModalOn(message);
    $('#commonMessageModal .closeButton').on('click', function() {
        updateDomAfterOtpCheckLockTimeOut();
        $('#commonMessageModal').hide();
    });
}
function otpErrorProcessWhenLock(failCount, remainTime) {
    updateOtpFailCount(failCount);
    updateOtpFailCountCss(true);
    updateDomAttribute('inputOtpCode', 'disabled', true);
    updateInputDomValue('inputOtpCode', '');
    updateDomAttribute('inputOtpCode', 'placeholder', domMessage.pc_otp_right_otp_input_lock_placeholder);
    domAddClass('inputOtpCode', 'errorInput');
    updateDomAttribute('otpButton', 'disabled', true);
    updateLeftDomArea('pc_auth_otp_left_contents', domMessage.pc_otp_left_otpCheckLock_message, domMessage.pc_otp_left_otpCheckLock_remainTime);
    startLockTimer(remainTime);
}
function otpErrorProcessWhenFail(failCount, remainTime) {
    updateOtpFailCount(failCount);
    updateOtpFailCountCss(true);

    if(failCount < otpCheckCount) {
        updateInputDomValue('inputOtpCode', '');
        inputDomFocus('inputOtpCode');
        updateDomAttribute('inputOtpCode', 'placeholder', domMessage.pc_signIn_right_password_input_fail_placeholder);
        domAddClass('inputOtpCode', 'errorInput');
    }

    if(failCount >= otpCheckCount) {
        updateDomAttribute('inputOtpCode', 'disabled', true);
        updateInputDomValue('inputOtpCode', '');
        updateDomAttribute('inputOtpCode', 'placeholder', domMessage.pc_otp_right_otp_input_lock_placeholder);
        domAddClass('inputOtpCode', 'errorInput');
        updateDomAttribute('otpButton', 'disabled', true);
        updateLeftDomArea('pc_auth_otp_left_contents', domMessage.pc_otp_left_otpCheckLock_message, domMessage.pc_otp_left_otpCheckLock_remainTime);
        startLockTimer(remainTime);
    }
}