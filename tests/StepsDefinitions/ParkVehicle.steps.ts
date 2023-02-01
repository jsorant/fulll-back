import assert from "assert";
import { Given, When, Then, Before } from "@cucumber/cucumber";

import { ParkVehicle } from "../../src/App/Fleet/Commands/ParkVehicle";
import { ParkVehicleHandler } from "../../src/App/Fleet/Commands/ParkVehicleHandler";
import { LocationProjection } from "../../src/App/Fleet/Queries/Views/LocationProjection";
import { GetVehicleLocation } from "../../src/App/Fleet/Queries/GetVehicleLocation";
import { GetVehicleLocationHandler } from "../../src/App/Fleet/Queries/GetVehicleLocationHandler";
import { FleetRepository } from "../../src/App/Fleet/Commands/Ports/FleetRepository";
import { ProjectionsBuilder } from "../../src/App/Fleet/Queries/Ports/ProjectionsBuilder";
import { assertIsAnErrorWithMessage } from "./TestTools";
import { makeDataPersistence } from "./Dependencies";

Before(async function () {
  this.dataPersistence = makeDataPersistence();
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
    this.dataPersistence
  );
});

When("I park my vehicle at this location", async function () {
  await parkVehicle(
    this.myFleetId,
    this.vehiclePlateNumber,
    this.locationLatitudeDegrees,
    this.locationLongitudeDegrees,
    this.locationAltitudeMeters,
    this.dataPersistence
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
      this.dataPersistence
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
      this.dataPersistence
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
  dataPersistence: FleetRepository
): Promise<void> {
  const command: ParkVehicle = new ParkVehicle(
    fleetId,
    vehiclePlateNumber,
    locationLatitudeDegrees,
    locationLongitudeDegrees,
    locationAltitudeMeters
  );
  const handler: ParkVehicleHandler = new ParkVehicleHandler(dataPersistence);
  await handler.handle(command);
}

async function getVehicleLocation(
  fleetId: string,
  vehiclePlateNumber: string,
  dataPersistence: ProjectionsBuilder
): Promise<LocationProjection> {
  const query: GetVehicleLocation = new GetVehicleLocation(
    fleetId,
    vehiclePlateNumber
  );
  const handler: GetVehicleLocationHandler = new GetVehicleLocationHandler(
    dataPersistence
  );
  return await handler.handle(query);
}
