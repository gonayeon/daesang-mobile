$(function(){
    findFaqList();
});

let nowPage;
let page = 1;
const size = 7;
let paginationDto;
let faqCategory = "";
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
function moreFindFaqList() {
    let scrollHeight = 0;
    const scrollArea = document.querySelector(".contents_scroll");
    scrollHeight = scrollArea.scrollTop;
    if(scrollHeight + 60 >= scrollArea.scrollHeight - scrollArea.clientHeight){
        let totalPage = paginationDto.totalPage;
        if(nowPage < totalPage) {
            page += 1;
            findFaqList();
        } else {
            callOnce();
            return false;
        }
    }
}
function findFaqList() {
    let searchKeyword = $('#m-faq-searchKeyword').val();
    callFindFaqListApi(page, size, searchKeyword, faqCategory).then(response => {
        nowPage = page;
        paginationDto = response.data.paginationDto;
        drawFaqList(response.data.smFaqFindDtos);
    });
}
function drawFaqList(faqs) {
    if(nowPage === 1) {
        $('#n-faq-list-area').empty();
    }
    
    if(faqs.length === 0) {
        let html = `<li>${domMessage.mobile_faq_notice_list_empty_message}</li>`;
        $('#n-faq-list-area').append(html);
    } else {
        faqs.forEach(faq => {
            let html = `
                        <li>
                            <div class="m_faq_contents_title">
                                <div class="m_faq_toggle-header"  onclick="openFaqContent(this)">
                                    <h3>
                                        [<span>${faq.faqCategoryTitle}</span>] <span>${faq.faqTitle}</span>
                                    </h3>
                                    <div class="m_contents_toggle_arrow-box">
                                        <img class="m_line_arrow_down" src="/images/mobile/m_line_arrow_down.png" alt="아래화살표">
                                        <img class="m_line_arrow_up" src="/images/mobile/m_line_arrow_up.png" alt="위화살표">
                                    </div>
                                </div>
                                <div class="m_faq_toggle-bottom">
                                    <span>${faq.faqCreateDate}</span>
                                    <button type="button" class="m_faq_fold_question" onclick="openQuestion(this)">${domMessage.mobile_faq_question_close_button}</button>
                                </div>
                            </div>
                            <div class="m_faq_contents_detail">
                                <div class="m_faq_detail_question">
                                    <p>
                                        ${faq.faqContent}
                                    </p>
                                </div>
                                <div class="m_faq_detail_answer_title">
                                    <h3>
                                        RE: <span>${faq.faqTitle}</span>
                                    </h3>
                                    <span>${faq.faqCreateDate}</span>
                                </div>
                                <p class="m_faq_detail_answer">
                                    ${faq.faqReply}
                                </p>
                            </div>
                        </li> `;
    
            $('#n-faq-list-area').append(html);
        });
    }
}
async function callFindFaqListApi(page, size, searchKeyword, faqCategory) {
    const res = await fetch(`/api/v1/faqs?page=${page}&size=${size}&searchKeyword=${searchKeyword}&faqCategory=${faqCategory}`, {
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

function openFaqContent(headerDiv) {
    const li = headerDiv.closest('li');
    const isActive = li.classList.contains('active');
    const faqList = document.querySelectorAll('#n-faq-list-area li');
    const faqDetail = li.querySelector('.m_faq_contents_detail');
    const faqQuestion = li.querySelector('.m_faq_detail_question');

    function slideDown(element) {
        $(element).slideDown();
    }
    function slideUp(element) {
        $(element).slideUp();
    }

    if (isActive) {
        slideUp(faqDetail);
        slideUp(faqQuestion);
        li.classList.remove('active');
    } else {
        faqList.forEach((faq) => {
            if (faq === li) {
                slideDown(faqDetail);
                slideDown(faqQuestion);
                faq.classList.add('active');
            } else {
                const inactiveFaqDetail = faq.querySelector('.m_faq_contents_detail');
                const inactiveFaqQuestion = faq.querySelector('.m_faq_detail_question');
                slideUp(inactiveFaqDetail);
                slideUp(inactiveFaqQuestion);
                faq.classList.remove('active');
            }
        });
    }
}

function openQuestion(obj) {
    $(obj).closest('li').find('.m_faq_detail_question').slideToggle();
}
function selectFaqCategory(obj) {
    $('#n-faq-category-area button').removeClass("m_faq_category_active")
    $(obj).addClass("m_faq_category_active");

    page = 1
    faqCategory = $(obj).attr('id').split("_")[1];
    findFaqList();
}
function searchFaq() {
    page = 1;
    findFaqList();
}