const { MongoClient } = require("mongodb");

async function main() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);
  try {
    // Connect to the MongoDB cluster
    await client.connect();

    const testDoc = {
      name: "Lovely Loft",
      summary: "A charming loft in Paris",
      bedrooms: 1,
      bathrooms: 1,
    };

    const testDocNew = {
      name: "Lovely Loft",
      summary: "NEW desc",
      bedrooms: 2,
      bathrooms: 1,
    };

    //await add(client, testDoc);
    await findOneListingByName(client, "Lovely Loft");
    update(client, "Lovely Loft", testDocNew);
    await findOneListingByName(client, "Lovely Loft");
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}

async function add(client, document) {
  const result = await client
    .db("fulll-backend")
    .collection("fleets")
    .insertOne(document);
  console.log(
    `New listing created with the following id: ${result.insertedId}`
  );
}

async function findOneListingByName(client, nameOfDoc) {
  const result = await client
    .db("fulll-backend")
    .collection("fleets")
    .findOne({ name: nameOfDoc });

  if (result) {
    console.log(
      `Found a listing in the collection with the name '${nameOfDoc}':`
    );
    console.log(result);
  } else {
    console.log(`No listings found with the name '${nameOfDoc}'`);
  }
}

async function update(client, nameOfDoc, newDoc) {
  const result = await client
    .db("fulll-backend")
    .collection("fleets")
    .updateOne({ name: nameOfDoc }, { $set: newDoc });

  console.log(`${result.matchedCount} document(s) matched the query criteria.`);
  console.log(`${result.modifiedCount} document(s) was/were updated.`);
}

main().catch(console.error);
