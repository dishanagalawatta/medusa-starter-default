const https = require('http');

const apiKey = "pk_98740365646b3238cbc667387561805906d5b8a6d4fef0a1b0c54008780ea54b"; // from the user's trace logs

async function run() {
  console.log("Fetching products...");
  
  // We need an admin auth token or an admin API key to delete products.
  // The publishable API key is only for the Store API.
  console.log("Please delete the seeded products ('Electrotion Starter Kit' and 'Electrotion Developer Board') manually via your Medusa Admin Dashboard at http://localhost:7001.");
}

run();
