$(function(){
    findNoticeList();
});

let nowPage;
let page = 1;
const size = 7;
let paginationDto;
let once = false;

function callOnce() {
    if (!once) {
        once = true;
        commonMessageModalOn(modalMessage.modal_notice_faq_noMore_articles_title, modalMessage.modal_notice_faq_noMore_articles_message, modalMessage.modal_common_button_confirm);
        $('#modalCloseButton').on('click', function() {
            $('#m_modal_message-box').hide();
        });
    }
}
function moreFindNoticeList() {
    let scrollHeight = 0;
    const scrollArea = document.querySelector(".contents_scroll");

    scrollHeight = scrollArea.scrollTop;
    if(scrollHeight + 60 >= scrollArea.scrollHeight - scrollArea.clientHeight){
        let totalPage = paginationDto.totalPage;
        if(nowPage < totalPage) {
            page += 1;
            findNoticeList();
        } else {
            callOnce();
            return false;
        }
    }
}
function findNoticeList() {
    let searchKeyword = $('#m-notice-searchKeyword').val();
    callFindNoticeListApi(page, size, searchKeyword).then(response => {
        nowPage = page;
        paginationDto = response.data.paginationDto;
        drawNoticeList(response.data.smNoticeFindDtos);
    });
}
function drawNoticeList(notices) {
    if(nowPage === 1) {
        $('#m-notice-list-area').empty();
    }
    
    if(notices.length === 0) {
        let html = `<li>${domMessage.mobile_faq_notice_list_empty_message}</li>`;
        $('#m-notice-list-area').append(html);
    } else {
        notices.forEach(notice => {
            let html = `
                        <li>
                            <div class="m_notice_contents_title">
                                <div class="m_notice_toggle-header" onclick="openNoticeContent(this)">
                                    <h3>${notice.noticeTitle}</h3>
                                    <div class="m_contents_toggle_arrow-box">
                                        <img class="m_line_arrow_down" src="/images/mobile/m_line_arrow_down.png" alt="아래화살표">
                                        <img class="m_line_arrow_up" src="/images/mobile/m_line_arrow_up.png" alt="위화살표">
                                    </div>
                                </div>
                                <span>${notice.noticeCreateDate}</span>
                            </div>
                            <div class="m_notice_contents_detail">
                                <p>${notice.noticeContent}</p>
                            </div>
                        </li>
                    `;
    
            $('#m-notice-list-area').append(html);
        });
    }
}
async function callFindNoticeListApi(page, size, searchKeyword) {
    const res = await fetch(`/api/v1/notices?page=${page}&size=${size}&searchKeyword=${searchKeyword}`, {
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
function openNoticeContent(headerDiv) {
    const li = headerDiv.closest('li');
    const isActive = li.classList.contains('active');
    const noticeList = document.querySelectorAll('#m-notice-list-area li');
    const noticeDetail = li.querySelector('.m_notice_contents_detail');

    function slideDown(element) {
        $(element).slideDown();
    }
    function slideUp(element) {
        $(element).slideUp();
    }

    if (isActive) {
        slideUp(noticeDetail);
        li.classList.remove('active');
    } else {
        noticeList.forEach((notice) => {
            if (notice === li) {
                slideDown(noticeDetail);
                notice.classList.add('active');
            } else {
                const inactiveFaqDetail = notice.querySelector('.m_notice_contents_detail');
                slideUp(inactiveFaqDetail);
                notice.classList.remove('active');
            }
        });
    }
}
function searchNotice() {
    page = 1;
    findNoticeList();
}