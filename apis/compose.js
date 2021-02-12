module.exports = function (RED) {
  function ComposeGmail(config) {
    RED.nodes.createNode(this, config);
    this.url = config.url;
    this.payloadTypeUrl = config.payloadTypeUrl;
    var node = this;

    // Retrieve the config node
    this.on("input", async function (msg) {
      
    });
  }
  RED.nodes.registerType("compose-gmail", ComposeGmail);
};
