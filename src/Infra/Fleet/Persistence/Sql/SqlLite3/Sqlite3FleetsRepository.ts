import { FleetsRepository } from "../../../../../App/Fleet/Commands/Ports/FleetsRepository";
import { Fleet } from "../../../../../Domain/Fleet/Fleet";
import { Sqlite3Database } from "./Sqlite3Database";

export class Sqlite3FleetsRepository implements FleetsRepository {
  private static DATABASE_FILE: string = "fleets.db";
  private database: Sqlite3Database;

  constructor(database: Sqlite3Database) {
    this.database = database;
  }

  async hasForUserId(userId: string): Promise<boolean> {
    return false;
  }

  async get(id: string): Promise<Fleet> {
    throw new Error("Not implemented");
  }

  async save(fleet: Fleet): Promise<void> {
    this.database.run(
      `INSERT OR REPLACE INTO fleet (id, user_id) VALUES (${fleet.id.value}, ${fleet.userId.value})`
    );
  }
}
