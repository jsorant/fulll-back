import assert from "assert";
import { Given, When, Then, Before } from "@cucumber/cucumber";

import { RegisterVehicle } from "../../src/App/Commands/RegisterVehicle";
import { RegisterVehicleHandler } from "../../src/App/Commands/RegisterVehicleHandler";
import { FleetsRepository } from "../../src/App/Commands/Ports/FleetsRepository";
import { assertIsAnErrorWithMessage } from "./TestTools";
import { GetFleet } from "../../src/App/Queries/GetFleet";
import { GetFleetHandler } from "../../src/App/Queries/GetFleetHandler";
import { FleetProjection } from "../../src/App/Queries/Views/FleetProjection";
import { VehiclesRepository } from "../../src/App/Commands/Ports/VehiclesRepository";
import {
  createForcedOrInMemoryPersistence,
  createForcedOrSqlite3Persistence,
} from "./Persistence";

Before({ tags: "@critical" }, async function () {
  await createForcedOrSqlite3Persistence(this);
});

Before({ tags: "not @critical" }, async function () {
  await createForcedOrInMemoryPersistence(this);
});

Given("a vehicle", function () {
  this.vehiclePlateNumber = "vehicle_plate_number";
});

Given("I have registered this vehicle into my fleet", async function () {
  await registerVehicleInto(
    this.myFleetId,
    this.vehiclePlateNumber,
    this.vehiclesRepository,
    this.fleetsRepository
  );
});

Given(
  "this vehicle has been registered into the other user's fleet",
  async function () {
    await registerVehicleInto(
      this.anotherUserFleetId,
      this.vehiclePlateNumber,
      this.vehiclesRepository,
      this.fleetsRepository
    );
  }
);

When("I register this vehicle into my fleet", async function () {
  await registerVehicleInto(
    this.myFleetId,
    this.vehiclePlateNumber,
    this.vehiclesRepository,
    this.fleetsRepository
  );
});

When("I try to register this vehicle into my fleet", async function () {
  try {
    await registerVehicleInto(
      this.myFleetId,
      this.vehiclePlateNumber,
      this.vehiclesRepository,
      this.fleetsRepository
    );
  } catch (error: any) {
    this.lastError = error;
  }
});

Then("this vehicle should be part of my vehicle fleet", async function () {
  const query: GetFleet = GetFleet.makeWithFleetId(this.myFleetId);
  const handler: GetFleetHandler = new GetFleetHandler(this.fleetProjections);
  const fleet: FleetProjection = await handler.handle(query);

  assert(
    isVehicleRegisteredIntoFleet(this.vehiclePlateNumber, fleet),
    "The vehicle is not part of my vehicle fleet"
  );
});

Then(
  "I should be informed this this vehicle has already been registered into my fleet",
  function () {
    assertIsAnErrorWithMessage(
      this.lastError,
      "Vehicle has already been registered."
    );
  }
);

async function registerVehicleInto(
  fleetId: string,
  vehiclePlateNumber: string,
  vehiclesRepository: VehiclesRepository,
  fleetsRepository: FleetsRepository
): Promise<void> {
  const command: RegisterVehicle = new RegisterVehicle(
    vehiclePlateNumber,
    fleetId
  );
  const handler: RegisterVehicleHandler = new RegisterVehicleHandler(
    vehiclesRepository,
    fleetsRepository
  );
  await handler.handle(command);
}

function isVehicleRegisteredIntoFleet(
  vehiclePlateNumberToCheck: string,
  fleet: FleetProjection
): boolean {
  return (
    fleet.vehiclesPlateNumber.find(
      (plateNumber) => plateNumber === vehiclePlateNumberToCheck
    ) !== undefined
  );
}
