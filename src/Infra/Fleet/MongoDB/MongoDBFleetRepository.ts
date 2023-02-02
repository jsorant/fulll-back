import { MongoClient } from "mongodb";
import { FleetRepository } from "../../../App/Fleet/Commands/Ports/FleetRepository";
import { Fleet } from "../../../Domain/Fleet/Fleet";
import { Identifier } from "../../../Domain/SharedKernel/Identifier";
import { MongoDBFleetAdapter } from "./FleetRepositoryAdapter";

//TODO to consts file
const DBNAME: string = "fulll-backend";
const COLLECTIONNAME: string = "fleets";

export class MongoDBFleetRepository implements FleetRepository {
  private adapter: MongoDBFleetAdapter;
  private client: MongoClient;

  constructor(mongoUri: string, adapter: MongoDBFleetAdapter) {
    this.client = new MongoClient(mongoUri);
    this.adapter = adapter;
  }

  async hasFleetForUserId(userId: Identifier): Promise<boolean> {
    await this.client.connect();
    const collection = this.client.db(DBNAME).collection(COLLECTIONNAME);

    const findResult = await collection.findOne({ userId });

    await this.client.close();

    return findResult !== null;
  }

  async getFleet(id: Identifier): Promise<Fleet> {
    await this.client.connect();
    const collection = this.client.db(DBNAME).collection(COLLECTIONNAME);

    const findResult = await collection.findOne({ id });

    await this.client.close();

    if (findResult === null) {
      throw new Error("Fleet not found for id: " + id);
    }

    return this.adapter.adaptFromMongo(findResult);
  }

  async saveFleet(fleet: Fleet): Promise<void> {
    await this.client.connect();
    const collection = this.client.db(DBNAME).collection(COLLECTIONNAME);

    await collection.replaceOne(
      { id: fleet.getId() },
      this.adapter.adaptToMongo(fleet),
      { upsert: true }
    );

    await this.client.close();
  }
}
