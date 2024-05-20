$(function(){
    updateAutoConnectionCheckbox();
    initCompCdDom();

    $("#pc_sign-in_toggle_feild .toggle-header").click(function() {
        $(this).find(".up_arrow, .down_arrow").toggleClass("hidden");
        $("#pc_sign-in_company_list").slideToggle(function() {
            if ($(this).is(":visible")) {
                $(this).css("overflow", "auto");
            } else {
                $(this).css("overflow", "hidden");
            }
        });
    });

    $("#pc_sign-in_company_list").scroll(function() {
        if ($("#pc_sign-in_company_list").is(":visible")) {
            if ($("#pc_sign-in_company_list")[0].scrollHeight > $("#pc_sign-in_company_list").height()) {
                $("#pc_sign-in_company_list").addClass("show-scrollbar");
            } else {
                $("#pc_sign-in_company_list").removeClass("show-scrollbar");
            }
        }
    });

    $("#pc_sign-in_company_list li").click(function() {
        let selectedText = $(this).find("span").text();
        let selectedId = $(this).find("span").attr("id");
        let passwordUseYn = selectedId.split("_")[2];

        $("#pc_sign-in_toggle_feild .toggle-header span").text(selectedText).attr("id", selectedId);

        $("#pc_sign-in_company_list").slideUp(function() {
            $("#pc_sign-in_toggle_feild .toggle-header .up_arrow").addClass("hidden");
            $("#pc_sign-in_toggle_feild .toggle-header .down_arrow").removeClass("hidden");
        });

        vpnUserStatusCheck = false;
        clearInterval(x);

        initLoginEmpDomArea();

        initPasswordDomArea(passwordUseYn);

        updateSignInButtonStatus(passwordUseYn === 'Y' ? true : false, domMessage.pc_signIn_right_signIn_button, 'startSignIn()');

        if($('#pcSignInContactInfoArea').css('display') === 'flex') {
            initContactInfoArea();
        }

        updateLeftDomArea('pc_auth_signIn_left_contents', domMessage.pc_signIn_left_guideMent_certificationForUse, null);
    });

    $('#pc_signIn_password').on('focusin', function() {
        if(vpnUserStatusCheck) {
            return;
        }

        startSignIn();
    });

    $('#pc_signIn_id, #pc_signIn_password').on('keyup', function(event) {
        if(event.keyCode == 13) {
            let functionName = $('#pcSignInButton').attr('onclick');

            if (functionName === "startSignIn();" || functionName === "startSignIn()") {
                startSignIn();
            }

            if (functionName === "vpnUserPasswordCheck();" || functionName === "vpnUserPasswordCheck()") {
                vpnUserPasswordCheck();
            }
        }
    });
});

function initCompCdDom() {
    $('#pc_sign-in_company_list').hide();
    let text = $('#pc_sign-in_company_list > li:first-child span').text();
    let id = $('#pc_sign-in_company_list > li:first-child span').attr('id');
    let passwordUseYn = $('#pc_sign-in_company_list > li:first-child span').attr('id').split("_")[2];

    $('#pc_sign-in_company_select .toggle-header span').text(text).attr('id', id);
    $('#pc_signIn_id').focus();
    updateSignInButtonStatus(passwordUseYn === 'Y' ? true : false, domMessage.pc_signIn_right_signIn_button, 'startSignIn()');
    initPasswordDomArea(passwordUseYn);
}

function initLoginEmpDomArea() {
    updateInputDomValue('pc_signIn_id', '');
    updateDomAttribute('pc_signIn_id', 'disabled', false);
    inputDomFocus('pc_signIn_id');
}

function initPasswordDomArea(passwordUseYn) {
    let value = passwordUseYn === "Y" ? 'flex' : 'none';
    updateDomCss('pcSignInPasswordArea', 'display', value);
    updateInputDomValue('pc_signIn_password', '');

    updateDomAttribute('pc_signIn_password', 'disabled', passwordUseYn === "Y" ? false : true);

    updateDomAttribute('pc_signIn_password', 'placeholder', domMessage.pc_signIn_right_password_input_placeholder);
    domRemoveClass('pc_signIn_password', 'errorInput');

    updateDomCss('password-check_guide_ment','display', value);
    updateDomCss('passwordCheckFailCountDom','display', value);
    updatePasswordCheckCount(0);
    updatePasswordCheckCountCss(false);
}

function updatePasswordCheckCount(passwordCheckFailCount) {
    updateDomText('passwordCheckFailCount', passwordCheckFailCount);
}

function updatePasswordCheckCountCss(addOrRemove) {
    const className = 'pointC';
    addOrRemove === true ? domAddClass('passwordCheckFailCountDom', className) : domRemoveClass('passwordCheckFailCountDom', className);
}

function updateSignInButtonStatus(disabled, buttonText, onclickFunctionName) {
    updateDomAttribute('pcSignInButton', 'disabled', disabled);
    updateDomText('pcSignInButton', buttonText);
    removeDomAttribute('pcSignInButton', 'onclick');
    updateDomAttribute('pcSignInButton', 'onclick', onclickFunctionName);
}

function initContactInfoArea() {
    updateDomCss('pcSignInContactInfoArea', 'display', 'none');
    updateDomText('contactInfo-title', '');
    updateInputDomValue('pc_signIn_contactInfo', '');
}

function updateContactInfoDomArea(contactInfo, otpType) {
    updateDomCss('pcSignInContactInfoArea', 'display', 'flex');
    let inputTitle = otpType === "E" ? domMessage.pc_signIn_right_input_email : domMessage.pc_signIn_right_input_mobile;
    updateDomText('contactInfo-title', inputTitle);
    updateInputDomValue('pc_signIn_contactInfo', contactInfo);
}

function updateLeftDomArea(domId, upMessage, downMessage, downTagName, downTagClassName) {
    let html = `<h2 class="subC">${upMessage}</h2>`;

    if(downMessage !== null) {
        html += `<br><br><${downTagName} class="${downTagClassName}">${downMessage}</${downTagName}>`;
    }

    updateDomHtml(domId, html);
}

let vpnUserStatusCheck = false;

function startSignIn() {
    let loginEmp = $('#pc_signIn_id').val().trim();
    if(loginEmp === "" || loginEmp.length === 0) {
        commonMessageModalOn(modalMessages.authenticate_validation_message_noInput_username);
        $('#commonMessageModal .closeButton').on('click', function() {
            $('#pc_signIn_id').focus();
            $('#commonMessageModal').hide();

        });
        return false;
    }

    let compCd = $('#pc_sign-in_toggle_feild span').attr('id').split("_")[1];
    let compPasswordUseYn = $('#pc_sign-in_toggle_feild span').attr('id').split("_")[2];
    let isAutoConnect = $('#autoConnectCheckbox').prop('checked');

    startVpnUserStatus(loginEmp, compCd, authenticationMethod.ID_PW, isAutoConnect, compPasswordUseYn,null);
}

function updateDomAfterVpnUserStatusCheckWhenPasswordUseY() {
    updateDomAttribute('pc_signIn_id', 'disabled', true);
    updateInputDomValue('pc_signIn_password', '');
    inputDomFocus('pc_signIn_password');
    updateSignInButtonStatus(false, domMessage.pc_signIn_right_signIn_button, 'vpnUserPasswordCheck();');
}

function updateDomAfterVpnUserStatusCheckWhenPasswordUseNAndMFANull(contactInfo, otpType) {
    updateDomAttribute('pc_signIn_id', 'disabled', true);
    updateContactInfoDomArea(contactInfo, otpType);

    updateSignInButtonStatus(false, domMessage.pc_signIn_right_otpSend_button, 'sendOtpCode(false);');

    let upMessage = domMessage.pc_signIn_left_guideMent_beforeSendOtp_up;
    let downMessage = otpType === "E" ? domMessage.pc_signIn_left_guideMent_beforeSendOtp_down_email : domMessage.pc_signIn_left_guideMent_beforeSendOtp_down_mobile;
    updateLeftDomArea('pc_auth_signIn_left_contents', upMessage, downMessage, 'h2', 'subC');
}

function updateDomAfterPasswordCheckLockTimeOut() {
    updatePasswordCheckCount(0);
    updateInputDomValue('pc_signIn_password', '');
    updateDomAttribute('pc_signIn_password', 'disabled', false);
    updateDomAttribute('pc_signIn_password', 'placeholder', domMessage.pc_signIn_right_password_input_placeholder);
    updateSignInButtonStatus(false, domMessage.pc_signIn_right_signIn_button, 'vpnUserPasswordCheck();');
    updatePasswordCheckCountCss(false);
    $('#pc_signIn_password').focus();
}

function vpnUserPasswordCheck() {
    let loginEmp = $('#pc_signIn_id').val().trim();
    let password = $('#pc_signIn_password').val().trim();
    let compCd = $('#pc_sign-in_toggle_feild span').attr('id').split("_")[1];
    let isAutoConnect = $('#autoConnectCheckbox').prop('checked');

    if(password === "" || password.length === 0) {
        commonMessageModalOn(modalMessages.authenticate_validation_message_noInput_password);
        $('#commonMessageModal .closeButton').on('click', function() {
            $('#commonMessageModal').hide();
        });
        return false;
    }

    let dto = {
        "loginEmp" : loginEmp,
        "password" : password,
        "compCd" : compCd,
        "isAutoConnect" : isAutoConnect,
    }

    callVpnUserPasswordCheckApi(dto).then(response => {
        if(response.status === 200) {
            location.href = response.data;
        }

        if(response.status === 400 && response.code !== "A005") {
            let passwordCheckFailCount = response.data["FAIL_COUNT"];

            updatePasswordCheckCount(passwordCheckFailCount);
            updatePasswordCheckCountCss(true);

            if(passwordCheckFailCount < passwordCheckCount) {
                updateInputDomValue('pc_signIn_password', '');
                inputDomFocus('pc_signIn_password');
                updateDomAttribute('pc_signIn_password', 'placeholder', domMessage.pc_signIn_right_password_input_fail_placeholder);
                domAddClass('pc_signIn_password', 'errorInput');
            }

            if(passwordCheckFailCount >= passwordCheckCount) {
                updateDomAttribute('pc_signIn_password', 'disabled', true);
                updateInputDomValue('pc_signIn_password', '');
                updateDomAttribute('pc_signIn_password', 'placeholder', domMessage.pc_signIn_right_password_input_lock_placeholder);
                domAddClass('pc_signIn_password', 'errorInput');
                updateDomAttribute('pcSignInButton', 'disabled', true);
                updateLeftDomArea('pc_auth_signIn_left_contents', domMessage.pc_signIn_left_passwordCheckLock_message, domMessage.pc_signIn_left_passwordCheckLock_remainTime, 'h1', 'pointC');
                startLockTimer(response.data["REMAIN_SECOND_TIME"]);
            }
        }

        if(response.status === 400 && response.code === "A005") {
            location.href = response.data;
        }
    });
}

function clickIconPasswordView() {
    const passwordField = document.getElementById('pc_signIn_password');
    const openEye = document.getElementById('password-view-icon');
    const closeEye = document.getElementById('password-hide-icon');

    if (passwordField.type === 'password') {
        passwordField.type = "text";
        openEye.style.display = 'none';
        closeEye.style.display = 'block';
    } else {
        passwordField.type = "password";
        openEye.style.display = 'block';
        closeEye.style.display = 'none';
    }
}