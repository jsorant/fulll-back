import { connect, disconnect } from "mongoose";
import { FleetRepository } from "../../../App/Fleet/Commands/Ports/FleetRepository";
import { Fleet } from "../../../Domain/Fleet/Fleet";
import { Identifier } from "../../../Domain/SharedKernel/Identifier";
import { FleetModel } from "./Documents/FleetDocument";
import { MongoDBFleetAdapter } from "./FleetRepositoryAdapter";

export class MongoDBFleetRepository implements FleetRepository {
  private mongoUri: string;
  private adapter: MongoDBFleetAdapter;

  constructor(mongoUri: string, adapter: MongoDBFleetAdapter) {
    this.mongoUri = mongoUri;
    this.adapter = adapter;
  }

  async hasFleetForUserId(userId: Identifier): Promise<boolean> {
    return false;
  }

  async getFleet(id: Identifier): Promise<Fleet> {
    return Fleet.createNewFleet("");
  }

  async saveFleet(fleet: Fleet): Promise<void> {
    await connect(this.mongoUri);

    const doc = new FleetModel(this.adapter.toMongo(fleet));
    await doc.save();

    await disconnect();
  }
}
