import assert from "assert";
import { Given, When, Then, Before } from "@cucumber/cucumber";

import { ParkVehicle } from "../../src/App/Commands/ParkVehicle";
import { ParkVehicleHandler } from "../../src/App/Commands/ParkVehicleHandler";
import { LocationProjection } from "../../src/App/Queries/Views/LocationProjection";
import { LocateVehicle } from "../../src/App/Queries/LocateVehicle";
import { LocateVehicleHandler } from "../../src/App/Queries/LocateVehicleHandler";
import { assertIsAnErrorWithMessage } from "./TestTools";
import { VehiclesRepository } from "../../src/App/Commands/Ports/VehiclesRepository";
import { LocationProjections } from "../../src/App/Queries/Ports/LocationProjections";
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

Given("a location", function () {
  this.locationLatitudeDegrees = 45;
  this.locationLongitudeDegrees = 100;
  this.locationAltitudeMeters = 1000;
});

Given("my vehicle has been parked into this location", async function () {
  await parkVehicle(
    this.myFleetId,
    this.vehiclePlateNumber,
    this.locationLatitudeDegrees,
    this.locationLongitudeDegrees,
    this.locationAltitudeMeters,
    this.vehiclesRepository
  );
});

When("I park my vehicle at this location", async function () {
  await parkVehicle(
    this.myFleetId,
    this.vehiclePlateNumber,
    this.locationLatitudeDegrees,
    this.locationLongitudeDegrees,
    this.locationAltitudeMeters,
    this.vehiclesRepository
  );
});

When("I try to park my vehicle at this location", async function () {
  try {
    await parkVehicle(
      this.myFleetId,
      this.vehiclePlateNumber,
      this.locationLatitudeDegrees,
      this.locationLongitudeDegrees,
      this.locationAltitudeMeters,
      this.vehiclesRepository
    );
  } catch (error: any) {
    this.lastError = error;
  }
});

Then(
  "the known location of my vehicle should verify this location",
  async function () {
    const location: LocationProjection = await getVehicleLocation(
      this.myFleetId,
      this.vehiclePlateNumber,
      this.locationProjections
    );
    const isExpectedLocation: boolean =
      location.latitudeDegrees === this.locationLatitudeDegrees &&
      location.longitudeDegrees === this.locationLongitudeDegrees &&
      location.altitudeMeters === this.locationAltitudeMeters;
    assert(
      isExpectedLocation,
      "The vehicle location does not match expected location"
    );
  }
);

Then(
  "I should be informed that my vehicle is already parked at this location",
  function () {
    assertIsAnErrorWithMessage(
      this.lastError,
      `Vehicle is already parked at this location.`
    );
  }
);

async function parkVehicle(
  fleetId: string,
  vehiclePlateNumber: string,
  locationLatitudeDegrees: number,
  locationLongitudeDegrees: number,
  locationAltitudeMeters: number,
  vehiclesRepository: VehiclesRepository
): Promise<void> {
  const command: ParkVehicle = new ParkVehicle(
    fleetId,
    vehiclePlateNumber,
    locationLatitudeDegrees,
    locationLongitudeDegrees,
    locationAltitudeMeters
  );
  const handler: ParkVehicleHandler = new ParkVehicleHandler(
    vehiclesRepository
  );
  await handler.handle(command);
}

async function getVehicleLocation(
  fleetId: string,
  vehiclePlateNumber: string,
  locationProjections: LocationProjections
): Promise<LocationProjection> {
  const query: LocateVehicle = new LocateVehicle(fleetId, vehiclePlateNumber);
  const handler: LocateVehicleHandler = new LocateVehicleHandler(
    locationProjections
  );
  return await handler.handle(query);
}
