const WebSocket = require("ws");
const { dispenseFromPayments } = require("../machine");
const { ARKADE_WS_URL } = require("../env");

// WebSocket URL
const arkWsUrl = ARKADE_WS_URL;

const startArkadeListener = async () => {
  // Create a new WebSocket connection
  const ws = new WebSocket(arkWsUrl);

  // Event listener for when the connection is open
  await ws.on("open", function open() {
    console.log("Connected to BTCPay " + arkWsUrl);
  });

  // Event listener for when a message is received from the server
  await ws.on("message", function message(data) {
    //console.log('Received message from server:', data);
    const messageStr = data.toString("utf-8"); // Convert buffer to string
    console.log("Received message from BTCPay server:", messageStr);
    // example: 518-5000.0
    pinNo = messageStr.split("-")[0];
    dispenseFromPayments(pinNo, "sats");
  });
  
 ws.onclose = (event) => {
    const reconnectInterval = 1000; // 60000 milliseconds = 1 minute
    console.log("Connection cannot be established. Reconnecting in 1 second");
    setTimeout(startArkadeListener, reconnectInterval);
};

  // Error handling
  ws.onerror = (error) => {
  console.error("BTCPay WebSocket error:", error.message);
  };
};

module.exports = {
  startArkadeListener,
};
