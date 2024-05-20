$(function(){
    $('body').on('keydown', function(event) {
        if(event.keyCode === 13 && $('#commonMessageModal').css('display') === 'block') {
            let modalClass = $('#commonMessageModal').attr('class').split(' ')[1];

            if(modalClass === 'errorModal') {
                $('#newSetPassword').val('').focus();
                $('#newSetPasswordConfirm').val('');
            }

            if(modalClass === 'successModal') {
                clearFailCount();
                setDomAfterUpdatePassword();
                deleteAppToken();
            }

            $('#commonMessageModal').hide();
        }
    });

    $('#newSetPassword, #newSetPasswordConfirm').on('keydown', function(event) {
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
    updateDomCss('setPasswordErrorMessage', 'display', 'none');

    let newSetPassword = $('#newSetPassword').val().trim();
    let newSetPasswordConfirm = $('#newSetPasswordConfirm').val().trim();

    if(newSetPassword === "" || newSetPassword.length === 0) {
        commonMessageModalOn(modalMessages.authenticate_validation_message_noInput_newSetPassword);
        $('#commonMessageModal .closeButton').on('click', function() {
            $('#commonMessageModal').hide();
        });

        return false;
    }

    if(newSetPassword !== "" && (newSetPasswordConfirm === "" || newSetPasswordConfirm.length === 0)) {
        commonMessageModalOn(modalMessages.authenticate_validation_message_noInput_newSetPasswordConfirm);
        $('#commonMessageModal .closeButton').on('click', function() {
            $('#commonMessageModal').hide();
        });

        return false;
    }

    if(newSetPassword.length !== 0 && newSetPasswordConfirm.length !== 0) {
        if((newSetPassword !== newSetPasswordConfirm)) {
            let message = (newSetPassword === newSetPasswordConfirm) ? domMessage.pc_set_password_message_match_password : domMessage.pc_set_password_message_notMatch_password;
            updateDomText('setPasswordErrorMessage', message);
            updateDomCss('setPasswordErrorMessage', 'display', 'block');
            return false;
        }

        let passwordUpdateDto = {
            "password" : newSetPassword,
            "isEqualPasswordComparedToBeforePassword" : pageName === "PC_SET-PASSWORD" ? false : true
        }

        callSetPasswordApi(passwordUpdateDto).then(response => {
            if(response.status === 200) {
                $('#newSetPassword').blur();
                $('#newSetPasswordConfirm').blur();

                commonMessageModalOn(pageName === "PC_RESET-PASSWORD" ? modalMessages.authenticate_success_message_resetPassword : modalMessages.authenticate_success_message_setPassword);

                $('#commonMessageModal').attr('vpnModal');
                $('#commonMessageModal').addClass('successModal');

                $('#commonMessageModal .closeButton').on('click', function() {
                    clearFailCount();
                    $('#commonMessageModal').hide();
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

                $('#newSetPassword').blur();
                $('#newSetPasswordConfirm').blur();

                let modalMessage;

                switch (response.code) {
                    case "P001" :
                        modalMessage = modalMessages.change_password_message_error_equalPassword;
                        break;

                    case "P002" :
                        modalMessage = modalMessages.change_password_message_error_equalPassword;
                        break;

                    case "P003" :
                        modalMessage = modalMessages.change_password_message_error_equalLoginEmp;
                        break;

                    case "P004" :
                        modalMessage = modalMessages.change_password_message_error_sameCharacter3times;
                        break;

                    case "P005" :
                        modalMessage = modalMessages.change_password_message_error_passwordComplex;
                        break;
                }

                commonMessageModalOn(modalMessage.replace('#{totalCount}', failCount).replace('#{currentFailCount}', currentFailCount));

                $('#commonMessageModal').attr('vpnModal');
                $('#commonMessageModal').addClass('errorModal');

                if(response.code === "P005") {
                    updateDomCss('commonMessageModal .closeButton', 'margin', '1rem 0 0 0');
                }

                $('#commonMessageModal .closeButton').on('click', function() {
                    if(currentFailCount === failCount) {
                        callVpnUserAccountLockApi().then(response => {
                            clearFailCount();
                            goToMain();
                        });
                    }

                    $('#newSetPassword').val('').focus();
                    $('#newSetPasswordConfirm').val('');
                    $('#commonMessageModal').hide();
                });
            }
        });
    }
}

function setDomAfterUpdatePassword() {
    updateLeftDomArea('pc_auth_setPass_left_contents', pageName === "PC_RESET-PASSWORD" ? domMessage.pc_reset_password_left_message_up : domMessage.pc_set_password_left_message_up, domMessage.pc_set_password_left_message_down);
    updateRightDomArea();
}

function updateLeftDomArea(domId, upMessage, downMessage) {
    let html = `<h2 class="subC">${upMessage}</h2>`;

    if(downMessage !== null) {
        html += `<br><h2 class="subC">${downMessage}</h2>`;
    }

    updateDomHtml(domId, html);
}

function updateSetPasswordButtonStatus(buttonText, onclickFunctionName) {
    updateDomText('setPasswordButton', buttonText);
    removeDomAttribute('setPasswordButton', 'onclick');
    updateDomAttribute('setPasswordButton', 'onclick', onclickFunctionName);
}

function updateRightDomArea() {
    domRemove('setPasswordInputArea');
    domRemove('setPasswordErrorMessageArea');
    updateSetPasswordButtonStatus(domMessage.pc_set_password_right_button_reconnect, 'goToMain()');
    updateDomCss('setPassSuccess_right_contents_guide', 'display', 'flex');
}

function goToMain() {
    callFirstAuthenticateLogoutApi().then(response => {
        if(response.status === 200) {
            deleteAppToken();
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