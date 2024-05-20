function disconnectionModalOn(modalTitle, modalMessage) {
    const mobileModalShow = document.getElementById('m_modal_show');
    mobileModalShow.innerHTML = "";

    let html = `
        <div class="mobileModal" id="m_modal_disconnection">
            <div>
                <div>
                    <div class="m_modal_image">
                        <img src="/images/mobile/m_modal_x-mark.png" alt="x마크">
                    </div>
                    <p>${modalTitle}</p>
                    <p>${modalMessage}</p>
                </div>
            </div>
        </div>`;

    mobileModalShow.innerHTML= html;
    $('#m_modal_disconnection').show();
}

function commonLoadingModalOn(loadingTitle, loadingMessage, addButton, buttonTag) {
    const mobileModalShow = document.getElementById('m_modal_show');
    mobileModalShow.innerHTML = "";

    let html = `
        <div class="mobileModal inner" id="m_modal_loading">
            <div>
                <div>
                    <div class="spinner-box">
                        <div class="loader-circle"></div>
                        <div class="loader-line-mask">
                            <div class="loader-line"></div>
                        </div>
                        <span>${loadingTitle}</span>
                    </div>
                    <p>${loadingMessage}</p>`

                if(addButton === true) {
                    html += `${buttonTag}`;
                }

                html += `</div>
            </div>
        </div>`;

    mobileModalShow.innerHTML= html;
    $('#m_modal_loading').show();

    const cancelButton = document.getElementById('vpnLoadingCancelButton');
    if (cancelButton) {
        setTimeout(() => {
            cancelButton.style.display = 'block';
        }, 30000);
    }
}
function hideVpnOpenLoadingModal() {
    $('#m_modal_loading').hide();
}
function commonMessageModalOn(modalTitle, modalMessage, buttonTitle) {
    const mobileModalShow = document.getElementById('m_modal_show');
    mobileModalShow.innerHTML = "";
        
    let html = `
        <div class="mobileModal" id="m_modal_message-box">
            <div>
                <div>
                    <div class="m_modal_message-box">
                        <div>
                            <h3>[ ${modalTitle} ]</h3>
                            <p>${modalMessage}</p>     
                        </div>
                        <button id="modalCloseButton" type="button">${buttonTitle}</button>
                    </div>
                </div>
            </div>
        </div>`;

    mobileModalShow.innerHTML= html;
    $('#m_modal_message-box').show();
}

function commonMessageTwoButtonModalOn(modalTitle, modalMessage, buttonLeft, buttonRight) {
    const mobileModalShow = document.getElementById('m_modal_show');
    mobileModalShow.innerHTML = "";

    let html = `
        <div id="m_common_two-button_modal" class="mobileModal">
            <div>
                <div id="m_two-button_modal_content">
                    <div class="message_wrap">
                        <h3>${modalTitle}</h3>
                        <p>${modalMessage}</p>
                    </div>
                    <div class="button_wrap">
                        <button id="m_modal_two-button_left">${buttonLeft}</button>
                        <button id="m_modal_two-button_right">${buttonRight}</button>
                    </div>
                </div>
            </div>
        </div>`;

    mobileModalShow.innerHTML= html;
    $('#m_common_two-button_modal').show();

}

function mfaConfirmModalOn() {
    const mobileModalShow = document.getElementById('m_modal_show');
    mobileModalShow.innerHTML = "";

    let html = `
        <div id="m_device-confirm_modal" class="mobileModal">
            <div>
                <div id="m_device-confirm_modal_content">
                    <div>
                        <p>${modalMessage.modal_deviceManagement_menu_message}</p>
                        <button id="m_device-change_button" onclick="startUpdateMfaDevice()">${modalMessage.modal_deviceManagement_menu_updateButton}</button>
                        <button id="m_device-delete_button" onclick="startDeleteMfaDevice()">${modalMessage.modal_deviceManagement_menu_deleteButton}</button>
                    </div>
                    
                    <button id="m_device-confirm_button">${modalMessage.modal_deviceManagement_menu_closeButton}</button>
                </div>
            </div>
        </div>
    `;

    mobileModalShow.innerHTML= html;
    $('#m_device-confirm_modal').show();
    $('#m_device-confirm_button, #m_device-change_button, #m_device-delete_button').on('click',function(){
        $('#m_device-confirm_modal').hide();
    });
}

function appDownloadLinkQRModalOn() {
    const mobileModalShow = document.getElementById('m_modal_show');
    mobileModalShow.innerHTML = "";
        
    let html = `
        <div id="m_QR_download_link" class="inner">
            <div id="m_QR_head">
                <button type="button" id="m_QR_popup_close_button">
                    <img src="/images/mobile/m_x_mark.png" alt="닫기버튼">
                </button>
                
                <h3>${modalMessage.modal_qr_title}</h3>
            </div>
            <div>
                <div id="m_QR_show"></div>
                <div id="m_QR_guide">
                    <h3>${modalMessage.modal_qr_guide_title}</h3>
                    <p class="subC">${modalMessage.modal_qr_guide_message}</p>
                </div>
                
                <button id="m_QR_popup_cancel_button" class="secondary_button">${modalMessage.modal_qr_button_cancel}</button>
            </div>
        </div>`;

    mobileModalShow.innerHTML= html;

    $('#m_QR_download_link').show();
    $('#m_QR_download_link button, #m_QR_popup_close_button').on('click',function(){
        $('#m_QR_download_link').hide();
    });
}

function secondaryAuthenticationSelectModalOn(isBioAvailable) {
    const mobileModalShow = document.getElementById('m_modal_show');
    mobileModalShow.innerHTML = "";

    let html = `
        <div class="m-auth-modal-background" id="secondaryAuthenticationSelectModal">
            <button type="button" id="closeBtn" class="m-auth-modal-close-button">
                <img src="/images/mobile/m_x_mark_white.svg" alt="closeButton">
            </button>
        
            <div class="m-auth-modal-wrap auth-method-select-modal">
                <h3 class="modal-guide">${modalMessage.modal_secondary_authenticate_select_guide}</h3>
                <div class="button-wrap">`;

            if(isBioAvailable) {
                html += `
                    <button type="button" class="auth-button-style" onclick="addOrUpdateMfaDevice('${mfaTypes.biometric}');">
                        <img src="/images/mobile/bio-auth-icon.svg" alt="biometric">
                        <span>${modalMessage.modal_secondary_authenticate_select_button_biometric}</span>
                    </button>
                `;
            }

                html += `
                    <button type="button" class="auth-button-style" onclick="addOrUpdateMfaDevice('${mfaTypes.pattern}');">
                        <img src="/images/mobile/pattern-auth-icon.svg" alt="pattern">
                        <span th:text="#{mobile.modal.selectAuthenticationMethod.button.pattern}">${modalMessage.modal_secondary_authenticate_select_button_pattern}</span>
                    </button>
                    <button type="button" class="auth-button-style" onclick="addOrUpdateMfaDevice('${mfaTypes.pin}');">
                        <img src="/images/mobile/pin-auth-icon.svg" alt="pin">
                        <span th:text="#{mobile.modal.selectAuthenticationMethod.button.pin}">${modalMessage.modal_secondary_authenticate_select_button_pin}</span>
                    </button>
                </div>
            </div>
        </div>`;

    mobileModalShow.innerHTML= html;
    $('#secondaryAuthenticationSelectModal').show();

    $('#secondaryAuthenticationSelectModal #closeBtn').on('click', function () {
        $('#secondaryAuthenticationSelectModal').hide();
    })
}

function mfaDeviceRegisterSuccessModalOn(message) {
    const mobileModalShow = document.getElementById('m_modal_show');
    mobileModalShow.innerHTML = "";

    let html = `
        <div class="m-auth-modal-background" id="pinPatternRegisterSuccessModal">
            <div class="m-auth-modal-wrap common-auth-symbol-modal">
                <img src="/images/mobile/symbol-complete.svg" alt="간편 인증 등록 완료">
                <span th:text="#{mobile.modal.commonAuthenticationSymbol.id.pattern}">${message}</span>
            </div>
        </div>
    `;

    mobileModalShow.innerHTML= html;
    $('#pinPatternRegisterSuccessModal').show();

    setTimeout(() => {
        $('#pinPatternRegisterSuccessModal').hide();
    }, 1500)
}

function pinRegisterModalOn(object, inputMfaPinLen) {
    const mobileModalShow = document.getElementById('m_modal_show');
    mobileModalShow.innerHTML = "";

    let html = `
        <div class="m-auth-modal-background" id="pinRegisterModal">
            <button type="button" id="closeBtn" class="m-auth-modal-close-button">
                <img src="/images/mobile/m_x_mark_white.svg" alt="닫기 버튼">
            </button>
            <div class="m-auth-modal-wrap auth-pin-modal">
                <div class="prompt pin-modal-guide" id="pinModalMessage">${modalMessage.modal_secondary_authenticate_pin_register_title_message1}</div>
                <div id="pinNumbers" class="pin-input-wrap"></div>
                <div id="validatePinNumbers" class="pin-input-wrap"></div>
            </div>
        </div>`;

    mobileModalShow.innerHTML= html;
    $('#pinRegisterModal').show();

    $('#pinRegisterModal #closeBtn').on('click', function () {
        pinPatternCloseConfirmModalOn(mfaTypes.pin);
    })

    let inputPin;

    let pinNumbers = $('#pinNumbers').pinlogin({
        fields : inputMfaPinLen,
        placeholder : '•',
        complete : function(pin){
            inputPin = pin;
            updateDomText('pinModalMessage', modalMessage.modal_secondary_authenticate_pin_register_title_message2);
            updateDomCss('pinNumbers', 'display', 'none');
            updateDomCss('validatePinNumbers', 'display', 'block');
            let validatePinNumbers = $('#validatePinNumbers').pinlogin({
                fields : inputMfaPinLen,
                placeholder : '•',
                keydown : function(e, field, nr){
                    updateDomCss('pinRegisterModal','background-color', 'rgb(0, 0, 0, 0.8)');
                },
                complete : function(pin){
                    if (inputPin != pin) {
                        updateDomCss('pinRegisterModal','background-color', 'rgb(185, 114, 127, 0.8)');
                        changeDomHtml('pinModalMessage', modalMessage.modal_secondary_authenticate_pin_register_title_message3);
                        validatePinNumbers.reset();
                    } else {
                        setTimeout(() => {
                            mfaDeviceAddDto.authSecret = inputPin;

                            if (pageName === "MOBILE_DEVICE-MANAGEMENT" && object === 'REGISTER') {
                                currentMode === 'ADD' ?  addMfaDevice() : updateMfaDevice();
                            }

                        }, 300);
                    }
                },
            });
        },
    });
}

function pinMfaAuthModalOn(mfaFailCnt, inputMfaPinLen, authToken) {
    const mobileModalShow = document.getElementById('m_modal_show');
    mobileModalShow.innerHTML = "";

    let html = `
        <div class="m-auth-modal-background" id="pinAuthModal">
            <button type="button" id="closeBtn" class="m-auth-modal-close-button">
                <img src="/images/mobile/m_x_mark_white.svg" alt="닫기 버튼">
            </button>
            <div class="m-auth-modal-wrap auth-pin-modal">
                <div class="prompt pin-modal-guide" id="pinModalMessage">${modalMessage.modal_secondary_authenticate_pin_auth_title_message1}</div>
                <div class="prompt pin-modal-guide" id="pinModalFailCountMessage" style="display: none"></div>
                                
                <div id="pinNumbers" class="pin-input-wrap"></div>
            </div>
        </div>`;

    mobileModalShow.innerHTML= html;
    $('#pinAuthModal').show();

    $('#pinAuthModal #closeBtn').on('click', function () {
        callSendMfaAuthErrorApi(authToken).then(response => {
            $('#pinAuthModal').hide();
        });
    });

    let pinNumbers = $('#pinNumbers').pinlogin({
        fields : inputMfaPinLen,
        placeholder : '•',
        keydown : function(e, field, nr){
            updateDomCss('pinModalFailCountMessage', 'display', 'none');
            updateDomCss('pinAuthModal','background-color', 'rgb(0, 0, 0, 0.8)');
        },
        complete : function(pinValue){
            let dto = {
                "pinPatternValue" : pinValue,
                "authToken" : authToken
            }

            callCheckMatchPinOrPatternApi(dto).then(response => {
                if(response.status === 200) {
                    updateDomText('pinModalMessage', modalMessage.modal_secondary_authenticate_pin_auth_title_message2);
                    callUpdateMfaDeviceAuthTokenResultApi(authToken).then(response => {
                        $('.pinlogin-field').blur();
                        $('#pinAuthModal').hide();
                    });
                }

                if(response.status === 400) {
                    let failCount = response.data["FAIL_COUNT"];

                    updateDomCss('pinAuthModal','background-color', 'rgb(185, 114, 127, 0.8)');
                    changeDomHtml('pinModalMessage', modalMessage.modal_secondary_authenticate_pin_auth_title_message3);
                    changeDomHtml('pinModalFailCountMessage', modalMessage.modal_pinPatternAuth_fail_count_message.replace('#{failCount}', failCount).replace('#{pinPatternMaxFailCount}', pinPatternMaxFailCount));
                    updateDomCss('pinModalFailCountMessage', 'display', 'block');
                    pinNumbers.reset();

                    if(failCount === pinPatternMaxFailCount) {
                        pinPatternAuthMaxFailModalOn(authToken);
                    }
                }
            });
        },
    });
}
function createPatterSvg(domId, inputMfaPatternSize) {
    const interval = 20;
    let viewBoxSize = String((inputMfaPatternSize+1) * interval);
    let svgSize = "0 0 ".concat(viewBoxSize).concat(" ").concat(viewBoxSize);

    let html = `
        <svg class="patternlock" id="${domId}" viewBox="${svgSize}" xmlns="http://www.w3.org/2000/svg">
            <g class="lock-actives"></g>
            <g class="lock-lines"></g>
            <g class="lock-dots">`;

            for (let i = 1; i <= inputMfaPatternSize ; i++) {
                let cy = interval * i;
                for (let j = 1; j <= inputMfaPatternSize; j++) {
                    let cx = interval * j;
                    html += `<circle cx="${cx}" cy="${cy}" r="2"/>`;
                }
            }
        html += `
            </g>
        </svg>
    `;
    return html;
}

function patternRegisterModalOn(object, inputMfaPatternSize) {
    const mobileModalShow = document.getElementById('m_modal_show');
    mobileModalShow.innerHTML = "";

    let html = `
        <div class="m-auth-modal-background" id="patternRegisterModal">
            <button type="button" id="closeBtn" class="m-auth-modal-close-button">
                <img src="/images/mobile/m_x_mark_white.svg" alt="닫기 버튼">
            </button>
        
            <div class="m-auth-modal-wrap auth-pattern-modal">
                <div class="prompt guide" id="patternModalMessage">${modalMessage.modal_secondary_authenticate_pattern_register_title_message1}</div>
                <div id="inputPatterns">`;

        html += createPatterSvg('patternLock', inputMfaPatternSize);
        html += `</div>`;
        html += `<div id="validationPatterns" style="display: none">`;
        html += createPatterSvg('validationPatternLock', inputMfaPatternSize);
        html += `</div>
            </div>
        </div>`;

    mobileModalShow.innerHTML= html;
    $('#patternRegisterModal').show();

    const minPatternLength = 4;
    let inputPatternValue;
    let patternLock = new PatternLock("#patternLock", {
        onPattern: function(pattern) {
            // Context is the pattern lock instance
            inputPatternValue = pattern;

            if(inputPatternValue.toString().length < minPatternLength) {
                updateDomCss('patternLengthErrorMessage', 'display', 'block');
                patternLock.clear();
            } else {
                updateDomCss('patternLengthErrorMessage', 'display', 'none');
                updateDomText('patternModalMessage', modalMessage.modal_secondary_authenticate_pattern_register_title_message2);
                updateDomCss('inputPatterns', 'display', 'none');
                updateDomCss('validationPatterns', 'display', 'block');

                let validationPatternLock = new PatternLock("#validationPatternLock", {
                    onPattern: function(pattern) {
                        if (inputPatternValue != pattern) {
                            updateDomCss('patternRegisterModal','background-color', 'rgb(185, 114, 127, 0.8)');
                            changeDomHtml('patternModalMessage', modalMessage.modal_secondary_authenticate_pattern_register_title_message3);
                            validationPatternLock.clear();
                        } else {
                            updateDomCss('patternRegisterModal','background-color', 'rgb(0, 0, 0, 0.8)');
                            updateDomText('patternModalMessage', modalMessage.modal_secondary_authenticate_pattern_register_title_message4);
                            validationPatternLock.success();

                            setTimeout(() => {
                                mfaDeviceAddDto.authSecret = pattern;

                                if (pageName === "MOBILE_DEVICE-MANAGEMENT" && object === 'REGISTER') {
                                    currentMode === 'ADD' ?  addMfaDevice() : updateMfaDevice();
                                }
                            }, 1000);
                        }
                    }
                });
            }
        }
    });

    $('#patternRegisterModal #closeBtn').on('click', function () {
        pinPatternCloseConfirmModalOn(mfaTypes.pattern);
    })
}

function patternMfaAuthModalOn(mfaFailCnt, inputMfaPatternSize, authToken) {
    const mobileModalShow = document.getElementById('m_modal_show');
    mobileModalShow.innerHTML = "";

    let html = `
        <div class="m-auth-modal-background" id="patternAuthModal">
            <button type="button" id="closeBtn" class="m-auth-modal-close-button">
                <img src="/images/mobile/m_x_mark_white.svg" alt="닫기 버튼">
            </button>
        
            <div class="m-auth-modal-wrap auth-pattern-modal">
                <div class="prompt guide" id="patternModalMessage">${modalMessage.modal_secondary_authenticate_pattern_auth_title_message1}</div>
                <div class="prompt guide" id="patternModalFailCountMessage" style="display: none"></div>
                                
                <div id="inputPatterns">`;
        html += createPatterSvg('patternLock', inputMfaPatternSize);
        html += `</div>`;
        html += `</div>
        </div>`;

    mobileModalShow.innerHTML= html;
    $('#patternAuthModal').show();

    let patternLock = new PatternLock("#patternLock", {
        onPattern: function(patternValue) {
            let dto = {
                "pinPatternValue" : patternValue,
                "authToken" : authToken
            }

            callCheckMatchPinOrPatternApi(dto).then(response => {
                if(response.status === 200) {
                    updateDomCss('patternModalFailCountMessage', 'display', 'none');
                    updateDomCss('patternAuthModal','background-color', 'rgb(0, 0, 0, 0.8)');
                    updateDomText('patternModalMessage', modalMessage.modal_secondary_authenticate_pattern_auth_title_message2);
                    patternLock.success();
                    callUpdateMfaDeviceAuthTokenResultApi(authToken).then(response => {
                        $('#patternAuthModal').hide();
                    });
                }

                if(response.status === 400) {
                    let failCount = response.data["FAIL_COUNT"];

                    updateDomCss('patternAuthModal','background-color', 'rgb(185, 114, 127, 0.8)');
                    changeDomHtml('patternModalMessage', modalMessage.modal_secondary_authenticate_pattern_auth_title_message3);
                    changeDomHtml('patternModalFailCountMessage', modalMessage.modal_pinPatternAuth_fail_count_message.replace('#{failCount}', failCount).replace('#{pinPatternMaxFailCount}', pinPatternMaxFailCount));
                    updateDomCss('patternModalFailCountMessage', 'display', 'block');

                    patternLock.clear();

                    if(failCount === pinPatternMaxFailCount) {
                        pinPatternAuthMaxFailModalOn(authToken);
                    }
                }
            });
        }
    });

    $('#patternAuthModal #closeBtn').on('click', function () {
        callSendMfaAuthErrorApi(authToken).then(response => {
            $('#patternAuthModal').hide();
        });
    })
}

function pinPatternCloseConfirmModalOn(mfaType) {
    const nestedLayer = document.getElementById('nested-layer');
    nestedLayer.innerHTML = "";

    let html = `
        <div class="setting-exit-modal" id="pinPatternCloseConfirmModal">
            <div class="guide-wrap">
                <p>${modalMessage.modal_pin_pattern_close_confirm_message}</p>
            </div>
            <button type="button" class="button-style" id="yesBtn">${modalMessage.modal_pin_pattern_close_confirm_yes_button}</button>
            <button type="button" class="button-style-cancel" id="noBtn">${modalMessage.modal_pin_pattern_close_confirm_no_button}</button>
        </div>`;

    nestedLayer.innerHTML= html;
    $('#nested-layer').show();

    $('#nested-layer #yesBtn').on('click', function() {
        $('#nested-layer').hide();
        mfaType === mfaTypes.pattern ? $('#patternRegisterModal').hide() : $('#pinRegisterModal').hide();
    });

    $('#nested-layer #noBtn').on('click', function() {
        $('#nested-layer').hide();
    });
}

function pinPatternAuthMaxFailModalOn(authToken) {
    commonMessageTwoButtonModalOn(modalMessage.modal_secondary_authenticate_pin_pattern_auth_fail_maxCount_title,
        modalMessage.modal_secondary_authenticate_pin_pattern_auth_fail_maxCount_message,
        modalMessage.modal_secondary_authenticate_pin_pattern_auth_fail_maxCount_registerButton,
        modalMessage.modal_secondary_authenticate_pin_pattern_auth_fail_maxCount_cancelButton);

    $('#m_common_two-button_modal #m_modal_two-button_left').on('click',function(){
        let dto = {
            "authToken" : authToken
        }

        callSendMfaAuthErrorApi(authToken).then(response => {
            callInitMfaDeviceByAppTokenApi(dto).then(response => {
                location.href = '/authenticate/two-factor/log-out';
            });
        });
    });

    $('#m_common_two-button_modal #m_modal_two-button_right').on('click',function(){
        callSendMfaAuthErrorApi(authToken).then(response => {
            $('#m_common_two-button_modal').hide();
        });
    });

}