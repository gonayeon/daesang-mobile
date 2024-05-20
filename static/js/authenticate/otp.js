$(function(){
    if(findAppToken() !== null) {
        $('#autoConnectCheckbox').attr('checked', true);

        if(pageName === "MOBILE_OTP-INIT") {
            $('#autoConnectCheckbox').attr('checked', false);
            updateVpnAppToken();
        }
    }
});
function otpCheck() {
    let inputOtp = $('#m-otp_code').val().trim();
    if(inputOtp === "" || inputOtp.length === 0) {
        commonMessageModalOn(modalMessage.modal_common_title_error, modalMessage.authenticate_validation_message_noInput_otp, modalMessage.modal_common_button_confirm);
        $('#m_modal_message-box #modalCloseButton').on('click',function(){
            $('#m_modal_message-box').hide();
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
                    otpErrorModalOn(modalMessage.authenticate_error_message_notExist_otp);
                    break;

                case "A007":
                    otpErrorModalOn(modalMessage.authenticate_error_message_expire_otp);
                    break;

                case "A008":
                    otpErrorProcessWhenLock(response.data["FAIL_COUNT"], response.data["REMAIN_SECOND_TIME"]);
                    break;

                case "A009":
                    updateDomAfterOtpCheckLockTimeOut();
                    break;

                case "A010":
                    otpErrorProcessWhenFail(response.data["FAIL_COUNT"], response.data["REMAIN_SECOND_TIME"]);
                    break;
            }
        }
    });
}
function otpSecondAuthenticate() {
    let inputOtp = $('#m-otp_code').val().trim();

    if(inputOtp === "" || inputOtp.length === 0) {
        commonMessageModalOn(modalMessage.modal_common_title_error, modalMessage.authenticate_validation_message_noInput_otp, modalMessage.modal_common_button_confirm);
        $('#m_modal_message-box #modalCloseButton').on('click',function(){
            $('#m_modal_message-box').hide();
        });
        return false;
    }

    let twoFactorAuthenticateDto = {
        "otpCode" : inputOtp,
        "twoFactorAuthenticateType" : twoFactorAuthenticateType.OTP
    }

    callTwoFactorAuthenticateApi(twoFactorAuthenticateDto).then(response => {
        if(response.status === 200) {
            response.data["ACCESS_OBJECT"] === "vpnAccess"
                ? location.href = "/vpn/open-start"
                : location.href = "/device/management";
        }

        if(response.status === 400) {
            switch (response.code) {
                case "A006":
                    otpErrorModalOn(modalMessage.authenticate_error_message_notExist_otp);
                    break;

                case "A007":
                    otpErrorModalOn(modalMessage.authenticate_error_message_expire_otp);
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
    addOrRemove === true ? domAddClass('m_otp_wrongCount', className) : domRemoveClass('m_otp_wrongCount', className);
}
function updateDomAfterOtpCheckLockTimeOut() {
    updateOtpFailCount(0);
    updateInputDomValue('m-otp_code', '');
    updateDomAttribute('m-otp_code', 'disabled', true);
    updateDomAttribute('m-otp_code', 'placeholder', domMessage.mobile_otp_otp_input_resend_placeholder);
    updateOtpButtonStatus(false, domMessage.mobile_otp_otp_button_resend, 'sendOtpCode(true);');
    updateOtpFailCountCss(false);
    domRemoveClass('m-otp_code', 'errorInput');
}
function updateOtpButtonStatus(disabled, buttonText, onclickFunctionName) {
    updateDomAttribute('m_otp_code_button', 'disabled', disabled);
    updateDomText('m_otp_code_button', buttonText);
    removeDomAttribute('m_otp_code_button', 'onclick');
    updateDomAttribute('m_otp_code_button', 'onclick', onclickFunctionName);
}
function initOtpInitDom(maskingContactInfo) {
    updateInputDomValue('m-otp_code', '');
    updateDomAttribute('m-otp_code', 'disabled', false);
    updateDomAttribute('m-otp_code', 'placeholder', domMessage.mobile_otp_otp_input_default_placeholder);
    updateOtpButtonStatus(false, domMessage.mobile_otp_otp_button_default, 'otpCheck()');

    let html = `
                        <p>${domMessage.mobile_otp_otp_message_default1}</p>
                        <p>
                            <span id="maskingContactInfo" class="pointC">${maskingContactInfo}</span>
                            <span class="subC">${domMessage.mobile_otp_otp_message_default2}</span>
                        </p>`;

    updateDomHtml('m_otp_guide', html);
}
function initOtpSecondAuthenticateDom(maskingContactInfo) {
    updateInputDomValue('m-otp_code', '');
    updateDomAttribute('m-otp_code', 'disabled', false);
    updateDomAttribute('m-otp_code', 'placeholder', domMessage.mobile_otp_otp_input_default_placeholder);
    updateOtpButtonStatus(false, domMessage.mobile_otp_otp_button_default, 'otpSecondAuthenticate()');

    let html = `<p>${domMessage.mobile_otp_otpSecond_message_default}</p>
                       <p>
                           <span id="maskingContactInfo" class="pointC">${maskingContactInfo}</span>
                           <span class="subC">${domMessage.mobile_otp_otp_message_default2}</span>
                       </p>`;

    updateDomHtml('m_otp_guide', html);
}
function otpErrorModalOn(message) {
    commonMessageModalOn(modalMessage.modal_common_title_error, message, modalMessage.modal_common_button_confirm);
    $('#m_modal_message-box #modalCloseButton').on('click',function(){
        $('#m_modal_message-box').hide();
        updateDomAfterOtpCheckLockTimeOut();
    });
    return false;
}
function otpErrorProcessWhenLock(failCount, remainTime) {
    updateOtpFailCount(failCount);
    updateOtpFailCountCss(true);

    updateDomAttribute('m-otp_code', 'disabled', true);
    updateInputDomValue('m-otp_code', '');
    updateDomAttribute('m-otp_code', 'placeholder', domMessage.mobile_otp_otp_input_lock_placeholder);
    domAddClass('m-otp_code', 'errorInput');

    updateDomAttribute('m_otp_code_button', 'disabled', true);

    updateMessageDomArea('m_otp_guide', domMessage.mobile_otp_message_otpCheckLock_remainTime, domMessage.mobile_otp_message_otpCheckLock_message, 'pointC')

    startLockTimer(remainTime);
}
function otpErrorProcessWhenFail(failCount, remainTime) {
    updateOtpFailCount(failCount);
    updateOtpFailCountCss(true);

    if(failCount < otpCheckCount) {
        updateInputDomValue('m-otp_code', '');
        inputDomFocus('m-otp_code');
        updateDomAttribute('m-otp_code', 'placeholder', domMessage.mobile_otp_otp_input_fail_placeholder);
        domAddClass('m-otp_code', 'errorInput');
    }

    if(failCount >= otpCheckCount) {
        updateDomAttribute('m-otp_code', 'disabled', true);
        updateInputDomValue('m-otp_code', '');
        updateDomAttribute('m-otp_code', 'placeholder', domMessage.mobile_otp_otp_input_lock_placeholder);
        domAddClass('m-otp_code', 'errorInput');

        updateDomAttribute('m_otp_code_button', 'disabled', true);

        updateMessageDomArea('m_otp_guide', domMessage.mobile_otp_message_otpCheckLock_remainTime, domMessage.mobile_otp_message_otpCheckLock_message, 'pointC')

        startLockTimer(remainTime);
    }
}
function updateMessageDomArea(domId, upMessage, downMessage, className) {
    let html = `<h3 class="${className}">${upMessage}</h3>`;

    if(downMessage !== null) {
        html += `<p>${downMessage}</p>`;
    }

    updateDomHtml(domId, html);
}