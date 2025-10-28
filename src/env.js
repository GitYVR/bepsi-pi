require("dotenv").config();

// Inject datetime into console.log
const myLog = console.log;
console.log = (...args) => {
  myLog.apply(
    console,
    [`[${new Date().toISOString().substring(11, 23)}] -`].concat(...args),
  );
};

// Sanity check
const ENV_VARS = [
  "ARKADE_WS_URL",
  "DISCORD_TOKEN",
  "DISCORD_CHANNEL_ID",
  "NOCODB_API_TOKEN",
  "PAYMENT_ADDRESS",
  "LIGHTNING_LNBIT_URL",
  "SOLANA_TREASURY_ADDRESS",
];
let hasAllEnvVars = true;
for (let i = 0; i < ENV_VARS.length; i++) {
  const curVar = ENV_VARS[i];
  if (!process.env[curVar]) {
    console.log(`Missing ENV_VAR ${curVar}`);
    hasAllEnvVars = false;
  }
}
if (!hasAllEnvVars) {
  process.exit(1);
}

const {
  DISCORD_TOKEN,
  DISCORD_CHANNEL_ID,
  NOCODB_API_TOKEN,
  PAYMENT_ADDRESS,
  ARKADE_WS_URL,
  LIGHTNING_LNBIT_URL,
  SOLANA_TREASURY_ADDRESS,
} = process.env;

console.log(`Listening to payments at address ${PAYMENT_ADDRESS}`);

module.exports = {
  DISCORD_TOKEN,
  DISCORD_CHANNEL_ID,
  NOCODB_API_TOKEN,
  PAYMENT_ADDRESS,
  ARKADE_WS_URL,
  LIGHTNING_LNBIT_URL,
  SOLANA_TREASURY_ADDRESS
};
