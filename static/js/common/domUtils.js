function updateInputDomValue(domId, value) {
    $(`#${domId}`).val(value);
}

function updateDomAttribute(domId, attrType, attrName) {
    $(`#${domId}`)
        .attr(attrType, attrName);
}

function inputDomFocus(domId) {
    $(`#${domId}`).focus();
}

function updateDomCss(domId, attr, value) {
    $(`#${domId}`).css(attr, value);
}

function updateDomText(domId, text) {
    $(`#${domId}`).text(text);
}

function changeDomHtml(domId, html) {
    $(`#${domId}`).html(html);
}

function removeDomAttribute(domId, attrType) {
    $(`#${domId}`).removeAttr(attrType);
}

function updateDomHtml(domId, html) {
    $(`#${domId}`).empty();
    $(`#${domId}`).append(html);
}

function domRemove(domId) {
    $(`#${domId}`).remove();
}

function domAddClass(domId, className) {
    $(`#${domId}`).removeClass(className);
    $(`#${domId}`).addClass(className);
}

function domRemoveClass(domId, className) {
    $(`#${domId}`).removeClass(className);
}