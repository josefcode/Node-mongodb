const { MongoClient } = require('mongodb');

async function main() {

    const uri = "mongodb+srv://<user>:<password>@mflix.b1in2.mongodb.net/newdata?retryWrites=true&w=majority";
    const client = new MongoClient(uri);

      try {
        // Connect to the MongoDB cluster
        await client.connect();
        await deleteListingsScrapedBeforeDate(client, new Date("2022"));
        // await deleteListingByName(client, "street dance");
        // await updateListingByName(client, "street dance", { year: 2008, review: 8 });
        // await upsertListingByName(client, "The lord of the rings", { name: "The lord of the rings", summary: "let live the history", year: 2003, review: 15 });

//         await createMultipleListings(client, [
//         {
//             name: "Batman",
//             summary: "new movie",
//             year: 2021,
//             review: 3
//         },
//         {
//             name: "dog belly",
//             summary: "new movie of belly",
//             year: 2020,
//             review: 3
//         },
//         {
//             name: "street dance",
//             summary: "let's discover the best off the last ",
//             year: 2021,
//             review: 4
//         },
//         {
//             name: "Brazil",
//             summary: "life style in brazil",
//             year: 1987,
//             review: 6
//         },
//         ]);
//         // Make the appropriate DB calls
        await findOneListingByName(client, "street dance");
    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}
main().catch(console.error);


async function listDatabases(client){
    const databasesList = await client.db().admin().listDatabases();
    console.log("databases: ");
    databasesList.databases.forEach(db => {
        console.log(`- ${db.name}`)
    })
}
//insert only one 
async function createListing(client, newListing){
    const result = await client.db("newdata").collection("film").insertOne(newListing);
    console.log(`New listing created with the following id: ${result.insertedId}`);
}

//create many data
async function createMultipleListings(client, newListings){
    const result = await client.db("newdata").collection("film").insertMany(newListings);
    console.log(`${result.insertedCount} new listing(s) created with the following id(s):`);
    console.log(result.insertedIds);       
}

// find one data 
async function findOneListingByName(client, nameOfListing) {
    const result = await client.db("newdata").collection("film").findOne({ name: nameOfListing });
    if (result) {
        console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
        console.log(result);
    } else {
        console.log(`No listings found with the name '${nameOfListing}'`);
    }
}

//update data 
async function updateListingByName(client, nameOfListing, updatedListing) {
    const result = await client.db("newdata").collection("film")
                        .updateOne({ name: nameOfListing }, { $set: updatedListing });
    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
}

// update if it existed and create new one if it's not existed 

async function upsertListingByName(client, nameOfListing, updatedListing) {
    const result = await client.db("newdata").collection("film")
                        .updateOne({ name: nameOfListing }, 
                                   { $set: updatedListing }, 
                                   { upsert: true });
    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    if (result.upsertedCount > 0) {
        console.log(`One document was inserted with the id ${result.upsertedId._id}`);
    } else {
        console.log(`${result.modifiedCount} document(s) was/were updated.`);
    }
}

//delete one data 
async function deleteListingByName(client, nameOfListing) {
    const result = await client.db("newdata").collection("film")
            .deleteOne({ name: nameOfListing });
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
}

// delete many data 
async function deleteListingsScrapedBeforeDate(client, date) {
    const result = await client.db("newdata").collection("film")
        .deleteMany({ "last_scraped": { $lt: date } });
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
}