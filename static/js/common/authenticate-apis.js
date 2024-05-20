async function callVpnUserStatusCheckApi(userStatusCheckDto) {
    const res = await fetch(`/api/v1/vpn-users/authenticate/check-status`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(userStatusCheckDto)
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

async function callVpnUserPasswordCheckApi(passwordCheckDto) {
    const res = await fetch(`/api/v1/vpn-users/authenticate/check-password`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(passwordCheckDto)
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

async function callSendOtpCodeApi(isResend, isAutoConnect) {
    let dto = {
        "isResend" : isResend,
        "isAutoConnect" : isAutoConnect
    }

    const res = await fetch(`/api/v1/vpn-users/authenticate/send-otp`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(dto)
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

async function callOtpCheckApi(otpCode) {
    const res = await fetch(`/api/v1/vpn-users/authenticate/check-otp?otpCode=${otpCode}`, {
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

async function callSetPasswordApi(passwordUpdateDto) {
    const res = await fetch(`/api/v1/vpn-users/authenticate/set-password`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(passwordUpdateDto)
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

async function callTwoFactorAuthenticateApi(twoFactorAuthenticateDto) {
    const res = await fetch(`/authenticate/two-factor`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(twoFactorAuthenticateDto)
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

async function callFirstAuthenticateLogoutApi() {
    const res = await fetch(`/api/v1/vpn-users/authenticate/first/log-out`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    }).then(response => {
        return response;
    }).catch(error => {
        console.log(error);
    });

    return res;
}

async function callUpdateVpnAppTokenApiApi(appTokenUpdateDto) {
    const res = await fetch(`/api/v1/vpn-users/authenticate/app-token`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body : JSON.stringify(appTokenUpdateDto)
    }).then(response => {
        return response;
    }).catch(error => {
        console.log(error);
    });

    return res;
}

async function callVpnUserAccountLockApi() {
    const res = await fetch(`/api/v1/vpn-users/account-lock`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    }).then(response => {
        return response;
    }).catch(error => {
        console.log(error);
    });

    return res;
}

async function callUpdateVpnAuthLogTypeApi(authType) {
    const res = await fetch(`/api/v1/vpn-auth-log/${authType}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    }).then(response => {
        return response;
    }).catch(error => {
        console.log(error);
    });

    return res;
}

async function callCheckMatchPinOrPatternApi(dto) {
    const res = await fetch(`/api/v1/vpn-users/authenticate/check-pin-pattern`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(dto)
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
