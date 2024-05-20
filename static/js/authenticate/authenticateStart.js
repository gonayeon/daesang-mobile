window.onload = function() {
    checkMFADevice();
};

function checkMFADevice() {
    commonLoadingModalOn(modalMessage.modal_loading_title_wait, modalMessage.modal_loading_message_wait);

    setTimeout(() => {
        isApp() ? getNPassAgentAppInfo() : returnToMain();
    }, 2000);
}

function checkVpnAppToken() {
    findAppToken() === null
        ? location.href="/authenticate/sign-in" :
        startVpnUserStatus(null, null, authenticationMethod.APP_TOKEN, false, null, null);
}

function checkMFADeviceBioAvailable(appInfo) {
    let isBioAvailable = appInfo["is-bio-available"];
    let bioErrorCode = appInfo["bio-error-code"];
    //isBioAvailable ? checkVpnAppToken() : returnToMain(bioErrorCode);

    checkVpnAppToken();
}

function returnToMain(bioErrorCode) {
    let title = "ERROR";
    let message = "ERROR";

    if(bioErrorCode === BIOMETRIC_UNAVAILABLE || typeof bioErrorCode == "undefined") {
        title = modalMessage.modal_mfaCheck_error_title_notSupport;
        message = modalMessage.modal_mfaCheck_error_message_notSupport;
    }

    if(bioErrorCode === BIOMETRIC_NOT_ENROLLED) {
        title = modalMessage.modal_mfaCheck_error_title_notEnrolled;
        message = modalMessage.modal_mfaCheck_error_message_notEnrolled;
    }

    commonMessageModalOn(title, message, modalMessage.modal_common_button_close);
    $('#m_modal_message-box #modalCloseButton').on('click',function(){
        $('#m_modal_message-box').hide();
        location.href = "/"
    });
}