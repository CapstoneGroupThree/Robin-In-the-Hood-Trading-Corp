"use strict";

const {
  db,
  models: { User, Watchlist, Ticker },
} = require("../server/db");
const axios = require("axios");
require("dotenv").config();

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
//grabbing Ticker name function, exp1

//
async function seed() {
  await db.sync(); // clears db and matches models to tables
  console.log("db synced!");

  try {
    const response = await axios.get(
      `https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/2023-01-09?adjusted=true&apiKey=${process.env.API_KEY}`
    );
    // const tickerData = response.data.results;
    const allTickers = await Ticker.findAll();

    await db.transaction(async (transaction) => {
      allTickers.map(async (eachTicker) => {
        const ticker = eachTicker.dataValues.symbol;
        try {
          const response = await axios.get(
            `https://api.polygon.io/v3/reference/tickers?ticker=${ticker}&active=true&apiKey=${process.env.API_KEY}`
          );

          const tickerData = response.data.results;
          if (tickerData && tickerData.length > 0) {
            const tickerName = tickerData[0].name;
            await eachTicker.createTicker_name({ name: tickerName });
          } else {
            console.log(`No ticker name found for ${ticker}`);
          }
        } catch (error) {
          console.error(`Error fetching ticker name for ${ticker}:`, error);
        }
      });
    });
    // console.log(`Created ${tickerSymbols.length} tickers.`);
  } catch (error) {
    console.error("Error fetching ticker data:", error);
  }
}

// return {
//   users: {
//     charlie: users[0],
//     han: users[1],
//     tenzing: users[2],
//     jaime: users[3],
//     adhemar: users[4],
//   },
// };

/*
 We've separated the `seed` function from the `runSeed` function.
 This way we can isolate the error handling and exit trapping.
 The `seed` function is concerned only with modifying the database.
*/
async function runSeed() {
  console.log("seeding...");
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
}

/*
  Execute the `seed` function, IF we ran this module directly (`node seed`).
  `Async` functions always return a promise, so we can use `catch` to handle
  any errors that might occur inside of `seed`.
*/
// if (module === require.main) {
//   runSeed();
// }
runSeed();
// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
