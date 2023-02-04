import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import { existsSync } from "fs";
import { Table } from "./Tables/Table";

export class Sqlite3Database {
  private databaseFile: string;
  private db?: Database;
  private tables: Array<Table>;

  constructor(databaseFile: string, tables: Array<Table>) {
    this.databaseFile = databaseFile;
    this.db = undefined;
    this.tables = tables;
  }

  async reset(): Promise<void> {
    if (this.databaseFileExists()) {
      await this.connectThenReset();
    }
  }

  async execute(query: string): Promise<void> {
    await this.ensureDatabaseExists();
    await this.connectThenExecuteQuery(query);
  }

  // Todo factorize & clean with templates methods that support TResult
  async getOne(query: string): Promise<any> {
    await this.ensureDatabaseExists();
    await this.open();
    if (this.db === undefined) {
      throw new Error("Database is closed.");
    }
    const result: any = await this.db.get(query);
    await this.close();
    return result;
  }

  // Todo factorize & clean with templates methods that support TResult
  async getAll(query: string): Promise<any> {
    await this.ensureDatabaseExists();
    await this.open();
    if (this.db === undefined) {
      throw new Error("Database is closed.");
    }
    const result: any = await this.db.all(query);
    await this.close();
    return result;
  }

  private async ensureDatabaseExists(): Promise<void> {
    if (this.databaseFileDoesNotExist()) {
      await this.connectThenCreateTables();
    }
  }

  private databaseFileDoesNotExist(): boolean {
    return !this.databaseFileExists();
  }

  private databaseFileExists(): boolean {
    return existsSync(this.databaseFile);
  }

  private async connectThenReset(): Promise<void> {
    await this.executeConnectedAction(async () => {
      await this.dropTables();
      await this.createTables();
    });
  }

  private async connectThenExecuteQuery(query: string): Promise<void> {
    await this.executeConnectedAction(
      async () => await this.executeQuery(query)
    );
  }

  private async connectThenCreateTables(): Promise<void> {
    await this.executeConnectedAction(async () => await this.createTables());
  }

  private async createTables(): Promise<void> {
    for (const table of this.tables) {
      await this.executeQuery(table.getCreateTableScript());
    }
  }

  private async dropTables(): Promise<void> {
    for (const table of this.tables) {
      await this.executeQuery(this.makeDropTableQuery(table.getTableName()));
    }
  }

  private makeDropTableQuery(tableName: string): string {
    return `DROP TABLE ${tableName}`;
  }

  private async executeConnectedAction(
    action: () => Promise<void>
  ): Promise<void> {
    await this.open();
    await action();
    await this.close();
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
      this.db = undefined;
    }
  }

  private async executeQuery(query: string): Promise<void> {
    if (this.db === undefined) {
      throw new Error("Database is closed.");
    }
    await this.db.exec(query);
  }
}
