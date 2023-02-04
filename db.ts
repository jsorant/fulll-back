import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import { existsSync } from "fs";

export class FleetDatabase {
  private static DATABASE_FILE: string = "fleets.db";
  private db?: Database;

  async reset(): Promise<void> {
    await this.open();
    await this.dropTables();
    await this.createTables();
    await this.close();
  }

  async run(): Promise<void> {
    this.ensureDatabaseExists();
    this.open();
    //
    this.close();
  }

  private async ensureDatabaseExists(): Promise<void> {
    if (this.databaseFileDoesNotExist()) {
      await this.open();
      await this.createTables();
      await this.close;
    }
  }

  private databaseFileDoesNotExist(): boolean {
    return !existsSync(FleetDatabase.DATABASE_FILE);
  }

  // TODO: make constants for magic numbers
  //       clean code with one function by table
  private async createTables(): Promise<void> {
    await this.db!.exec(
      "CREATE TABLE fleet (id TEXT NOT NULL PRIMARY KEY, user_id TEXT NOT NULL)"
    );
    console.log("create");
    await this.db!.exec(
      "CREATE TABLE fleet_vehicles (fleet_id TEXT NOT NULL, vehicle_id TEXT NOT NULL)"
    );
    await this.db!.exec(
      "CREATE TABLE vehicle (id TEXT NOT NULL PRIMARY KEY, plate_number TEXT NOT NULL)"
    );
    await this.db!.exec(
      "CREATE TABLE vehicle_fleets (fleet_id TEXT NOT NULL, vehicle_id TEXT NOT NULL)"
    );
    await this.db!.exec(
      "CREATE TABLE vehicle_location (vehicle_id TEXT NOT NULL, latitude INT NOT NULL, longitude INT NOT NULL, altitude INT)"
    );
  }

  // TODO: make constants for magic numbers
  //       clean code with one function by table
  private async dropTables(): Promise<void> {
    await this.db!.exec("DROP TABLE fleet");
    await this.db!.exec("DROP TABLE fleet_vehicles");
    await this.db!.exec("DROP TABLE vehicle");
    await this.db!.exec("DROP TABLE vehicle_fleets");
    await this.db!.exec("DROP TABLE vehicle_location");
  }

  private async open(): Promise<void> {
    this.db = await open({
      filename: FleetDatabase.DATABASE_FILE,
      driver: sqlite3.Database,
    });
  }

  private async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
    }
  }
}

async function main() {
  console.log("a");
  const db = new FleetDatabase();
  db.run();
  console.log("a");
}

main().then(() => console.log("done."));
