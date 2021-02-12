module.exports = function (RED) {
    'use strict'
    function GoogleSession(config) { 
        // the config information needs a runtime API to be set as creds
        const FastMQ = require('fastmq');
        RED.nodes.createNode(this, config);
        this.referenceId = this.credentials.referenceId;
        this.access_token = this.credentials.access_token;
        this.expiry_date = this.credentials.expiry_date;
        this.fastmqChannel = config.fastmqChannel;
        this.fastmqTopic = config.fastmqTopic;

        const node = this;
        if (this.credentials.access_token && this.credentials.expiry_date) {
            this.oauth = {
                access_token: this.credentials.access_token
            }
            this.credHash = crypto.createHash('sha1').update(this.credentials.access_token).digest('base64');
            var self = this;
            if (localUserCache.hasOwnProperty(self.credHash)) {
                this.localIdentityPromise = Promise.resolve(localUserCache[self.credHash]);
            } else {
                self.warn("Failed to authenticate with Google");
            }
        }

        node.refreshCreds = async () => {
            var requestChannel;
            // create a client with 'requestChannel' channel name and connect to server.
            FastMQ.Client.connect('requestChannel', this.fastmqChannel).then((channel) => { // client connected
                requestChannel = channel;
                // send request to 'master' channel  with topic 'test_cmd' and JSON format payload.
                let reqPayload = {
                    data: {
                        referenceId: this.referenceId;
                    }
                };
                return requestChannel.request('master', this.fastmqTopic, reqPayload, 'json');
            }).then((result) => {
                console.log('Got response from master, data:' + result.payload.data);
                // client channel disconnect
                requestChannel.disconnect();
            }).catch((err) => {
                console.log('Got error:', err.stack);
            });
        }
    }

    RED.nodes.registerType('google-session', GoogleSession, {
        credentials: {
            access_token: {
                type: String
            },
            expiry_date: {
                type: Number
            },
            referenceId: {
                type: String
            }
        }
    });


}
