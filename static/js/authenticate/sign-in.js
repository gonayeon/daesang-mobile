$(function(){
    updateAutoConnectionCheckbox();
    initCompCdDom();

    $("#m_id-pw_toggle_feild .toggle-header").click(function() {
        $(this).find(".up_arrow, .down_arrow").toggleClass("hidden");
        $("#m_id-pw_company_list").slideToggle(function() {
            if ($(this).is(":visible")) {
                $(this).css("overflow", "auto");
            } else {
                $(this).css("overflow", "hidden");
            }
        });
    });

    $("#m_id-pw_company_list").scroll(function() {
        if ($("#m_id-pw_company_list").is(":visible")) {
            if ($("#m_id-pw_company_list")[0].scrollHeight > $("#m_id-pw_company_list").height()) {
                $("#m_id-pw_company_list").addClass("show-scrollbar");
            } else {
                $("#m_id-pw_company_list").removeClass("show-scrollbar");
            }
        }
    });

    $("#m_id-pw_company_list li").click(function() {
        let selectedText = $(this).find("span").text();
        let selectedId = $(this).find("span").attr("id");
        let passwordUseFlag = selectedId.split("_")[2];

        $("#m_id-pw_toggle_feild .toggle-header span").text(selectedText).attr("id", selectedId);

        $("#m_id-pw_company_list").slideUp(function() {
            $("#m_id-pw_toggle_feild .toggle-header .up_arrow").addClass("hidden");
            $("#m_id-pw_toggle_feild .toggle-header .down_arrow").removeClass("hidden");
        });

        vpnUserStatusCheck = false;
        clearInterval(x);

        initLoginEmpDomArea();

        initPasswordDomArea(passwordUseFlag);

        updateSignInButtonStatus(passwordUseFlag === 'Y' ? true : false, domMessage.mobile_signIn_signIn_button, 'startSignIn();');

        if($('#m_id-pw_contact-info').css('display') === 'flex') {
            initContactInfoArea();
        }

        updateMessageDomArea('m_id-pw_guide', domMessage.mobile_signIn_message_default_message1, domMessage.mobile_signIn_message_default_message2, '');
    });

    $('#m_id-pw_input_password').on('focusin', function() {
        if(vpnUserStatusCheck) {
            return;
        }

        startSignIn();
    });
});

function initContactInfoArea() {
    updateDomCss('m_id-pw_contact-info', 'display', 'none');
    updateDomText('contactInfo-title', '');
    updateInputDomValue('m_id-pw_input_contact-info', '');
}

function initCompCdDom() {
    let companyName = $('#m_id-pw_company_list > li:first-child span').text();
    let idValue = $('#m_id-pw_company_list > li:first-child span').attr('id');
    let passwordUseFlag = idValue.split('_')[2];

    $('#m_id-pw_toggle_feild .toggle-header span').text(companyName).attr('id', idValue);
    $('#m_id-pw_input_id').focus();
    updateSignInButtonStatus(passwordUseFlag === 'Y' ? true : false, domMessage.mobile_signIn_signIn_button, 'startSignIn();');
    initPasswordDomArea(passwordUseFlag);
}

function initLoginEmpDomArea() {
    updateInputDomValue('m_id-pw_input_id', '');
    updateDomAttribute('m_id-pw_input_id', 'disabled', false);
    inputDomFocus('m_id-pw_input_id');
}

function initPasswordDomArea(passwordUseFlag) {
    let value = passwordUseFlag === "Y" ? 'flex' : 'none';
    updateDomCss('m_id-pw_password', 'display', value);
    updateInputDomValue('m_id-pw_input_password', '');
    updateDomAttribute('m_id-pw_input_password', 'disabled', passwordUseFlag === "Y" ? false : true);
    updateDomAttribute('m_id-pw_input_password', 'placeholder', domMessage.mobile_signIn_input_password_placeholder);
    domRemoveClass('m_id-pw_input_password', 'errorInput');
    updateDomCss('passwordCheckMessageArea','display', value);
    updateDomCss('passwordCheckCountDomArea','display', value);

    updatePasswordCheckCount(0);
    updatePasswordCheckCountCss(false);
}

function updatePasswordCheckCount(passwordCheckFailCount) {
    updateDomText('passwordCheckFailCount', passwordCheckFailCount);
}

function updatePasswordCheckCountCss(addOrRemove) {
    const className = 'pointC';
    addOrRemove === true ? domAddClass('passwordCheckCountDomArea', className) : domRemoveClass('passwordCheckCountDomArea', className);
}

function updateDomAfterVpnUserStatusCheckWhenPasswordUseY() {
    updateDomAttribute('m_id-pw_input_id', 'disabled', true);
    updateInputDomValue('m_id-pw_input_password', '');
    inputDomFocus('m_id-pw_input_password');
    updateSignInButtonStatus(false, domMessage.mobile_signIn_signIn_button, 'vpnUserPasswordCheck();');
}

function updateSignInButtonStatus(disabled, buttonText, onclickFunctionName) {
    updateDomAttribute('m_id-pw_start_button', 'disabled', disabled);
    updateDomText('m_id-pw_start_button', buttonText);
    removeDomAttribute('m_id-pw_start_button', 'onclick');
    updateDomAttribute('m_id-pw_start_button', 'onclick', onclickFunctionName);
}

function updateDomAfterPasswordCheckLockTimeOut() {
    updatePasswordCheckCount(0);
    updateInputDomValue('m_id-pw_input_password', '');
    updateDomAttribute('m_id-pw_input_password', 'disabled', false);
    updateDomAttribute('m_id-pw_input_password', 'placeholder', domMessage.mobile_signIn_input_password_placeholder);
    updateSignInButtonStatus(false, domMessage.mobile_signIn_signIn_button, 'vpnUserPasswordCheck();');
    updatePasswordCheckCountCss(false);
    $('#m_id-pw_input_password').focus();
}

let vpnUserStatusCheck = false;

function startSignIn() {
    let loginEmp = $('#m_id-pw_input_id').val().trim();
    if(loginEmp === "" || loginEmp.length === 0) {
        commonMessageModalOn(modalMessage.modal_common_title_error, modalMessage.authenticate_validation_message_noInput_username, modalMessage.modal_common_button_confirm);
        $('#m_modal_message-box #modalCloseButton').on('click',function(){
            $('#m_id-pw_input_id').focus();
            $('#m_modal_message-box').hide();
        });
        return false;
    }

    let compCd = $('#m_id-pw_toggle_feild span').attr('id').split("_")[1];
    let compPasswordUseYn = $('#m_id-pw_toggle_feild span').attr('id').split("_")[2];
    let mdmUseFlag = $('#m_id-pw_toggle_feild span').attr('id').split("_")[3];
    let isAutoConnect = $('#autoConnectCheckbox').prop('checked');

    startVpnUserStatus(loginEmp, compCd, authenticationMethod.ID_PW, isAutoConnect, compPasswordUseYn, mdmUseFlag);
}

function vpnUserPasswordCheck() {
    let loginEmp = $('#m_id-pw_input_id').val().trim();
    let password = $('#m_id-pw_input_password').val().trim();
    let compCd = $('#m_id-pw_toggle_feild span').attr('id').split("_")[1];
    let mdmUseFlag = $('#m_id-pw_toggle_feild span').attr('id').split("_")[3];
    let isAutoConnect = $('#autoConnectCheckbox').prop('checked');

    if(password === "" || password.length === 0) {
        commonMessageModalOn(modalMessage.modal_common_title_error, modalMessage.authenticate_validation_message_noInput_password, modalMessage.modal_common_button_confirm);
        $('#m_modal_message-box #modalCloseButton').on('click',function(){
            $('#m_modal_message-box').hide();
        });
        return false;
    }

    let passwordCheckDto = {
        "loginEmp" : loginEmp,
        "password" : password,
        "compCd" : compCd,
        "isAutoConnect" : isAutoConnect,
    }

    callVpnUserPasswordCheckApi(passwordCheckDto).then(response => {
        if(response.status === 200) {
            if(isApp() && mdmUseFlag === 'Y'){
                activeMDM(compCd.concat(loginEmp));
            }

            if(response.data === '/device/management') {
                commonMessageModalOn(modalMessage.modal_common_title_error, modalMessage.modal_message_notValid_mfaDevice, modalMessage.modal_common_button_confirm);
                $('#m_modal_message-box #modalCloseButton').on('click',function(){
                    $('#m_modal_message-box').hide();
                    location.href = response.data;
                });
            } else {
                location.href = response.data;
            }
        }

        if(response.status === 400 && response.code !== "A005") {
            let passwordCheckFailCount = response.data["FAIL_COUNT"];

            updatePasswordCheckCount(passwordCheckFailCount);
            updatePasswordCheckCountCss(true);

            if(passwordCheckFailCount < passwordCheckCount) {
                updateInputDomValue('m_id-pw_input_password', '');
                inputDomFocus('m_id-pw_input_password');
                updateDomAttribute('m_id-pw_input_password', 'placeholder', domMessage.mobile_signIn_password_input_fail_placeholder);
                domAddClass('m_id-pw_input_password', 'errorInput');
            }

            if(passwordCheckFailCount >= passwordCheckCount) {
                updateDomAttribute('m_id-pw_input_password', 'disabled', true);
                updateInputDomValue('m_id-pw_input_password', '');
                updateDomAttribute('m_id-pw_input_password', 'placeholder', domMessage.mobile_signIn_password_input_lock_placeholder);
                domAddClass('m_id-pw_input_password', 'errorInput');

                updateDomAttribute('m_id-pw_start_button', 'disabled', true);
                updateMessageDomArea('m_id-pw_guide', domMessage.mobile_signIn_message_passwordCheckLock_remainTime, domMessage.mobile_signIn_message_passwordCheckLock_message, 'pointC');

                startLockTimer(response.data["REMAIN_SECOND_TIME"]);
            }
        }

        if(response.status === 400 && response.code === "A005") {
            location.href = response.data;
        }
    });
}

function updateMessageDomArea(domId, upMessage, downMessage, className) {
    let html = `<h3 class="${className}">${upMessage}</h3>`;

    if(downMessage !== null) {
        html += `<p>${downMessage}</p>`;
    }

    updateDomHtml(domId, html);
}

function updateDomAfterVpnUserStatusCheckWhenPasswordUseNAndMFANull(contactInfo, otpType) {
    updateDomAttribute('m_id-pw_input_id', 'disabled', true);
    updateContactInfoDomArea(contactInfo, otpType);

    updateSignInButtonStatus(false, domMessage.mobile_signIn_otpSend_button, 'sendOtpCode(false);');

    let upMessage = domMessage.mobile_signIn_message_beforeSendOtp1;
    let downMessage = otpType === "E" ? domMessage.mobile_signIn_message_beforeSendOtp2_email : domMessage.mobile_signIn_message_beforeSendOtp2_mobile;
    updateMessageDomArea('m_id-pw_guide', upMessage, downMessage, '');
}

function updateContactInfoDomArea(contactInfo, otpType) {
    updateDomCss('m_id-pw_contact-info', 'display', 'flex');
    let inputTitle = otpType === "E" ? domMessage.mobile_signIn_input_email_title : domMessage.mobile_signIn_input_mobileNo_title;
    updateDomText('contactInfo-title', inputTitle);
    updateInputDomValue('m_id-pw_input_contact-info', contactInfo);
}