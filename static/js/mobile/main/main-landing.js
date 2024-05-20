function startBioRegister() {
    isApp()
        ? location.href='/authenticate/start'
        : openAgentApp(false);
}

window.addEventListener('load', function(){
    webMessage.readyApp();
});