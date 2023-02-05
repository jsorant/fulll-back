import assert from "assert";
import { Given, When, Then, Before } from "@cucumber/cucumber";

import { FleetsRepository } from "../../src/App/Fleet/Commands/Ports/FleetsRepository";
import { FleetProjections } from "../../src/App/Fleet/Queries/Ports/FleetProjections";
import { FleetProjection } from "../../src/App/Fleet/Queries/Views/FleetProjection";
import { CreateFleet } from "../../src/App/Fleet/Commands/CreateFleet";
import { CreateFleetHandler } from "../../src/App/Fleet/Commands/CreateFleetHandler";
import { GetFleet } from "../../src/App/Fleet/Queries/GetFleet";
import { GetFleetHandler } from "../../src/App/Fleet/Queries/GetFleetHandler";
import { assertIsAnErrorWithMessage } from "./TestTools";
import {
  createForcedOrSqlite3Persistence,
  createForcedOrInMemoryPersistence,
} from "./Persistence";

Before({ tags: "@critical" }, async function () {
  await createForcedOrSqlite3Persistence(this);
});

Before({ tags: "not @critical" }, async function () {
  await createForcedOrInMemoryPersistence(this);
});

Given("my user identifier", function () {
  this.myUserId = "my_user_id";
});

Given("I have created my fleet", async function () {
  this.myFleetId = await createFleetAndGetFleetId(
    this.myUserId,
    this.fleetsRepository,
    this.fleetProjections
  );
});

Given("my fleet", async function () {
  this.myUserId = "my_user_id";
  this.myFleetId = await createFleetAndGetFleetId(
    this.myUserId,
    this.fleetsRepository,
    this.fleetProjections
  );
});

Given("the fleet of another user", async function () {
  this.anotherUserId = "another_user_id";
  this.anotherUserFleetId = await createFleetAndGetFleetId(
    this.anotherUserId,
    this.fleetsRepository,
    this.fleetProjections
  );
});

When("I create my fleet", async function () {
  await createFleet(this.myUserId, this.fleetsRepository);
});

When("I try to create my fleet", async function () {
  try {
    await createFleet(this.myUserId, this.fleetsRepository);
  } catch (error: any) {
    this.lastError = error;
  }
});

Then("I should be able to identify my fleet", async function () {
  const fleet: FleetProjection = await getFleet(
    this.myUserId,
    this.fleetProjections
  );
  assert(fleet.id !== undefined, "A fleet identifier was expected");
  assert.strictEqual(fleet.userId, this.myUserId);
});

Then("I should be informed that my fleet is already created", function () {
  assertIsAnErrorWithMessage(
    this.lastError,
    `Fleet already created for this user.`
  );
});

async function createFleetAndGetFleetId(
  userId: string,
  fleetsRepository: FleetsRepository,
  fleetsProjections: FleetProjections
): Promise<string> {
  await createFleet(userId, fleetsRepository);
  const fleet: FleetProjection = await getFleet(userId, fleetsProjections);
  return fleet.id;
}

async function createFleet(userId: string, fleetsRepository: FleetsRepository) {
  const command: CreateFleet = new CreateFleet(userId);
  const handler: CreateFleetHandler = new CreateFleetHandler(fleetsRepository);
  await handler.handle(command);
}

async function getFleet(
  userId: string,
  fleetsProjections: FleetProjections
): Promise<FleetProjection> {
  const query: GetFleet = GetFleet.makeWithUserId(userId);
  const handler: GetFleetHandler = new GetFleetHandler(fleetsProjections);
  const fleet: FleetProjection = await handler.handle(query);
  return fleet;
}
