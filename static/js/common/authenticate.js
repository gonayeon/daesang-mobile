const vpnAppTokenName = "VPN_APP_TOKEN";
const authenticationMethod = {
    "APP_TOKEN" : "APP_TOKEN",
    "ID_PW" : "ID_PW"
}
const twoFactorAuthenticateType = {
    "OTP" : "OTP",
    "MFA" : "MFA"
}

function findAppToken() {
    let nameEQ = vpnAppTokenName + "=";
    let cookies = document.cookie.split(';');

    for(let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];

        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1, cookie.length);
        }

        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}
function deleteAppToken() {
    document.cookie = vpnAppTokenName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
function startVpnUserStatus(loginEmp, compCd, authenticateMethod, isAutoConnect, compPasswordUseYn, mdmUseFlag, accessObject) {
    let userStatusCheckDto = createVpnUserStatusCheckDto(loginEmp, compCd, authenticateMethod, isAutoConnect, compPasswordUseYn, mdmUseFlag);
    checkVpnUserStatus(userStatusCheckDto, accessObject);
}
function createVpnUserStatusCheckDto(loginEmp, compCd, authenticateMethod, isAutoConnect, compPasswordUseYn, mdmUseFlag) {
    let dto = {
        "loginEmp" : loginEmp,
        "compCd" : compCd,
        "authenticationMethod" : authenticateMethod,
        "isAutoConnect" : isAutoConnect,
        "compPasswordUseYn" : compPasswordUseYn,
        "mdmUseFlag" : mdmUseFlag,
    }

    return dto;
}
function checkVpnUserStatus(userStatusCheckDto, accessObject) {
    callVpnUserStatusCheckApi(userStatusCheckDto).then(response => {
        if(response.status === 200) {
            vpnUserStatusCheck = true;

            if(pageName === "PC_MAIN") {
                location.href = response.data;
            }

            if(pageName === "MOBILE_FIRST-AUTHENTICATE-START") {
                if(isApp() && userStatusCheckDto.mdmUseFlag === 'Y'){
                    activeMDM(userStatusCheckDto.compCd.concat(userStatusCheckDto.loginEmp));
                }
                location.href = response.data;
            }

            if(accessObject === "vpnAccess") {
                if(isApp() && userStatusCheckDto.mdmUseFlag === 'Y'){
                    activeMDM(userStatusCheckDto.compCd.concat(userStatusCheckDto.loginEmp));
                }
                location.href = response.data +'?accessObject=vpnAccess';
            }

            if(pageName === "PC_SIGN-IN") {
                let compPasswordUseYn = userStatusCheckDto.compPasswordUseYn;

                if(compPasswordUseYn === "Y" && response.data === "") {
                    updateDomAfterVpnUserStatusCheckWhenPasswordUseY();
                }

                if(compPasswordUseYn === "N" && response.data.startsWith("/")) {
                    location.href = response.data;
                }

                if(compPasswordUseYn === "N" && !response.data.startsWith("/")) {
                    let contactInfo = response.data.split("_")[0];
                    let otpType = response.data.split("_")[1];
                    updateDomAfterVpnUserStatusCheckWhenPasswordUseNAndMFANull(contactInfo, otpType);
                }
            }

            if(pageName === "MOBILE_SIGN-IN") {
                if(isApp() && userStatusCheckDto.mdmUseFlag === 'N'){
                    checkAppPackage();
                }

                let compPasswordUseYn = userStatusCheckDto.compPasswordUseYn;

                if(compPasswordUseYn === "Y" && response.data === "") {
                    updateDomAfterVpnUserStatusCheckWhenPasswordUseY();
                }

                if(compPasswordUseYn === "N" && response.data.startsWith("/")) {
                    if(isApp() && userStatusCheckDto.mdmUseFlag === 'Y'){
                        activeMDM(userStatusCheckDto.compCd.concat(userStatusCheckDto.loginEmp));
                    }

                    location.href = response.data;
                }

                if(compPasswordUseYn === "N" && !response.data.startsWith("/")) {
                    if(isApp() && userStatusCheckDto.mdmUseFlag === 'Y'){
                        activeMDM(userStatusCheckDto.compCd.concat(userStatusCheckDto.loginEmp));
                    }

                    let contactInfo = response.data.split("_")[0];
                    let otpType = response.data.split("_")[1];
                    updateDomAfterVpnUserStatusCheckWhenPasswordUseNAndMFANull(contactInfo, otpType);
                }
            }
        }

        if(response.status === 400) {
            if(pageName === "PC_MAIN") {
                commonMessageModalOn(response.data);
                $('#commonMessageModal .closeButton').on('click', function() {
                    deleteAppToken();
                    location.href = "/authenticate/sign-in";
                });
            }

            if(pageName === "PC_SIGN-IN") {
                vpnUserStatusCheck = false;

                commonMessageModalOn(response.data);
                $('#commonMessageModal .closeButton').on('click', function() {
                    $('#pc_signIn_id').focus();
                    $('#commonMessageModal').hide();
                    return false;
                });
            }

            if(pageName === "MOBILE_FIRST-AUTHENTICATE-START") {
                commonMessageModalOn(modalMessage.modal_common_title_error, response.data, modalMessage.modal_common_button_confirm);
                $('#m_modal_message-box #modalCloseButton').on('click',function(){
                    deleteAppToken();
                    location.href = "/authenticate/sign-in";
                });
            }

            if(accessObject === "vpnAccess") {
                commonMessageModalOn(modalMessage.modal_common_title_error, response.data, modalMessage.modal_common_button_confirm);
                $('#m_modal_message-box #modalCloseButton').on('click',function(){
                    deleteAppToken();
                    location.href = `/authenticate/sign-in?accessObject=vpnAccess`;
                });
            }

            if(pageName === "MOBILE_SIGN-IN") {
                vpnUserStatusCheck = false;
                let modalTitle;

                switch (response.code) {
                    case "N001" :
                        modalTitle = modalMessage.modal_common_title_error;
                        break;

                    case "A012" :
                        modalTitle = modalMessage.modal_error_title_lock;
                        break;

                    case "A013" :
                        modalTitle = modalMessage.modal_error_title_absence;
                        break;

                    case "A014" :
                        modalTitle = modalMessage.modal_error_title_expire;
                        break;

                    default:
                        modalTitle = modalMessage.modal_common_title_error;
                        break;
                }

                commonMessageModalOn(modalTitle, response.data,  modalMessage.modal_common_button_confirm);
                $('#m_modal_message-box #modalCloseButton').on('click',function(){
                    $('#m_id-pw_input_id').focus();
                    $('#m_modal_message-box').hide();
                    return false;
                });
            }
        }
    });
}
let x
function startLockTimer(remainSecond) {
    let time = remainSecond;
    let min = "";
    let sec = "";

    x = setInterval(function() {
        min = parseInt(time / 60);
        sec = time % 60;

        let minUtit = (locale === 'ko' || locale === 'ko_KR') ? '분  ' : 'm  ';
        let secUtit= (locale === 'ko' || locale === 'ko_KR') ? '초' : 's';

        updateDomText('lockRemainTime', (min + minUtit + sec +secUtit));

        time--;

        if (time < 0) {
            clearInterval(x);
            updateDomText('lockRemainTime', "0" +secUtit);

            switch (pageName) {
                case "PC_SIGN-IN" :
                    updateDomAfterPasswordCheckLockTimeOut();
                    break;

                case "PC_OTP-INIT" :
                    updateDomAfterOtpCheckLockTimeOut();
                    break;

                case "PC_OTP-SECOND_AUTHENTICATE" :
                    updateDomAfterOtpCheckLockTimeOut();
                    break;

                case "MOBILE_SIGN-IN" :
                    updateDomAfterPasswordCheckLockTimeOut();
                    break;

                case "MOBILE_OTP-INIT" :
                    updateDomAfterOtpCheckLockTimeOut();
                    break;

                case "MOBILE_OTP-SECOND_AUTHENTICATE" :
                    updateDomAfterOtpCheckLockTimeOut();
                    break;
            }

        }
    }, 1000);
}
function sendOtpCode(isResend) {
    let isAutoConnect = false;
    if(pageName === "PC_SIGN-IN" || pageName === "MOBILE_SIGN-IN") {
        isAutoConnect = $('#autoConnectCheckbox').is(':checked');
    }

    callSendOtpCodeApi(isResend, isAutoConnect).then(response => {
        if(response.status === 200) {
            switch (pageName) {
                case "PC_SIGN-IN":
                    let passwordUseYn = $('#pc_sign-in_toggle_feild span').attr('id').split("_")[2];
                    location.href = passwordUseYn === "Y" ? "/authenticate/otp-init" : "/authenticate/otp";
                    break;

                case "PC_OTP-INIT":
                    initOtpInitDom(response.data);
                    break;

                case "PC_OTP-SECOND_AUTHENTICATE":
                    initOtpSecondAuthenticateDom(response.data);
                    break;

                case "MOBILE_SIGN-IN":
                    let passwordUseFlag = $('#m_id-pw_toggle_feild span').attr('id').split("_")[2];
                    location.href = passwordUseFlag === "Y" ? "/authenticate/otp-init" : "/authenticate/otp";
                    break;

                case "MOBILE_OTP-INIT":
                    initOtpInitDom(response.data);
                    break;

                case "MOBILE_OTP-SECOND_AUTHENTICATE":
                    initOtpSecondAuthenticateDom(response.data);
                    break;

                case "PC_MFA-SECOND_AUTHENTICATE":
                    location.href='/authenticate/otp';
                    break;

                case "MOBILE_MFA-SECOND_AUTHENTICATE":
                    location.href='/authenticate/otp';
                    break;

                case "MOBILE_SET-PASSWORD":
                    location.href='/authenticate/otp';
                    break;
            }
        }

        if(response.status === 400 && response.code === 'A005') {
            location.href = response.data;
        }
    });
}
function updateVpnAppToken() {
    let isChecked = $('#autoConnectCheckbox').is(':checked');

    let dto = {
        "isAutoConnection" : isChecked,
        "appToken" : findAppToken()
    }

    callUpdateVpnAppTokenApiApi(dto).then(response => {
        if(response.status === 400) {
            location.href = "/error/400";
        }

        if(response.status === 500) {
            location.href = "/error/500";
        }
    });
}

function updateAutoConnectionCheckbox() {
    let autoConnectionEnableFromLocalStorage = getAutoConnectionEnableFromLocalStorage();
    $('#autoConnectCheckbox').attr('checked', autoConnectionEnableFromLocalStorage);
}

function getAutoConnectionEnableFromLocalStorage() {
    let autoConnection = osType === "I" ? getCookie("AUTH_CONNECTION_ENABLE") : localStorage.getItem("AUTH_CONNECTION_ENABLE")
    if(autoConnection === null) {
        return true;
    }

    return JSON.parse(autoConnection);
}

function updateAutoConnectionEnable() {
    let isChecked = $('#autoConnectCheckbox').is(':checked');
    osType === "I" ? setCookie("AUTH_CONNECTION_ENABLE", isChecked) : localStorage.setItem("AUTH_CONNECTION_ENABLE", isChecked);
}

function updateVpnAuthLogType() {
    let authType = pageName === "MOBILE_DEVICE-MANAGEMENT" ? "M" : "A";
    callUpdateVpnAuthLogTypeApi(authType).then(response => {
        console.log(response);
    });
}