$(function(){
    $('.faq_folding_button').on('click', function() {
        let $section = $(this).closest('.faq_section');
        let $bottom = $section.find('.faq_section_bottom');

        $bottom.slideUp();
        $(this).hide();
        $section.find('.faq_unfold_button').css('display', 'flex');
    });

    $('.faq_unfold_button').on('click', function() {
        let $section = $(this).closest('.faq_section');
        let $bottom = $section.find('.faq_section_bottom');

        $bottom.slideDown();
        $(this).hide();
        $section.find('.faq_folding_button').css('display', 'flex');
    });
});