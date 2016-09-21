(function () {
    'use strict';

    /**
     * Displays logging information on the screen and in the console.
     * @param {string} msg - Message to log.
     */
    function log(msg) {
        var logsEl = document.getElementById('logs');

        if (msg) {
            // Update logs
            console.log('[MessageportCallee]: ', msg);
            logsEl.innerHTML += msg + '<br />';
        } else {
            // Clear logs
            logsEl.innerHTML = '';
        }

        logsEl.scrollTop = logsEl.scrollHeight;
    }

    /**
     * Register keys used in this application
     */
    function registerKeys() {
        var usedKeys = ['0','ColorF0Red'];

        usedKeys.forEach(
                function (keyName) {
                    tizen.tvinputdevice.registerKey(keyName);
                }
        );
    }


    /**
     * Handle input from remote
     */
    function registerKeyHandler() {
        document.addEventListener('keydown', function (e) {
            switch (e.keyCode) {
                // key 0
                case 48:
                    log();
                    break;
                // Key exit
                case 10009:
                    tizen.application.getCurrentApplication().hide();
                    break;
                case 403:
                    log('Red key pressed');
                    displayCallerApp();
                    break;
                // Just log not used key
                default:
                    log('key pressed: ' + e.keyCode);
            }
        });
    }

    /**
     * Display application version
     */
    function displayVersion() {
        var el = document.createElement('div');
        el.id = 'version';
        el.innerHTML = 'ver: ' + tizen.application.getAppInfo().version;
        document.body.appendChild(el);
    }

     function messagePortInit () {
        var messagePortName = 'MessagePortA';
        var localMsgPort;

        function onMessageReceived(data, remoteMsgPort) {
            log('data received: key: ' + JSON.stringify(data) + ' remoteMsgPort: ' + remoteMsgPort);
        }

        try {
            log('request local message port ' + messagePortName);
            localMsgPort = tizen.messageport.requestLocalMessagePort(messagePortName);
        } catch (e) {
            log('request message port error' + e);
        }

        try {
            log('addMessagePortListener');
            localMsgPort.addMessagePortListener(onMessageReceived);
        } catch (e) {
            log('add message port listener error');
        }
    }

     function displayCallerApp () {
        var callerAppId = "demoapp011.MessageportCaller";

        function onLaunchSuccess() {
            log('launch caller app success');
        }

        function onLaunchError() {
            log('launch caller app error');
        }

        tizen.application.launch(callerAppId, onLaunchSuccess, onLaunchError);

    }

    /**
     * Start the application once loading is finished
     */
    window.onload = function () {

        if (window.tizen === undefined) {
            log('This application needs to be run on Tizen device');
            return;
        }

        displayVersion();
        registerKeys();
        registerKeyHandler();

        messagePortInit();

    };

}());
