import assert from "assert";
import { Given, When, Then, Before } from "@cucumber/cucumber";

import { FleetRepository } from "../../src/App/Fleet/Commands/Ports/FleetRepository";
import { FleetProjections } from "../../src/App/Fleet/Queries/Ports/FleetProjections";
import { FleetProjection } from "../../src/App/Fleet/Queries/Views/FleetProjection";
import { CreateFleet } from "../../src/App/Fleet/Commands/CreateFleet";
import { CreateFleetHandler } from "../../src/App/Fleet/Commands/CreateFleetHandler";
import { GetFleet } from "../../src/App/Fleet/Queries/GetFleet";
import { GetFleetHandler } from "../../src/App/Fleet/Queries/GetFleetHandler";
import { assertIsAnErrorWithMessage } from "./TestTools";
import { makeDataPersistence } from "./Dependencies";

Before(async function () {
  const { fleetRepository, projectionsBuilder } = makeDataPersistence();
  this.fleetRepository = fleetRepository;
  this.projectionsBuilder = projectionsBuilder;
});

Given("my user identifier", function () {
  this.myUserId = "my_user_id";
});

Given("I have created my fleet", async function () {
  this.myFleetId = await createFleetAndGetFleetId(
    this.myUserId,
    this.fleetRepository,
    this.projectionsBuilder
  );
});

Given("my fleet", async function () {
  this.myUserId = "my_user_id";
  this.myFleetId = await createFleetAndGetFleetId(
    this.myUserId,
    this.fleetRepository,
    this.projectionsBuilder
  );
});

Given("the fleet of another user", async function () {
  this.anotherUserId = "another_user_id";
  this.anotherUserFleetId = await createFleetAndGetFleetId(
    this.anotherUserId,
    this.fleetRepository,
    this.projectionsBuilder
  );
});

When("I create my fleet", async function () {
  await createFleet(this.myUserId, this.fleetRepository);
});

When("I try to create my fleet", async function () {
  try {
    await createFleet(this.myUserId, this.fleetRepository);
  } catch (error: any) {
    this.lastError = error;
  }
});

Then("I should be able to identify my fleet", async function () {
  const fleet: FleetProjection = await getFleet(
    this.myUserId,
    this.projectionsBuilder
  );
  assert(fleet.id !== undefined, "A fleet identifier was expected");
  assert.strictEqual(fleet.userId, this.myUserId);
});

Then("I should be informed that my fleet is already created", function () {
  assertIsAnErrorWithMessage(this.lastError, `Fleet already created.`);
});

async function createFleetAndGetFleetId(
  userId: string,
  fleetRepository: FleetRepository,
  projectionsBuilder: FleetProjections
): Promise<string> {
  await createFleet(userId, fleetRepository);
  const fleet: FleetProjection = await getFleet(userId, projectionsBuilder);
  return fleet.id;
}

async function createFleet(userId: string, fleetRepository: FleetRepository) {
  const command: CreateFleet = new CreateFleet(userId);
  const handler: CreateFleetHandler = new CreateFleetHandler(fleetRepository);
  await handler.handle(command);
}

async function getFleet(
  userId: string,
  fleetRepository: FleetProjections
): Promise<FleetProjection> {
  const query: GetFleet = new GetFleet(userId);
  const handler: GetFleetHandler = new GetFleetHandler(fleetRepository);
  const fleet: FleetProjection = await handler.handle(query);
  return fleet;
}
