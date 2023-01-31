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
import { RegisteredVehiclesProjection } from "../../src/App/Fleet/Queries/Views/RegisteredVehiclesProjection";
import { ParkVehicle } from "../../src/App/Fleet/Commands/ParkVehicle";
import { ParkVehicleHandler } from "../../src/App/Fleet/Commands/ParkVehicleHandler";
import { VehicleLocationProjection } from "../../src/App/Fleet/Queries/Views/VehiculeLocationProjection";
import { GetVehiculeLocation } from "../../src/App/Fleet/Queries/GetVehiculeLocation";
import { GetVehiculeLocationHandler } from "../../src/App/Fleet/Queries/GetVehiculeLocationHandler";

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
  const registeredVehicles: RegisteredVehiclesProjection =
    await handler.execute(query);

  assert(
    isVehicleRegistered(vehiclePlateNumber, registeredVehicles),
    "The vehicle is not part of my vehicle fleet"
  );
});

Then(
  "I should be informed this this vehicle has already been registered into my fleet",
  function () {
    assert(lastError !== undefined, "No error was thrown");
    assert(lastError instanceof Error, "'lastError' is not of type Error");
    assert.strictEqual(
      (lastError as Error).message,
      `Vehicle with plate number '${vehiclePlateNumber}' has already been registered into fleet '${myFleetId}'.`
    );
  }
);

const locationLatitudeDegrees: number = 45;
const locationLongitudeDegrees: number = 100;
const locationAltitudeMeters: number = 1000;

Given("a location", function () {
  // Defined by:
  //  'locationLatitudeDegrees'
  //  'locationLongitudeDegrees'
  //  'locationAltitudeMeters'
});

When("I park my vehicle at this location", async function () {
  const command: ParkVehicle = new ParkVehicle(
    myFleetId,
    vehiclePlateNumber,
    locationLatitudeDegrees,
    locationLongitudeDegrees,
    locationAltitudeMeters
  );
  const handler: ParkVehicleHandler = new ParkVehicleHandler(dataPersistence);
  await handler.execute(command);
});

Then(
  "the known location of my vehicle should verify this location",
  async function () {
    const query: GetVehiculeLocation = new GetVehiculeLocation(
      myFleetId,
      vehiclePlateNumber
    );
    const handler: GetVehiculeLocationHandler = new GetVehiculeLocationHandler(
      dataPersistence
    );
    const location: VehicleLocationProjection = await handler.execute(query);
    assert(
      isExpectedLocation(location),
      "The vehicle location does not match expected location"
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

function isVehicleRegistered(
  vehicleToCheckPlateNumber: string,
  registeredVehicles: RegisteredVehiclesProjection
): boolean {
  return (
    registeredVehicles.vehicles.find(
      (vehicle) => vehicle.plateNumber === vehicleToCheckPlateNumber
    ) !== undefined
  );
}

function isExpectedLocation(location: VehicleLocationProjection): boolean {
  return (
    location.latitudeDegrees === locationLatitudeDegrees &&
    location.longitudeDegrees === locationLongitudeDegrees &&
    location.altitudeMeters === locationAltitudeMeters
  );
}
