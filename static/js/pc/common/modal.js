function loadVpnClientDownloadModal() {
    const modalArea = document.getElementById('modalArea');
    modalArea.innerHTML = "";

    let html = `
        <div class="vpnModal" id="vpnClientDownloadModal">
            <div id="vpnClientDownloadModalArea">
                <div class="vpnClientDownloadModalBody">
                    <img src="/images/vpn_download_x.png" alt="다운로드이미지">
                    <p class="p1">${modalMessages.vpnModal_pc_vpnClient_download_message}</p>
                    <div class="modalButton">
                        <button type="button" onclick="loadVpnClientRefreshModal('${vpnClientFileRef}')">${modalMessages.vpnModal_pc_vpnClient_download_button}</button>
                    </div>
                </div>
            </div>
        </div>`;

    modalArea.innerHTML= html;
    $('#vpnClientDownloadModal').show();

    $('#vpnClientDownloadModalArea').click(function(e) {
        if($(e.target).parents('.vpnClientDownloadModalBody').length < 1 && !$(e.target).hasClass('vpnClientDownloadModalBody')){
            $('#vpnClientDownloadModal').hide();
        }
    })
}

function loadVpnClientRefreshModal(vpnClientFileRef) {
    location.href=`/api/files/${vpnClientFileRef}`;

    setTimeout(() => {
        vpnClientRefreshModalOn();
    }, 1000);
}

function vpnClientRefreshModalOn() {
    const modalArea = document.getElementById('modalArea');
    modalArea.innerHTML = "";

    let html = `
        <div class="vpnModal" id="vpnClientRefreshModal">
            <div>
                <div>
                    <img src="/images/vpn_download_x.png" alt="다운로드이미지">
                    <p class="p2">
                        ${modalMessages.vpnModal_pc_vpnClient_refresh_message}
                    </p>
                    <div class="modalButton">
                        <button type="button" onclick="location.href='/'">${modalMessages.vpnModal_pc_vpnClient_refresh_button}</button>
                    </div>
                </div>
            </div>
        </div>`;

    modalArea.innerHTML= html;
    $('#vpnClientRefreshModal').show();
}

function commonMessageModalOn(message, addButton, buttonTag) {
    const modalArea = document.getElementById('modalArea');
    modalArea.innerHTML = "";

    let html = `
        <div class="vpnModal" id="commonMessageModal">
            <div>
                <div>
                    <div>
                        <div id="commonMessageModal_contents">
                            <p>${message}</p>
                            <div class="modalButton">`;

                if(addButton === true) {
                    html += `${buttonTag}`;
                }

            html += ` <button type="button" class="closeButton">${modalMessages.vpnModal_pc_common_message_close_button}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

    modalArea.innerHTML= html;
    $('#commonMessageModal').show();
}

function commonLoadingModalOn(modalTitle, modalMessage, addButton, buttonTag) {
    const modalArea = document.getElementById('modalArea');
    modalArea.innerHTML = "";

    let html = `
        <div class="vpnModal" id="vpnLoadingModal">
            <div>
                <div>
                    <div class="spinner-box">
                        <div class="loader-circle"></div>
                        <div class="loader-line-mask">
                            <div class="loader-line"></div>
                        </div>
                        <span>${modalTitle}</span>
                    </div>
                    <p>${modalMessage}</p>`

                if(addButton === true) {
                    html += `${buttonTag}`;
                }

                html += `</div>
            </div>
        </div>`;

    modalArea.innerHTML= html;
    $('#vpnLoadingModal').show();

    const cancelButton = document.getElementById('vpnOpenCancelButton');
    if (cancelButton) {
        setTimeout(() => {
            cancelButton.style.display = 'block';
        }, 30000);
    }
}
function hideVpnOpenLoadingModal() {
    $('#vpnLoadingModal').hide();
}
function appDownloadLinkQRModalOn() {
    const modalArea = document.getElementById('modalArea');
    modalArea.innerHTML = "";

    let html = `
        <div class="vpnModal" id="qrCodeModal">
            <div>
                <div>
                    <div>
                        <button id="qrModalXButton" class="close-button">
                            <img src="/images/x-mark.png" alt="닫기버튼">
                        </button>       
                        
                        <div id="qrCodeModalContents">
                            <h3>${modalMessages.modal_qr_title}</h3>
                            <div id="qr_section"></div>
                            <div id="qrCodeModalGuide">
                                <h4>${modalMessages.modal_qr_guide_title}</h4>
                                <p class="subC">${modalMessages.modal_qr_guide_message}</p>
                            </div>
                            <button id="qrModalCloseButton" class="common-button-style-80 close-button">${modalMessages.modal_qr_button_cancel}</button>
                        </div>     
                    </div>          
                </div>
            </div>
        </div>`;

    modalArea.innerHTML= html;

    $('#qrCodeModal').show();

    $('#qrCodeModal button').click(function(){
        $('#qrCodeModal').hide();
    });
}