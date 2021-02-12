module.exports = function (RED) {
    function GetUnreadGmail(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        this.session = RED.nodes.getNode(this.session);
        this.credentials = RED.nodes.getCredentials(this.session);
        // Retrieve the config node
        this.on("input", async function (msg) {
            if(this.expiry_date <= Date.now()){
                await this.session.refreshCreds();
                this.credentials = RED.nodes.getCredentials(this.session)
            }
            var Gmail = require('node-gmail-api')
            , gmail = new Gmail(this.credentials.access_token)
            , mailEvent = gmail.messages('label:inbox', {max: 5});
            // console.log(mailEvent);
            var lastTen = []
            mailEvent.on('data', function (data) {
                lastTen.push(data.snippet);
            });
            mailEvent.on('finish', function() {
                node.send({
                    payload: lastTen
                });
            })
        });
    }
    RED.nodes.registerType("get-unread-gmail", GetUnreadGmail);
};
