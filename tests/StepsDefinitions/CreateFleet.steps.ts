import assert from "assert";
import { Given, When, Then, Before } from "@cucumber/cucumber";

import { FleetRepository } from "../../src/App/Fleet/Commands/Ports/FleetRepository";
import { ProjectionsBuilder } from "../../src/App/Fleet/Queries/Ports/ProjectionsBuilder";
import { FleetProjection } from "../../src/App/Fleet/Queries/Views/FleetProjection";
import { CreateFleet } from "../../src/App/Fleet/Commands/CreateFleet";
import { CreateFleetHandler } from "../../src/App/Fleet/Commands/CreateFleetHandler";
import { GetFleet } from "../../src/App/Fleet/Queries/GetFleet";
import { GetFleetHandler } from "../../src/App/Fleet/Queries/GetFleetHandler";
import { assertIsAnErrorWithMessage } from "./TestTools";
import { makeDataPersistence } from "./Dependencies";

Before(async function () {
  this.dataPersistence = makeDataPersistence();
});

Given("my user identifier", function () {
  this.myUserId = "my_user_id";
});

Given("I have created my fleet", async function () {
  this.myFleetId = await createFleetAndGetFleetId(
    this.myUserId,
    this.dataPersistence
  );
});

Given("my fleet", async function () {
  this.myUserId = "my_user_id";
  this.myFleetId = await createFleetAndGetFleetId(
    this.myUserId,
    this.dataPersistence
  );
});

Given("the fleet of another user", async function () {
  this.anotherUserId = "another_user_id";
  this.anotherUserFleetId = await createFleetAndGetFleetId(
    this.anotherUserId,
    this.dataPersistence
  );
});

When("I create my fleet", async function () {
  await createFleet(this.myUserId, this.dataPersistence);
});

When("I try to create my fleet", async function () {
  try {
    await createFleet(this.myUserId, this.dataPersistence);
  } catch (error: any) {
    this.lastError = error;
  }
});

Then("I should be able to identify my fleet", async function () {
  const fleet: FleetProjection = await getFleet(
    this.myUserId,
    this.dataPersistence
  );
  assert(fleet.id !== undefined, "A fleet identifier was expected");
  assert.strictEqual(fleet.userId, this.myUserId);
});

Then("I should be informed that my fleet is already created", function () {
  assertIsAnErrorWithMessage(this.lastError, `Fleet already created.`);
});

async function createFleetAndGetFleetId(
  userId: string,
  dataPersistence: FleetRepository & ProjectionsBuilder
): Promise<string> {
  await createFleet(userId, dataPersistence);
  const fleet: FleetProjection = await getFleet(userId, dataPersistence);
  return fleet.id;
}

async function createFleet(userId: string, dataPersistence: FleetRepository) {
  const command: CreateFleet = new CreateFleet(userId);
  const handler: CreateFleetHandler = new CreateFleetHandler(dataPersistence);
  await handler.handle(command);
}

async function getFleet(
  userId: string,
  dataPersistence: ProjectionsBuilder
): Promise<FleetProjection> {
  const query: GetFleet = new GetFleet(userId);
  const handler: GetFleetHandler = new GetFleetHandler(dataPersistence);
  const fleet: FleetProjection = await handler.handle(query);
  return fleet;
}
