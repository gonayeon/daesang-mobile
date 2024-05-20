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