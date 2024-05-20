$(function(){
    $('#m_set-password_input_password, #m_set-password_input_check').on('keydown', function(event) {
        if(event.keyCode === 13) {
            setPassword();
        } else {
            updateDomText('setPasswordErrorMessage', '');
            updateDomCss('setPasswordErrorMessage', 'display', 'none')
        }
    });
});

const failCount = 5;

function setPassword() {
    let newSetPassword = $('#m_set-password_input_password').val().trim();
    let newSetPasswordConfirm = $('#m_set-password_input_check').val().trim();

    if(newSetPassword === "" || newSetPassword.length === 0) {
        commonMessageModalOn(modalMessage.modal_common_title_error, modalMessage.authenticate_validation_message_noInput_newSetPassword, modalMessage.modal_common_button_confirm);
        $('#m_modal_message-box #modalCloseButton').on('click',function(){
            $('#m_modal_message-box').hide();
        });
        return false;
    }

    if(newSetPassword !== "" && (newSetPasswordConfirm === "" || newSetPasswordConfirm.length === 0)) {
        commonMessageModalOn(modalMessage.modal_common_title_error, modalMessage.authenticate_validation_message_noInput_newSetPasswordConfirm, modalMessage.modal_common_button_confirm);
        $('#m_modal_message-box #modalCloseButton').on('click',function(){
            $('#m_modal_message-box').hide();
        });
        return false;
    }

    if(newSetPassword.length !== 0 && newSetPasswordConfirm.length !== 0) {
        let message = (newSetPassword === newSetPasswordConfirm) ? domMessage.mobile_set_password_message_match_password : domMessage.mobile_set_password_message_notMatch_password;
        let messageColor = (newSetPassword === newSetPasswordConfirm) ? '#888B8D' : '#E42312';

        updateDomCss('setPasswordErrorMessage', 'display', 'none');
        updateDomText('setPasswordErrorMessage', message);
        updateDomCss('setPasswordErrorMessage', 'display', 'block');
        updateDomCss('setPasswordErrorMessage', 'color', messageColor);

        if((newSetPassword !== newSetPasswordConfirm)) {
            return false;
        }

        let passwordUpdateDto = {
            "password" : newSetPassword,
            "isEqualPasswordComparedToBeforePassword" : pageName === "MOBILE_SET-PASSWORD" ? false : true
        }

        callSetPasswordApi(passwordUpdateDto).then(response => {
            if(response.status === 200) {
                commonMessageModalOn(modalMessage.modal_common_title_success, pageName === "MOBILE_RESET-PASSWORD" ? modalMessage.authenticate_success_message_resetPassword : modalMessage.authenticate_success_message_setPassword, modalMessage.modal_common_button_confirm);
                $('#m_modal_message-box #modalCloseButton').on('click',function(){
                    clearFailCount();
                    deleteAppToken();
                    $('#m_modal_message-box').hide();
                    setDomAfterUpdatePassword();
                });
            }

            if(response.status === 400 && response.code === 'A005') {
                location.href = response.data;
            }

            if(response.status === 400 && response.code !== 'A005') {
                let currentFailCount = getCurrentFailCountFromInLocalStorage();
                currentFailCount++;
                updateFailCountInLocalStorage(currentFailCount);

                let commonModalMessage;

                switch (response.code) {
                    case "P001" :
                        commonModalMessage = modalMessage.modal_change_password_message_error_equalPassword;
                        break;

                    case "P002" :
                        commonModalMessage = modalMessage.modal_change_password_message_error_equalPassword;
                        break;

                    case "P003" :
                        commonModalMessage = modalMessage.modal_change_password_message_error_equalLoginEmp;
                        break;

                    case "P004" :
                        commonModalMessage = modalMessage.modal_change_password_message_error_sameCharacter3times;
                        break;

                    case "P005" :
                        commonModalMessage = modalMessage.modal_change_password_message_error_passwordComplex;
                        break;
                }

                commonMessageModalOn(modalMessage.modal_common_title_error ,commonModalMessage.replace('#{totalCount}', failCount).replace('#{currentFailCount}', currentFailCount), modalMessage.modal_common_button_confirm);

                $('#m_modal_message-box #modalCloseButton').on('click',function(){
                    if(currentFailCount === failCount) {
                        callVpnUserAccountLockApi().then(response => {
                            clearFailCount();
                            goToMain();
                        });
                    }

                    $('#m_set-password_input_password').val('').focus();
                    $('#m_set-password_input_check').val('');
                    $('#m_modal_message-box').hide();
                });
            }
        });
    }
}

function setDomAfterUpdatePassword() {
    updateMessageDomArea('m_set-password_guide', pageName === "MOBILE_RESET-PASSWORD" ? domMessage.mobile_reset_password_message_success_change_password1 : domMessage.mobile_set_password_message_success_change_password1, domMessage.mobile_set_password_message_success_change_password2);
    updateInputDomArea();

    let afterUpdatePasswordDom = document.getElementById('m_set-password_guide');
    afterUpdatePasswordDom.classList.add('afterUpdatePasswordStyle');
}

function updateMessageDomArea(domId, upMessage, downMessage) {
    let html = `<p>${upMessage}</p><p>${downMessage}</p>`;
    updateDomHtml(domId, html);
}

function updateInputDomArea() {
    domRemove('m_set-password_input_field');
    domRemove('setPasswordErrorMessageArea');
    updateSetPasswordButtonStatus(domMessage.mobile_set_password_button_success_change_continue_registerBio, 'goToMain();');
    updateDomCss('m_set-password_button', 'margin-top', '1rem');
    updateDomCss('setPassSuccess_right_contents_guide', 'display', 'flex');
}

function updateSetPasswordButtonStatus(buttonText, onclickFunctionName) {
    updateDomText('m_set-password_button', buttonText);
    removeDomAttribute('m_set-password_button', 'onclick');
    updateDomAttribute('m_set-password_button', 'onclick', onclickFunctionName);
}

function goToMain() {
    callFirstAuthenticateLogoutApi().then(response => {
        if(response.status === 200) {
            location.href="/";
        }
    });
}

function getCurrentFailCountFromInLocalStorage() {
    let value = osType === "I" ? getCookie("FAIL_COUNT") : localStorage.getItem("FAIL_COUNT");
    return value === null ? 0 : Number(value);
}

function updateFailCountInLocalStorage(failCount) {
    osType === "I" ? setCookie("FAIL_COUNT", failCount) : localStorage.setItem("FAIL_COUNT", failCount);
}

function clearFailCount() {
    osType === "I" ? deleteCookie("FAIL_COUNT") : localStorage.removeItem("FAIL_COUNT");
}