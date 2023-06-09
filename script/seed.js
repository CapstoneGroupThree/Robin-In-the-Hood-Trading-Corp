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
  const modelsToKeep = ["ticker", "ticker_name", "user"];
  const modelNames = Object.keys(db.models);
  const modelsToDrop = modelNames.filter(
    (modelName) => !modelsToKeep.includes(modelName)
  );
  // ! change this force to true to drop all tables that aren't in models to keep array, we can keep at false to keep our trading history"
  // Drop and sync only the models not in the modelsToKeep array
  await Promise.all(
    modelsToDrop.map((modelName) => {
      return db.models[modelName].sync({ force: false });
    })
  );

  // Sync the models in the modelsToKeep array without dropping
  await Promise.all(
    modelsToKeep.map((modelName) => {
      return db.models[modelName].sync({ force: false });
    })
  );

  console.log("db synced!");

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
      User.findOrCreate({
        where: {
          email: "tenzing@capstone.com",
        },
        defaults: {
          first_name: "tenzing",
          last_name: "salaka",
          password: "123",
        },
        transaction,
      }),
      User.findOrCreate({
        where: {
          email: "jamie@capstone.com",
        },
        defaults: {
          first_name: "jamie",
          last_name: "lopez",
          password: "123",
        },
        transaction,
      }),
      User.findOrCreate({
        where: {
          email: "adhemar@capstone.com",
        },
        defaults: {
          first_name: "adhemar",
          last_name: "hernandez",
          password: "123",
        },
        transaction,
      }),
    ]);

    console.log(`seeded ${users.length} users`);
    watchlists = await Promise.all(
      users.map(async ([user]) => {
        const [watchlist, created] = await Watchlist.findOrCreate({
          where: { userId: user.id },
          defaults: {
            /* any default values for the watchlist go here */
          },
          transaction,
        });

        if (!created) {
          console.log(
            "Watchlist skipped - already exists for user:",
            user.toJSON()
          );
        }

        return watchlist;
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
