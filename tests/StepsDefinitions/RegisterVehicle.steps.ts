import assert from "assert";
import { Given, When, Then, Before } from "@cucumber/cucumber";

import { RegisterVehicle } from "../../src/App/Fleet/Commands/RegisterVehicle";
import { RegisterVehicleHandler } from "../../src/App/Fleet/Commands/RegisterVehicleHandler";
import { ListVehicles } from "../../src/App/Fleet/Queries/ListVehicles";
import { ListVehiclesHandler } from "../../src/App/Fleet/Queries/ListVehiclesHandler";
import { FleetRepository } from "../../src/App/Fleet/Commands/Ports/FleetRepository";
import { VehiclesProjection } from "../../src/App/Fleet/Queries/Views/VehiclesProjection";
import { assertIsAnErrorWithMessage } from "./TestTools";
import { makeDataPersistence } from "./Dependencies";

Before(async function () {
  this.dataPersistence = makeDataPersistence();
});

Given("a vehicle", function () {
  this.vehiclePlateNumber = "vehicle_plate_number";
});

Given("I have registered this vehicle into my fleet", async function () {
  await registerVehicleInto(
    this.myFleetId,
    this.vehiclePlateNumber,
    this.dataPersistence
  );
});

Given(
  "this vehicle has been registered into the other user's fleet",
  async function () {
    await registerVehicleInto(
      this.anotherUserFleetId,
      this.vehiclePlateNumber,
      this.dataPersistence
    );
  }
);

When("I register this vehicle into my fleet", async function () {
  await registerVehicleInto(
    this.myFleetId,
    this.vehiclePlateNumber,
    this.dataPersistence
  );
});

When("I try to register this vehicle into my fleet", async function () {
  try {
    await registerVehicleInto(
      this.myFleetId,
      this.vehiclePlateNumber,
      this.dataPersistence
    );
  } catch (error: any) {
    this.lastError = error;
  }
});

Then("this vehicle should be part of my vehicle fleet", async function () {
  const query: ListVehicles = new ListVehicles(this.myFleetId);
  const handler: ListVehiclesHandler = new ListVehiclesHandler(
    this.dataPersistence
  );
  const registeredVehicles: VehiclesProjection = await handler.handle(query);

  assert(
    isVehicleRegistered(this.vehiclePlateNumber, registeredVehicles),
    "The vehicle is not part of my vehicle fleet"
  );
});

Then(
  "I should be informed this this vehicle has already been registered into my fleet",
  function () {
    assertIsAnErrorWithMessage(
      this.lastError,
      `Vehicle with plate number '${this.vehiclePlateNumber}' has already been registered into fleet '${this.myFleetId}'.`
    );
  }
);

async function registerVehicleInto(
  fleetId: string,
  vehiclePlateNumber: string,
  dataPersistence: FleetRepository
): Promise<void> {
  const command: RegisterVehicle = new RegisterVehicle(
    vehiclePlateNumber,
    fleetId
  );
  const handler: RegisterVehicleHandler = new RegisterVehicleHandler(
    dataPersistence
  );
  await handler.handle(command);
}

function isVehicleRegistered(
  vehicleToCheckPlateNumber: string,
  registeredVehicles: VehiclesProjection
): boolean {
  return (
    registeredVehicles.vehiclePlateNumbers.find(
      (plateNumber) => plateNumber === vehicleToCheckPlateNumber
    ) !== undefined
  );
}