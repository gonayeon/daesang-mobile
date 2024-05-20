$(function(){
    initLanguageSelectDom();

    $('#pc-header .toggle-button').click(function() {
        $(this).toggleClass('active');
        $('#pc-header #language ul').toggle();
    });

    $('#pc-header #language li').click(function() {
        let selectedText = $(this).text();
        let selectedId = $(this).attr("id");

        $('#pc-header #language span').text(selectedText).attr('id', selectedId);
        $('#pc-header #language ul').hide();
        $('#pc-header #language .toggle-button').removeClass('active');

        let selectedLanguage = selectedId.split("_")[1];
        changeLanguage(selectedLanguage);
    });
});

function initLanguageSelectDom() {
    $('#pc-header #language > ul').hide();

    let text;
    let id;

    switch (locale) {
        case 'ko':
            text = $('#language > ul > li:first-child').text();
            id = $('#language > ul > li:first-child').attr('id');
            break;

        case 'ko_KR':
            text = $('#language > ul > li:first-child').text();
            id = $('#language > ul > li:first-child').attr('id');
            break;

        case 'en':
            text = $('#language > ul > li:nth-child(2)').text();
            id = $('#language > ul > li:nth-child(2)').attr('id');
            break;

        default:
            text = $('#language > ul > li:nth-child(2)').text();
            id = $('#language > ul > li:nth-child(2)').attr('id');
            break;
    }

    $('#pc-header #language .toggle-button span').text(text).attr('id', id);
}

function changeLanguage(selectedLanguage) {
    const exceptionPageNames = ["PC_NOTICE-DETAIL", "PC_FAQ-DETAIL","MOBILE_NOTICE-DETAIL", "MOBILE_FAQ-DETAIL"];
    if(exceptionPageNames.includes(pageName)) {
        let path = (pageName === "PC_FAQ-DETAIL" || pageName === "MOBILE_FAQ-DETAIL") ? '/faq/list' : '/notice/list';

        location.href = window.location.protocol
                                    .concat("//")
                                    .concat(window.location.host)
                                    .concat(path)
                                    .concat("?lang=")
                                    .concat(selectedLanguage);
    } else {
        let searchParams = new URLSearchParams(location.search);
        searchParams.set('lang', selectedLanguage);

        location.href = window.location.protocol
                                    .concat("//")
                                    .concat(window.location.host)
                                    .concat(window.location.pathname)
                                    .concat("?")
                                    .concat(searchParams);
    }
}