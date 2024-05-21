$(function(){

    $('#side_dim').on('click', function (event) {
        if (!$(event.target).closest('#side_bar').length && $('#side_bar').is(':visible')) {
            $('.language_toggle_list').slideUp();
            $("#side_bar").animate({left: "-55%"});
            $("#side_dim").fadeOut();
            event.stopPropagation();
        }
    });

    $(".language_toggle").click(function () {
        $(".language_toggle_list").slideToggle();
        $(".toggle_arrow_box .m_up_arrow").toggle();
        $(".toggle_arrow_box .m_down_arrow").toggle();
    });
});

function sideMenuSlide(){
    $("#side_dim").show();
    $("#side_bar").animate({left: 0});
}

function languageToggle(){
    $(".language_toggle_list").slideToggle();
    $(".toggle_arrow_box .m_up_arrow").toggle();
    $(".toggle_arrow_box .m_down_arrow").toggle();
}

function selectLanguage(element){
    let selectedLanguage = $(element).text();

    $('.language_toggle > span').text(selectedLanguage);
    languageToggle();
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

function selectFaqCategory(obj) {
    $('#m-faq-category-area button').removeClass("m_faq_category_active")
    $(obj).addClass("m_faq_category_active");
}

function openFaqContent(headerDiv) {
    const li = headerDiv.closest('li');
    const isActive = li.classList.contains('active');
    const faqList = document.querySelectorAll('#m-faq-list-area li');
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

function companyListToggle() {
    $("#m_id-pw_company_list").slideToggle();
    $(".up_arrow, .down_arrow").toggleClass("hidden");
}

function companySelect(element) {
    let selectedCompany = $(element).text();
    
    $('.toggle-header span').text(selectedCompany);
    companyListToggle();
}


function loadingModalOn() {
    const mobileModalShow = document.getElementById('m_modal_show');
    mobileModalShow.innerHTML = "";

    $('.language_toggle_list').slideUp();
    $("#side_bar").animate({left: "-55%"});
    $("#side_dim").fadeOut();

    let html = `
        <div class="mobileModal inner" id="m_modal_loading">
            <div>
                <div>
                    <div class="spinner-box">
                        <div class="loader-circle"></div>
                        <div class="loader-line-mask">
                            <div class="loader-line"></div>
                        </div>
                        <span>VPN</span>
                    </div>
                    <p>단말의 간편 인증 지원 여부를 확인 중입니다<br>잠시만 기다려 주세요.</p>
                </div>
            </div>
        </div>`;

    mobileModalShow.innerHTML= html;
    $('#m_modal_loading').show();

    setTimeout(() => {
        $('#m_modal_loading').hide();
        window.location.href = 'vpn-open-start.html';
    }, 5000);
}