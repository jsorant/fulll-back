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
let myFleetId: string;
let vehiclePlate: string;

Before(async function () {
  resetPersistenceLayer();
});

Given("my fleet", async function () {
  myFleetId = "my_fleet_id";
  const command: CreateFleet = new CreateFleet(myFleetId);
  const handler: CreateFleetHandler = new CreateFleetHandler(dataPersistence);
  await handler.execute(command);
});

Given("a vehicle", function () {
  vehiclePlate = "vehicle_plate";
});

When("I register this vehicle into my fleet", async function () {
  const command: RegisterVehicle = new RegisterVehicle(vehiclePlate, myFleetId);
  const handler: RegisterVehicleHandler = new RegisterVehicleHandler(
    dataPersistence
  );
  await handler.execute(command);
});

Then("this vehicle should be part of my vehicle fleet", async function () {
  const query: ListVehicles = new ListVehicles(myFleetId);
  const handler: ListVehiclesHandler = new ListVehiclesHandler(dataPersistence);
  const vehicles: Array<VehicleProjection> = await handler.execute(query);

  assert(isVehiculeInArray(vehiclePlate, vehicles));
});

function resetPersistenceLayer(): void {
  dataPersistence = new InMemoryDataPersistence();
}

function isVehiculeInArray(
  vehiclePlate: string,
  vehicles: Array<VehicleProjection>
): boolean {
  return (
    vehicles.find((element) => element.plate === vehiclePlate) !== undefined
  );
}
