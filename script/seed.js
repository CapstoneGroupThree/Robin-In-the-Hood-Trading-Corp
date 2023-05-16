"use strict";

const {
  db,
  models: { User, Watchlist, Ticker, TickerName },
} = require("../server/db");

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seed() {
  await db.sync({ force: false, alter: true }); // clears db and matches models to tables
  console.log("db synced!");

  await Ticker.sync({ force: false });
  await TickerName.sync({ force: false });

  let users = [];
  let watchlists = [];

  await db.transaction(async (transaction) => {
    users = await Promise.all([
      User.findOrCreate({
        where: {
          email: "charlie@capstone.com",
        },
        defaults: {
          first_name: "charlie",
          last_name: "aloisio",
          password: "123",
        },
        transaction,
      }),
      User.findOrCreate({
        where: {
          email: "han@capstone.com",
        },
        defaults: {
          first_name: "han",
          last_name: "lin",
          password: "123",
        },
        transaction,
      }),
    ]);

    console.log(`seeded ${users.length} users`);

    watchlists = await Promise.all(
      users.map(async ([user, created]) => {
        if (!created) {
          console.log("User skipped - already exists:", user.toJSON());
          return null;
        }
        return Watchlist.create({ userId: user.id }, { transaction });
      })
    );

    // Filter out null watchlists
    watchlists = watchlists.filter((watchlist) => watchlist !== null);

    console.log(`Created a watchlist for ${watchlists.length} users`);
  });

  console.log(`seeded successfully`);
}

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
  } finally {
    console.log("closing db connection");
    await db.close();
    console.log("db connection closed");
  }
}

/*
  Execute the `seed` function, IF we ran this module directly (`node seed`).
  `Async` functions always return a promise, so we can use `catch` to handle
  any errors that might occur inside of `seed`.
*/
if (module === require.main) {
  runSeed();
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
