import assert from "assert";
import { Given, When, Then, Before } from "@cucumber/cucumber";

import { CreateFleet } from "../../src/App/Commands/CreateFleet";
import { CreateFleetHandler } from "../../src/App/Commands/CreateFleetHandler";
import { RegisterVehicle } from "../../src/App/Commands/RegisterVehicle";
import { RegisterVehicleHandler } from "../../src/App/Commands/RegisterVehicleHandler";
import { FleetRepository } from "../../src/App/Commands/Ports/FleetRepository";
import { InMemoryDataPersistence } from "../../src/Infra/InMemoryFleetRepository";
import { ListVehicles } from "../../src/App/Queries/ListVehicles";
import { ListVehiclesHandler } from "../../src/App/Queries/ListVehiclesHandler";
import { ProjectionsPersistence } from "../../src/App/Queries/Ports/ProjectionsPersistence";
import { VehicleProjection } from "../../src/App/Queries/Views/VehicleProjection";

let dataPersistence: FleetRepository & ProjectionsPersistence;
const myFleetId: string = "my_fleet_id";
const anotherUserFleetId: string = "another_user_fleet_id";
const vehiclePlate: string = "vehicle_plate";
let lastError: any | undefined;

Before(async function () {
  resetPersistenceLayer();
  lastError = undefined;
});

Given("my fleet", async function () {
  await createFleet(myFleetId);
});

Given("a vehicle", function () {
  // Defined by 'vehiclePlate'
});

When("I register this vehicle into my fleet", async function () {
  await registerVehicleIntoMyFleet();
});

Then("this vehicle should be part of my vehicle fleet", async function () {
  const query: ListVehicles = new ListVehicles(myFleetId);
  const handler: ListVehiclesHandler = new ListVehiclesHandler(dataPersistence);
  const vehicles: Array<VehicleProjection> = await handler.execute(query);

  assert(
    isVehiculeInArray(vehiclePlate, vehicles),
    "The vehicule is not part of my vehicle fleet"
  );
});

Given("I have registered this vehicle into my fleet", async function () {
  await registerVehicleIntoMyFleet();
});

When("I try to register this vehicle into my fleet", async function () {
  try {
    await registerVehicleIntoMyFleet();
  } catch (error: any) {
    lastError = error;
  }
});

Then(
  "I should be informed this this vehicle has already been registered into my fleet",
  function () {
    assert(lastError !== undefined, "No error was thrown");
    assert(lastError instanceof Error, "'lastError' is not of type Error");
    assert.strictEqual(
      (lastError as Error).message,
      `Vehicule '${vehiclePlate}' has already been registered into fleet '${myFleetId}'.`
    );
  }
);

Given("the fleet of another user", async function () {
  await createFleet(anotherUserFleetId);
});

Given(
  "this vehicle has been registered into the other user's fleet",
  async function () {
    await registerVehicleIntoAnotherUserFleet();
  }
);

function resetPersistenceLayer(): void {
  dataPersistence = new InMemoryDataPersistence();
}

async function createFleet(fleetId: string) {
  const command: CreateFleet = new CreateFleet(fleetId);
  const handler: CreateFleetHandler = new CreateFleetHandler(dataPersistence);
  await handler.execute(command);
}

async function registerVehicleIntoMyFleet(): Promise<void> {
  await registerVehicleInto(myFleetId);
}

async function registerVehicleIntoAnotherUserFleet(): Promise<void> {
  await registerVehicleInto(anotherUserFleetId);
}

async function registerVehicleInto(fleetId: string): Promise<void> {
  const command: RegisterVehicle = new RegisterVehicle(vehiclePlate, fleetId);
  const handler: RegisterVehicleHandler = new RegisterVehicleHandler(
    dataPersistence
  );
  await handler.execute(command);
}

function isVehiculeInArray(
  vehiclePlate: string,
  vehicles: Array<VehicleProjection>
): boolean {
  return (
    vehicles.find((element) => element.plate === vehiclePlate) !== undefined
  );
}
