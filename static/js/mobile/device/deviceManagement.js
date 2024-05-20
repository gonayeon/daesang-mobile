$(function () {
    updateVpnAuthLogType();
    findMfaDevice();
});

const mfaDeviceEditModes = {
    'ADD' : 'ADD',
    'UPDATE' : 'UPDATE',
}

let mfaDeviceAddDto = {};
let mode;
let deviceMfaType;
let currentMode;
let currentAppInfo;

function startAddOrUpdateMfaDevice(inputMode) {
    // check App, is not app return
    if(!isApp()) {
        commonMessageModalOn(modalMessage.modal_common_title_error, modalMessage.modal_deviceManagement_message_notApp, modalMessage.modal_common_button_confirm);
        $('#m_modal_message-box #modalCloseButton').on('click', function() {
            $('#m_modal_message-box').hide();
        });
        return;
    }

    // set current mode : ADD or UPDATE
    currentMode = inputMode;

    // get AppInfo
    getNPassAgentAppInfo();
}

function startSecondaryAuthenticationSelectModalOn(appInfo) {
    currentAppInfo = appInfo;
    let isBioAvailable = currentAppInfo["is-bio-available"];
    secondaryAuthenticationSelectModalOn(isBioAvailable);
}

function addOrUpdateMfaDevice(mfaType) {
    deviceMfaType = mfaType;

    let pushToken = currentAppInfo["fcm-token"];
    updatePushTokenInLocalStorage(pushToken);

    mfaDeviceAddDto = {
        "mfaType" : mfaType === mfaTypes.biometric ? currentAppInfo["bio-type"] : mfaType,
        "pushToken" : pushToken,
    }

    // Biometric
    if(mfaType === mfaTypes.biometric) {
        // MFA type이 biometric 인데 생체인증 미지원 기기면 return
        if(!currentAppInfo["is-bio-available"]) {
            commonMessageModalOn(modalMessage.modal_common_title_error, modalMessage.modal_deviceManagement_message_notSupportBio, modalMessage.modal_common_button_confirm);
            $('#m_modal_message-box #modalCloseButton').on('click', function() {
                $('#m_modal_message-box').hide();
            });
            return;
        }

        callCreateMfaAuthSecretApi().then(response => {
            if(response.status === 200) {
                mfaDeviceAddDto.authSecret = response.data;
                sendBioRegister(response.data);
            }
        });
    }

    // Pattern
    if(mfaType === mfaTypes.pattern) {
        patternRegisterModalOn('REGISTER', mfaPatternSize);
    }

    // PIN
    if(mfaType === mfaTypes.pin) {
        pinRegisterModalOn('REGISTER', mfaPinLen);
    }
}

function addMfaDevice() {
    $('#secondaryAuthenticationSelectModal').hide();

    callAddMfaDeviceApi(mfaDeviceAddDto).then(response => {
        if(response.status === 200) {
            mfaDeviceRegisterSuccessModalOn(modalMessage[`modal_secondary_authenticate_${deviceMfaType}_register_success_message`]);
            findMfaDevice();
        };

        if(response.status === 400 && response.code === 'M004') {
            alert(response.message);
            return;
        }

        if(response.status === 400 && response.code === 'A005') {
            location.href = response.data;
            return;
        }
    });
}

function findMfaDevice() {
    callFindMfaDeviceApi().then(response => {
        if(response.status === 400 && response.code === 'A005') {
            location.href = response.data;
            return;
        }

        drawMfaDeviceInfo(response.data);
    });
}

function drawMfaDeviceInfo(mfaDeviceInfo) {
    $('#m_device-management_contents').empty();

    let html;

    if(mfaDeviceInfo === null) {
        html = `<button id="m_device-management_button_device_add" onclick="startAddOrUpdateMfaDevice(mfaDeviceEditModes.ADD);">
                    <img src="/images/mobile/m_plus.png">
                    <span>${domMessage.mobile_deviceManagement_deviceAdd_button}</span>
                </button>`;
    } else {
        html = `<ul>
                    <li>
                        <div class="m_device-management_contents_title">
                            <div class="m_device-management_list_title">
                                <div>
                                    <h3>${domMessage.mobile_deviceManagement_deviceInfo_title}</h3>
                                    <span>${mfaDeviceInfo.createDt}</span>
                                </div>
                                <span>${domMessage.mobile_deviceManagement_deviceInfo_message}</span>
                            </div>
    
                            <button class="m_device-management_button" type="button" onclick="mfaConfirmModalOn(${mfaDeviceInfo.mfaDeviceId})">
                                <img class="m_three-dot" src="/images/mobile/m_three-dot.png">
                            </button>
                        </div>
                    </li>
                </ul>
           
                <div id="m_device-management_detail_show">
                    <div class="m_device-management_contents_detail">
                        <ul class="deviceInfoDom" id="mfaDeviceId_${mfaDeviceInfo.mfaDeviceId}">
                            <li>
                                <h3>${domMessage.mobile_deviceManagement_deviceInfo_modelName}</h3>
                                <p>${mfaDeviceInfo.deviceInfo}</p>
                            </li>
                            <li>
                                <h3>${domMessage.mobile_deviceManagement_deviceInfo_registDate}</h3>
                                <p>${mfaDeviceInfo.createDt}</p>
                            </li>
                            <li>
                                <h3>${domMessage.mobile_deviceManagement_deviceInfo_os}</h3>
                                <p>${mfaDeviceInfo.osInfo}</p>
                            </li>
                            <li>
                                <h3>${domMessage.mobile_deviceManagement_deviceInfo_mfaType}</h3>
                                <p>${mfaDeviceInfo.mfaTypeName}</p>
                            </li>
                        </ul>
                    </div>
                </div>`;
    }

    $('#m_device-management_contents').append(html);
}

function startUpdateMfaDevice() {
    commonMessageTwoButtonModalOn(modalMessage.modal_deviceManagement_update_title, modalMessage.modal_deviceManagement_update_message, modalMessage.modal_deviceManagement_update_buttonLeft, modalMessage.modal_deviceManagement_update_buttonRight);

    $('#m_modal_two-button_left').on('click',function(){
        $('#m_common_two-button_modal').hide();
        return;
    });

    $('#m_modal_two-button_right').on('click',function(){
        $('#m_common_two-button_modal').hide();
        startAddOrUpdateMfaDevice(mfaDeviceEditModes.UPDATE);
    });
}

function updateMfaDevice() {
    let mfaDeviceId = $('.deviceInfoDom').attr('id').split("_")[1];
    callDeleteMfaDeviceApi(mfaDeviceId).then(response => {
        if(response.status === 200) {
            $('#m_common_two-button_modal').hide();
            addMfaDevice();
        }

        if(response.status === 400 && response.code === 'A005') {
            location.href = response.data;
            return;
        }
    });
}

function startDeleteMfaDevice() {
    commonMessageTwoButtonModalOn(modalMessage.modal_deviceManagement_delete_title, modalMessage.modal_deviceManagement_delete_message, modalMessage.modal_deviceManagement_delete_buttonLeft, modalMessage.modal_deviceManagement_delete_buttonRight);

    $('#m_modal_two-button_left').on('click',function(){
        $('#m_common_two-button_modal').hide();
        return;
    });

    $('#m_modal_two-button_right').on('click',function(){
        let mfaDeviceId = $('.deviceInfoDom').attr('id').split("_")[1];
        callDeleteMfaDeviceApi(mfaDeviceId).then(response => {
            if(response.status === 200) {
                $('#m_common_two-button_modal').hide();
                findMfaDevice();
            }

            if(response.status === 400 && response.code === 'A005') {
                location.href = response.data;
                return;
            }
        });
    });
}

async function callCreateMfaAuthSecretApi() {
    const res = await fetch(`/api/v1/mfa-devices/create/auth-secret`, {
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
async function callFindMfaDeviceApi() {
    const res = await fetch(`/api/v1/mfa-devices`, {
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
async function callAddMfaDeviceApi(addDto) {
    const res = await fetch(`/api/v1/mfa-devices`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(addDto)
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
async function callDeleteMfaDeviceApi(mfaDeviceId) {
    const res = await fetch(`/api/v1/mfa-devices/${mfaDeviceId}`, {
        method: 'DELETE',
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