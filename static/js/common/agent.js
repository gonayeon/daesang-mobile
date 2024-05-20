// const defines
// BIO Error Codes
const BIOMETRIC_UNKNOWN_ERROR = -100;
const BIOMETRIC_UNAVAILABLE = -101;
const BIOMETRIC_AUTHENTICATION_FAILED = -102;
const BIOMETRIC_SDK_NOT_SUPPORTED = -103;
const BIOMETRIC_HARDWARE_NOT_SUPPORTED = -104;
const BIOMETRIC_PERMISSION_NOT_GRANTED = -105;
const BIOMETRIC_NOT_ENROLLED = -106;
const BIOMETRIC_INTERNAL_PLUGIN_ERROR = -107;
const BIOMETRIC_DISMISSED = -108;
const BIOMETRIC_PIN_OR_PATTERN_DISMISSED = -109;
const BIOMETRIC_SCREEN_GUARD_UNSECURED = -110;
const BIOMETRIC_LOCKED_OUT = -111;
const BIOMETRIC_LOCKED_OUT_PERMANENT = -112;
const BIOMETRIC_NO_SECRET_FOUND = -113;

// Message code
const GET_NPASS_APP_INFO_REQUEST = 'get_npass_app_info_request';
const GET_NPASS_APP_INFO_RESPONSE = 'get_npass_app_info_response';
const BIO_AUTH_REQUEST = 'bio_auth_request';
const BIO_SECRET_REGISTER = 'bio_secret_register';
const BIO_PUSH_REQUESTED = 'bio_push_requested';
const BIO_AUTH_RESPONSE = 'bio_auth_response';
const BIO_SECRET_RESPONSE = 'bio_secret_response';
const PUSH_TOKEN_REQUEST  = 'push_token_request';
const PUSH_TOKEN_RESPONSE = 'push_token_response';
const MDM_ACTIVATE = 'mdm_activate'
const OPEN_DEEPLINK = 'open_deeplink'
const CHECK_APP_PACKAGE = 'check_app_package';
const READY_APP = 'ready_app';

// MSG RESULT
const RESULT_OK = 'ok';
const RESULT_ERROR = 'error';

function isApp(){
    try {
        return !!parent.Cordova;
    }catch(error){
        return true;
    }
}

function buildMessage(msg,arg1,arg2,arg3){
    var b = {
        'msg': msg
    };

    switch(msg){
        case BIO_PUSH_REQUESTED:
            b.data = {
                'authtoken': arg1
            };
            break;
        case BIO_AUTH_RESPONSE:
            if(arg1==RESULT_OK){
                b.data = {
                    'result': RESULT_OK,
                    'authtoken': arg2,
                    'secret': arg3
                }
            } else {
                b.data = {
                    'result': RESULT_ERROR,
                    'error': arg2
                }
            }
            break;
        case BIO_AUTH_REQUEST:
            b.data = {
                'authtoken': arg1
            };
            break;
        case BIO_SECRET_REGISTER:
            b.data = {
                'secret': arg1
            }
            break;
        case BIO_SECRET_RESPONSE:
            b.data = {
                'result': arg1
            }
            if(arg1!=RESULT_OK){
                b.data[RESULT_ERROR] = arg2;
            }
            break;
        case PUSH_TOKEN_RESPONSE:
            if(arg1==RESULT_OK){
                b.data = {
                    'result': RESULT_OK,
                    'push_token': arg2,
                }
            } else {
                b.data = {
                    'result': RESULT_ERROR,
                    'error': arg2
                }
            }

            break;
        case OPEN_DEEPLINK:
            b.data = {
                'url': arg1
            }
            break;
        case MDM_ACTIVATE:
            b.data = {
                'userid': arg1
            }
            break;
        case GET_NPASS_APP_INFO_REQUEST:
            b.data = {

            }
            break;
        case CHECK_APP_PACKAGE:
        case READY_APP:
        case PUSH_TOKEN_REQUEST:
        default:
            break;
    }

    return JSON.parse(JSON.stringify(b));
}

// web has callback to from agent.
var webMessage = {
    _notifyPushMessageCallback : null,
    _responseBioAuthCallback : null,
    _responseBioSecretCallback : null,
    _responsePushToken: null,

    requestBioAuth: function(authtoken){
        parent.postMessage(buildMessage(BIO_AUTH_REQUEST,authtoken),"*");
    },
    registerBioSecret: function(secret){
        parent.postMessage(buildMessage(BIO_SECRET_REGISTER,secret),"*");
    },
    requestPushToken: function(){
        parent.postMessage(buildMessage(PUSH_TOKEN_REQUEST),"*");
    },
    activateMDM: function(sabun){
        parent.postMessage(buildMessage(MDM_ACTIVATE,sabun),"*");
    },
    requestAppInfo: function(){
        parent.postMessage(buildMessage(GET_NPASS_APP_INFO_REQUEST),"*");
    },
    requestCheckAppPackage: function(){
        parent.postMessage(buildMessage(CHECK_APP_PACKAGE),"*");
    },
    readyApp: function (){
        parent.postMessage(buildMessage(READY_APP),"*");
    },
    openDeepLink: function(url){
        if(isApp()) {
            parent.postMessage(buildMessage(OPEN_DEEPLINK, url), "*");
        }else {
            window.open(d.data.url,"_blank");
        }
    },


    webCallBack: function (e){
        const d = e.data;
        switch (d.msg){
            case BIO_PUSH_REQUESTED:
                return this._notifyPushMessageCallback(d);
            case BIO_AUTH_RESPONSE:
                return this._responseBioAuthCallback(d);
            case BIO_SECRET_RESPONSE:
                return this._responseBioSecretCallback(d);
            case PUSH_TOKEN_RESPONSE:
                return this._responsePushToken(d);
            case GET_NPASS_APP_INFO_RESPONSE:
                return this._responseGetAppInfo(d);
        }
    },

    addWebCallback: function(notifyPushMessageCallback, responseBioAuthCallback, responseBioSecretCallback,responsePushToken,responseGetAppInfo){

        window.removeEventListener("message",(e)=>this.webCallBack(e));

        this._notifyPushMessageCallback = notifyPushMessageCallback;
        this._responseBioAuthCallback = responseBioAuthCallback;
        this._responseBioSecretCallback = responseBioSecretCallback;
        this._responsePushToken = responsePushToken;
        this._responseGetAppInfo = responseGetAppInfo;

        window.addEventListener("message", (e)=>this.webCallBack(e),false);

    },
};