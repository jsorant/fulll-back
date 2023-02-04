import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import { existsSync } from "fs";

export class Sqlite3Database {
  private databaseFile: string;
  private db?: Database;

  constructor(databaseFile: string) {
    this.databaseFile = databaseFile;
  }

  async reset(): Promise<void> {
    await this.open();
    await this.dropTables();
    await this.createTables();
    await this.close();
  }

  async run(query: string): Promise<void> {
    await this.ensureDatabaseExists();
    await this.open();
    await this.executeQuery(query);
    await this.close();
  }

  private async ensureDatabaseExists(): Promise<void> {
    if (this.databaseFileDoesNotExist()) {
      await this.open();
      await this.createTables();
      await this.close;
    }
  }

  private databaseFileDoesNotExist(): boolean {
    return !existsSync(this.databaseFile);
  }

  // TODO: make constants for magic numbers
  //       clean code with one function by table
  private async createTables(): Promise<void> {
    await this.executeQuery(
      "CREATE TABLE fleet (id TEXT NOT NULL PRIMARY KEY, user_id TEXT NOT NULL)"
    );
    console.log("create");
    await this.executeQuery(
      "CREATE TABLE fleet_vehicles (fleet_id TEXT NOT NULL, vehicle_id TEXT NOT NULL)"
    );
    await this.executeQuery(
      "CREATE TABLE vehicle (id TEXT NOT NULL PRIMARY KEY, plate_number TEXT NOT NULL)"
    );
    await this.executeQuery(
      "CREATE TABLE vehicle_fleets (fleet_id TEXT NOT NULL, vehicle_id TEXT NOT NULL)"
    );
    await this.executeQuery(
      "CREATE TABLE vehicle_location (vehicle_id TEXT NOT NULL, latitude INT NOT NULL, longitude INT NOT NULL, altitude INT)"
    );
  }

  // TODO: make constants for magic numbers
  //       clean code with one function by table
  private async dropTables(): Promise<void> {
    await this.executeQuery("DROP TABLE fleet");
    await this.executeQuery("DROP TABLE fleet_vehicles");
    await this.executeQuery("DROP TABLE vehicle");
    await this.executeQuery("DROP TABLE vehicle_fleets");
    await this.executeQuery("DROP TABLE vehicle_location");
  }

  private async open(): Promise<void> {
    this.db = await open({
      filename: this.databaseFile,
      driver: sqlite3.Database,
    });
  }

  private async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
    }
  }

  private async executeQuery(query: string): Promise<void> {
    if (this.db === undefined) {
      throw new Error("Database is closed.");
    }
    await this.db.exec("DROP TABLE fleet");
  }
}
