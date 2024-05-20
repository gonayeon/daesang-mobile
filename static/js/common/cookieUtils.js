function setCookie(cookieName, value) {
    let date = new Date();
    let exp = 180 // 180일 fix
    date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);
    document.cookie = cookieName + '=' + value + ';expires=' + date.toUTCString() + ';path=/';
}

function getCookie(cookieName) {
    let value = document.cookie.match('(^|;) ?' + cookieName + '=([^;]*)(;|$)');
    return value ? value[2] : null;
}

function deleteCookie(cookieName) {
    document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
}
