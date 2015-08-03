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
            console.log('[MessageportCaller]: ', msg);
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
        var usedKeys = ['0', 'ColorF0Red', 'ColorF2Yellow'];

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
                    displayCalleeApp();
                    break;
                case 405:
                    log('Yellow key pressed');
                    messageManager.sendMessage();
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

    function displayCalleeApp() {
        var calleeAppId = "demoapp012.MessageportCallee";

        function onLaunchSuccess() {
            log('launch callee app success');
        }

        function onLaunchError() {
            log('launch callee app error');
        }

        tizen.application.launch(calleeAppId, onLaunchSuccess, onLaunchError);
    }


    /**
     * Object handling messagePort communication
     */
    var messageManager = {
        init: function () {
            log('message.init');
            var messagePortName = 'MessagePortA';
            var calleeAppId = 'demoapp012.MessageportCallee';

            try {
                log('requestRemoteMessagePort ' + messagePortName);
                this.remoteMsgPort = tizen.messageport.requestRemoteMessagePort(
                    calleeAppId,
                    messagePortName
                );
            } catch (e) {
                log('requestRemoteMessagePort error' + messagePortName);
            }

        },

        sendMessage: function () {
            // Message data is a dictionary - {key, value} pair, not just any Object
            var messageData = {
                key: 'RESULT',
                value: 'OK ' + Date.now()
            }

            try {
                log('sendMessage ');
                this.remoteMsgPort.sendMessage([messageData]);
            } catch (e) {
                log('sendMessage error');
            }
        }
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


        messageManager.init();
    }



}());
