async function callSetIsAppApi(isApp) {
    const res = await fetch(`/api/user-access-info/isApp?isApp=${isApp}`, {
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

    return res;
}
