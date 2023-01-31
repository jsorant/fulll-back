import assert from "assert";
import { Given, When, Then, Before } from "@cucumber/cucumber";

import { CreateFleet } from "../../src/App/Fleet/Commands/CreateFleet";
import { CreateFleetHandler } from "../../src/App/Fleet/Commands/CreateFleetHandler";
import { RegisterVehicle } from "../../src/App/Fleet/Commands/RegisterVehicle";
import { RegisterVehicleHandler } from "../../src/App/Fleet/Commands/RegisterVehicleHandler";
import { FleetRepository } from "../../src/App/Fleet/Commands/Ports/FleetRepository";
import { InMemoryDataPersistence } from "../../src/Infra/InMemoryFleetRepository";
import { ListRegisteredVehicles } from "../../src/App/Fleet/Queries/ListVehicles";
import { ListRegisteredVehiclesHandler } from "../../src/App/Fleet/Queries/ListVehiclesHandler";
import { ProjectionsPersistence } from "../../src/App/Fleet/Queries/Ports/ProjectionsPersistence";
import { RegisteredVehiclesProjection } from "../../src/App/Fleet/Queries/Views/RegisteredVehiculesProjection";

let dataPersistence: FleetRepository & ProjectionsPersistence;
const myFleetId: string = "my_fleet_id";
const anotherUserFleetId: string = "another_user_fleet_id";
const vehiclePlateNumber: string = "vehicle_plate_number";
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

Given("I have registered this vehicle into my fleet", async function () {
  await registerVehicleIntoMyFleet();
});

Given("the fleet of another user", async function () {
  await createFleet(anotherUserFleetId);
});

Given(
  "this vehicle has been registered into the other user's fleet",
  async function () {
    await registerVehicleIntoAnotherUserFleet();
  }
);

When("I register this vehicle into my fleet", async function () {
  await registerVehicleIntoMyFleet();
});

When("I try to register this vehicle into my fleet", async function () {
  try {
    await registerVehicleIntoMyFleet();
  } catch (error: any) {
    lastError = error;
  }
});

Then("this vehicle should be part of my vehicle fleet", async function () {
  const query: ListRegisteredVehicles = new ListRegisteredVehicles(myFleetId);
  const handler: ListRegisteredVehiclesHandler =
    new ListRegisteredVehiclesHandler(dataPersistence);
  const registeredVehicules: RegisteredVehiclesProjection =
    await handler.execute(query);

  assert(
    isVehiculeRegistered(vehiclePlateNumber, registeredVehicules),
    "The vehicule is not part of my vehicle fleet"
  );
});

Then(
  "I should be informed this this vehicle has already been registered into my fleet",
  function () {
    assert(lastError !== undefined, "No error was thrown");
    assert(lastError instanceof Error, "'lastError' is not of type Error");
    assert.strictEqual(
      (lastError as Error).message,
      `Vehicule with plate number '${vehiclePlateNumber}' has already been registered into fleet '${myFleetId}'.`
    );
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
  const command: RegisterVehicle = new RegisterVehicle(
    vehiclePlateNumber,
    fleetId
  );
  const handler: RegisterVehicleHandler = new RegisterVehicleHandler(
    dataPersistence
  );
  await handler.execute(command);
}

function isVehiculeRegistered(
  vehicleToCheckPlateNumber: string,
  registeredVehicules: RegisteredVehiclesProjection
): boolean {
  return (
    registeredVehicules.vehicules.find(
      (vehicule) => vehicule.plateNumber === vehicleToCheckPlateNumber
    ) !== undefined
  );
}
