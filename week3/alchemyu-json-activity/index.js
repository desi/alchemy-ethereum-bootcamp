const axios = require('axios');

// copy-paste your URL provided in your Alchemy.com dashboard
const ALCHEMY_URL = "";

axios.post(ALCHEMY_URL, {
  jsonrpc: "2.0",
  id: 1,
  method: "eth_getBalance",
  params: [
    "0x6fa30575b439fa76fc966bcdec2d4884bd32ca18",
    "safe"
  ]
}).then((response) => {
  console.log(response.data.result);
});
