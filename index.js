const { createExitAwareAbortController } = require("./src/common");
const { startDiscordListener } = require("./src/listeners/discordL");
const { startEvmListener } = require("./src/listeners/evmL");
const { startSolanaListener } = require("./src/listeners/solanaL");
const { startMachineChecker } = require("./src/listeners/machineL");
const { startArkadeListener } = require("./src/listeners/arkadeL");
const { startLightningListener } = require("./src/listeners/lightningL");

const main = async () => {
  const abortController = createExitAwareAbortController();
  startDiscordListener();
  startEvmListener();
  startSolanaListener(abortController.signal);
  startArkadeListener();
  startLightningListener();
  // startMachineChecker();
};

main();
