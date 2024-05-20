let mfaTypes = {
    'biometric' : 'biometric',
    'pin' : 'pin',
    'pattern' : 'pattern'
};
const pinPatternMaxFailCount = 5;

window.addEventListener('load', function(){
    webMessage.addWebCallback(
        (event)=> {
            console.log("notifyPushMessageCallback", event);
            if(event.msg === "bio_push_requested") {
                let authToken = event.data["authtoken"]["authToken"];
                let vpnTypeCd = event.data["authtoken"]["vpnTypeCd"];
                let mfaPinLen = Number(event.data["authtoken"]["mfaPinLen"]);
                let mfaPatternSize =Number( event.data["authtoken"]["mfaPatternSize"]);
                let mfaFailCnt = Number(event.data["authtoken"]["mfaFailCnt"]);

                if((vpnTypeCd === mfaTypes.pin || vpnTypeCd === mfaTypes.pattern) && mfaFailCnt === pinPatternMaxFailCount) {
                    pinPatternAuthMaxFailModalOn(authToken);
                } else {
                    if (vpnTypeCd === mfaTypes.pin) {
                        pinMfaAuthModalOn(mfaFailCnt, mfaPinLen, authToken);
                    } else if (vpnTypeCd === mfaTypes.pattern) {
                        patternMfaAuthModalOn(mfaFailCnt, mfaPatternSize, authToken);
                    } else {
                        requestBioAuth(authToken);
                    }
                }
            }
        },
        (event)=> {
            console.log("responseBioAuthCallback", event);
            let bioAuthResult = event.data.result;

            if(bioAuthResult === 'ok') {
                let authToken = event.data.authtoken;
                callUpdateMfaDeviceAuthTokenResultApi(authToken).then(response=> {
                    console.log(response);
                });
            } else {
                callSendMfaAuthErrorApi(event.data["authtoken"]).then(response => {
                    console.log(response);
                });
            }
        },
        (event)=> {
            console.log("responseBioSecretCallback", event);
            let getBioSecretResult = event.data.result;
            switch (pageName) {
                case "MOBILE_DEVICE-MANAGEMENT":
                    if(getBioSecretResult === 'ok' && currentMode === 'ADD') {
                        addMfaDevice();
                    }

                    if(getBioSecretResult === 'ok' && currentMode === 'UPDATE') {
                        updateMfaDevice();
                    }

                    break;
            }
        },
        (event)=> {
            console.log("responsePushToken", event);
            let currentPushToken = getPushTokenFromLocalStorage();
            let newPushToken = event.data["push_token"];

            /*if(currentPushToken === null || currentPushToken.length === 0) {
                let appToken = findAppToken();
                if(appToken === null || appToken.length === 0) {
                    return;
                }

                let dto = {
                    "appToken" : appToken,
                    "newPushToken" : newPushToken
                }

                callUpdatePushTokenByAppTokenApi(dto).then(response => {
                    if(response.status === 200) {
                        updatePushTokenInLocalStorage(newPushToken);
                    }

                    if(response.status === 400) {
                        switch (response.code) {
                            // not found user by appToken(유효하지 않은 app token)
                            case "A002":
                                commonMessageModalOn(modalMessage.modal_mfaAuth_requestFail_title, modalMessage.modal_mfaAuth_requestFail_message1,  modalMessage.modal_common_button_close);
                                $('#m_modal_message-box #modalCloseButton').on('click',function(){
                                    deleteAppToken();
                                    $('#m_modal_message-box').hide();
                                });

                                break;

                            // not Register MFA Device
                            case "M005":
                                commonMessageModalOn(modalMessage.modal_mfaAuth_requestFail_title, modalMessage.modal_mfaAuth_requestFail_message2,  modalMessage.modal_common_button_close);
                                $('#m_modal_message-box #modalCloseButton').on('click',function(){
                                    $('#m_modal_message-box').hide();
                                });

                                break;
                        }
                    }
                });
            } else {
                if(currentPushToken !== newPushToken) {
                    let dto = {
                        "currentPushToken" : currentPushToken,
                        "newPushToken" : newPushToken
                    }
                    callUpdatePushTokenApi(dto).then(response => {
                        console.log("update push token : " +response);
                        updatePushTokenInLocalStorage(newPushToken);
                    });
                }
            }*/

            if((currentPushToken !== null && currentPushToken.length !== 0) && (currentPushToken !== newPushToken)) {
                let dto = {
                    "currentPushToken" : currentPushToken,
                    "newPushToken" : newPushToken
                }
                callUpdatePushTokenApi(dto).then(response => {
                    console.log("update push token : " +response);
                    updatePushTokenInLocalStorage(newPushToken);
                });
            }
        },
        (event)=> {
            console.log("responseGetAppInfo", event);
            let getAppInfoResult = event.data.result;
            switch (pageName) {
                case "MOBILE_FIRST-AUTHENTICATE-START":
                    $('#m_modal_loading').hide();
                    getAppInfoResult  === 'ok' ? checkMFADeviceBioAvailable(event.data.info) : alertAgentError(event.data.result);
                    break;

                case "MOBILE_DEVICE-MANAGEMENT":
                    const appInfo = event.data.info;
                    startSecondaryAuthenticationSelectModalOn(appInfo);
                    break;
            }
        }
    );
});

function requestBioAuth(authToken){
    webMessage.requestBioAuth(authToken);
}
function sendBioRegister(appSecret) {
    webMessage.registerBioSecret(appSecret);
}
function requestPushToken(){
    webMessage.requestPushToken();
}
function activeMDM(compCd_loginEmp){
    webMessage.activateMDM(compCd_loginEmp);
}
function checkAppPackage() {
    webMessage.requestCheckAppPackage();
}
function getNPassAgentAppInfo() {
    webMessage.requestAppInfo();
}
function alertAgentError(message) {
    alert(message);
}
function updateIsAppToSession() {
    callSetIsAppApi(isApp()).then(response => {
        if(response.status === 400) {
            location.href = "/error/400";
        }

        if(response.status === 500) {
            location.href = "/error/500";
        }
    });
}

async function callUpdateMfaDeviceAuthTokenResultApi(authToken) {
    const res = await fetch(`/api/v1/mfa-devices/auth-token-result`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body : JSON.stringify({"authToken" : authToken})
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
async function callNPassAgentPushNotificationApi() {
    const res = await fetch(`/api/agent/notification`, {
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
async function callSendMfaAuthErrorApi(authToken) {
    const res = await fetch(`/api/v1/mfa-devices/send-error?authToken=${authToken}`, {
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
    return res;
}
async function callSetIsAppApi(isApp) {
    const res = await fetch(`/api/user-access-info/isApp?isApp=${isApp}`, {
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

    return res;
}
async function callUpdatePushTokenApi(pushTokenUpdateDto) {
    const res = await fetch(`/api/v1/mfa-devices/update/push-token`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(pushTokenUpdateDto)
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

async function callUpdatePushTokenByAppTokenApi(pushTokenUpdateDto) {
    const res = await fetch(`/api/v1/mfa-devices/update/push-token/app-token`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(pushTokenUpdateDto)
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

async function callInitMfaDeviceByAppTokenApi(mfaDeviceInitDto) {
    const res = await fetch(`/api/v1/mfa-devices/init`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(mfaDeviceInitDto)
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

function updatePushTokenInLocalStorage(pushToken) {
    osType === "I" ? setCookie("PUSH_TOKEN", pushToken) : localStorage.setItem("PUSH_TOKEN", pushToken);
}

function getPushTokenFromLocalStorage() {
    return osType === "I" ? getCookie("PUSH_TOKEN") : localStorage.getItem("PUSH_TOKEN");
}

function downloadVpnAgent(osCode, vpnAgentFileRef) {
    let downloadPath = osCode === "I"
        ? 'itms-services://?action=download-manifest&amp;url=https://vpn.daesang.com/api/agent/plist/iOS.plist'
        : window.location.protocol.concat("//").concat(window.location.host).concat(`/api/files/${vpnAgentFileRef}`);

    isApp()
        ? webMessage.openDeepLink(downloadPath)
        : location.href = downloadPath;
}