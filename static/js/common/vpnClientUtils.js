const windowsVpnTunnelingOpenResultErrorCodes = {
      "3"  : "2차 인증 OTP 키 등록 필요",
      "2"  : "2차 인증 필요",
      "1"  : "비밀번호 변경 필요",
      "0"  : "사용자 인증 성공(터널 연결 성공)",
     "-1"  : "자동 설정 URL 정보 수집 실패",
     "-2"  : "터널링에 사용될 인터페이스 수집 실패",
     "-3"  : "TUN/TAP 인터페이스 부재 및 오류",
     "-4"  : "매뉴얼 설정 항목 불충분",
     "-5"  : "자동 설정 정보 수집 실패",
     "-6"  : "자동 설정 정보 항목 불충분",
     "-7"  : "사용자 인증 실패",
     "-8"  : "IP 획득 실패",
     "-9"  : "서버 접속 실패",
     "-10" : "라우팅 정보 설정 실패",
     "-11" : "통신 상태 불량으로 접속 해제됨",
     "-12" : "프로세스 체크 실패",
     "-13" : "현재 OS 버전 차단",
     "-14" : "백신 체크 실패",
     "-15" : "시간별 접속 허용 차단",
     "-16" : "무결성 체크 실패",
     "-17" : "동시 접속자 수 제한으로 접속 실패",
    "-100" : "파라미터 오류",
    "-200" : "얼굴 인증 토큰 확인 실패"
}
function requestVpnTunnelingOpen(osType) {
    if(osType === "W" || osType === "M") {
        let modalMessage = osType === "W" ? modalMessages.vpn_tunneling_open_start_message_windows : modalMessages.vpn_tunneling_open_start_message_macos;
        commonLoadingModalOn(modalMessages.vpnModal_pc_vpnClient_check_vpn, modalMessage, true, modalMessages.modal_button_vpn_loading_error_cancel);
    }

    if(osType === "A" || osType === "I") {
        commonLoadingModalOn(modalMessage.modal_loading_title_vpn, modalMessage.modal_loading_message_vpn_tunneling_open, true, modalMessage.modal_button_vpn_loading_error_cancel);
    }

    callCreateParameterByOsCodeForVpnTunnelingOpenApi(osType).then(response => {
        if(response.status === 200) {
            let encryptParameter = response.data;
            osType === "W" ? startVpnTunnelingOpenWindows(encryptParameter) :  startVpnTunnelingOpenDeepLink(encryptParameter);
        }

        if(response.status === 400 && response.code === 'A005') {
            location.href = response.data;
            return;
        }

        if(response.status === 400 && response.code === 'C003') {
            alert(response.message);
            return;
        }
    });
}
function startVpnTunnelingOpenWindows(encryptParameter) {
    $.ajax({
        type : 'POST',
        url : `https://localhost:46435`,
        data : encryptParameter,
        contentType : 'text/plain',
        async: false,
        timeout: 3000,
        success: function(encryptResult) {
            console.log("success : " +encryptResult);
            windowsVpnTunnelingOpenSuccessPostProcess(encryptParameter, encryptResult);
        },
        error : function(error) {
            console.log("error : " +error);
            setTimeout(() => {
                location.href = "/vpn/open-fail-unknown";
            }, 2000);
        }
    });
}
function windowsVpnTunnelingOpenSuccessPostProcess(encryptParameter, encryptResult) {
    setTimeout(() => {
        callGetWindowsVpnTunnelingOpenResultApi(encryptParameter, encryptResult);
    }, 2000);
}
function startVpnTunnelingOpenDeepLink(encryptParameter) {
    isApp() ? webMessage.openDeepLink(encryptParameter) : location.href = encryptParameter;
    setTimeout(function () {
        window.location.replace("/vpn/open-complete");
    }, 2000);
}
function downloadVpnClient(osCode, mdmUseFlag) {
    switch (osCode) {
        case "W":
            location.href = '/api/files/VPN_WINDOWS';
            break;

        case "M":
            let linkMacOs = 'https://apps.apple.com/kr/app/axgate-vpn-client/id1475051721?';
            isApp()
                ? webMessage.openDeepLink(linkMacOs)
                : location.href = linkMacOs;
            break;

        case "A":
            let linkAndroid = mdmUseFlag === "Y"
                                        ? 'https://mstore.daesang.com'
                                        : window.location.protocol.concat("//").concat(window.location.host).concat(`/api/files/VPN_ANDROID`);
            isApp()
                ? webMessage.openDeepLink(linkAndroid)
                : location.href = linkAndroid;

            break;

        case "I":
            let linkIOS = mdmUseFlag === "Y"
                                        ? 'https://mstore.daesang.com'
                                        : 'https://apps.apple.com/kr/app/axgate-vpn/id1225845492?'
            isApp()
                ? webMessage.openDeepLink(linkIOS)
                : location.href = linkIOS;

            break;
    }
}
function callWindowsVpnClientStatusCheckApi() {
    $.ajax({
        type : 'POST',
        url : `https://localhost:46435`,
        data : 'r=211683872;alg=3;param=xDSgetOE5WxKkGsORDqK+A==',
        contentType : 'text/plain',
        async: false,
        timeout: 5000,
        success: function(response) {
            console.log(response);
            checkAppToken();
        },
        error : function(error) {
            console.log(error);
            loadVpnClientDownloadModal();
        }
    });
}
async function callCreateParameterByOsCodeForVpnTunnelingOpenApi(osCode) {
    const res = await fetch(`/api/v1/vpn-client/create-parameter/${osCode}`, {
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
function callGetWindowsVpnTunnelingOpenResultApi(encryptParameter, encryptResult) {
    let dto = {
        "encryptParameter" : encryptParameter,
        "encryptResult" : encryptResult
    }

    $.ajax({
        type : 'POST',
        url : `/api/v1/vpn-client/result/windows-open`,
        contentType : 'application/json; charset=utf-8',
        data : JSON.stringify(dto),
        dataType : "json",
        async: false,
        timeout: 5000,
        tryCount : 1,
        retryLimit : 3,
        success: function(response) {
            if(response.status === 200) {
                const result = response.data;

                if(result === "0") {
                    setTimeout(() => {
                        location.href = "/vpn/open-success";
                    }, 2000);
                }

                if(result !== "0" && result in windowsVpnTunnelingOpenResultErrorCodes) {
                    alert("VPN Tunneling Open Fail Code : " +response.data +" Fail Result : " +windowsVpnTunnelingOpenResultErrorCodes[response.data]);
                    setTimeout(() => {
                        location.href = "/vpn/open-fail-client";
                    }, 2000);
                }

                if(result !== "0" && !(result in windowsVpnTunnelingOpenResultErrorCodes)) {
                    setTimeout(() => {
                        location.href = "/vpn/open-fail-unknown";
                    }, 2000);
                }
            }
        },
        error : function(error) {
            console.log(error);

            this.tryCount++;
            if(this.tryCount <= this.retryLimit) {
                $.ajax(this);
                return;
            } else {
                location.href = "/vpn/open-fail-unknown";
            }

            return;
        }
    });
}
function disconnectVpn() {
    callFirstAuthenticateLogoutApi().then(res => {
        let url = 'axvpn://?action=disconnect';
        isApp() ? webMessage.openDeepLink(url) : location.href = url;
        vpnDisconnectModal();
        setTimeout(() => {
            location.href = '/';
        }, 2000);
    })
}

function logoutAfterDisconnectVpn() {
    let url = 'axvpn://?action=disconnect';
    isApp() ? webMessage.openDeepLink(url) : location.href = url;
    setTimeout(() => {
        location.href = '/authenticate/two-factor/log-out';
    }, 2000);
}

function disconnectPcVpn() {
    callGetDisconnectPCParameterApi().then(response => {
        if(response.status === 200) {
            response.data["OS_CODE"] === "W"
                ? disconnectVpnWindows(response.data["DISCONNECT_URL"])
                : disconnectVpnMacOS(response.data["DISCONNECT_URL"]);
        }
    });
}

async function callGetDisconnectPCParameterApi() {
    const res = await fetch(`/api/v1/vpn-client/pc-disconnect-parameter`, {
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

function disconnectVpnWindows(parameter) {
    $.ajax({
        type : 'POST',
        url : `https://localhost:46435`,
        data : parameter,
        contentType : 'text/plain',
        async: false,
        timeout: 3000,
        success: function(response) {
            console.log("success : " +response);
            setTimeout(() => {
                location.href = '/authenticate/two-factor/log-out';
            }, 2000);
        },
        error : function(error) {
            console.log("error : " +error);
            setTimeout(() => {
                location.href = '/authenticate/two-factor/log-out';
            }, 2000);
        }
    });
}

function disconnectVpnMacOS(parameter) {
    isApp() ? webMessage.openDeepLink(parameter) : location.href = parameter;
    setTimeout(() => {
        location.href = '/authenticate/two-factor/log-out';
    }, 2000);
}