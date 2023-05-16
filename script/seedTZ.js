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

    // console.log(allTickers[0].symbol);
    await db.transaction(async (transaction) => {
      // Creating Users
      // await Promise.all([
      //   tickerData.map(async (tickerObject) => {
      //     await Ticker.create({
      //       symbol: tickerObject.T,
      //     });
      //   }),
      // ]);
      //TickerName exp1:
      // console.log(allTickers[0].dataValues.symbol);

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

      //other seeds:
      // let users = [];
      // let watchlists = [];
      // users = await Promise.all([
      //   await User.create(
      //     {
      //       first_name: "charlie",
      //       last_name: "aloisio",
      //       email: "charlie@capstone.com",
      //       password: "123",
      //     },
      //     { transaction }
      //   ),
      //   await User.create(
      //     {
      //       first_name: "han",
      //       last_name: "lin",
      //       email: "han@capstone.com",
      //       password: "123",
      //     },
      //     { transaction }
      //   ),
      //   await User.create(
      //     {
      //       first_name: "tenzing",
      //       last_name: "salaka",
      //       email: "tenzing@capstone.com",
      //       password: "123",
      //     },
      //     { transaction }
      //   ),
      //   await User.create(
      //     {
      //       first_name: "jaime",
      //       last_name: "lopez",
      //       email: "jaime@capstone.com",
      //       password: "123",
      //     },
      //     { transaction }
      //   ),
      //   await User.create(
      //     {
      //       first_name: "adhemar",
      //       last_name: "hernandez",
      //       email: "adhemar@capstone.com",
      //       password: "123",
      //     },
      //     { transaction }
      //   ),
      // ]);
      // console.log(`seeded ${users.length} users`);
      //Creating Watchlists for each user
      // watchlists = await Promise.all(
      //   users.map(
      //     async (user) =>
      //       await Watchlist.create({ userId: user.id }, { transaction })
      //   )
      // );
      // console.log(`Created a watchlist for ${watchlists.length} users`);
    });
    // console.log(`Created ${tickerSymbols.length} tickers.`);
  } catch (error) {
    console.error("Error fetching ticker data:", error);
  }
}

//Using Sequlize transactions to create a watchlist for every user

//Transaction Function
// await db.transaction(async (transaction) => {
//   // Creating Users
// });

// console.log(`seeded ${users.length} users`);
console.log(`seeded successfully`);
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
