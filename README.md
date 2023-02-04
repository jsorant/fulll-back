# Introduction

This repository contains a technical test regarding my application at Fulll.

Instructions for this test are available at [here](https://github.com/fulll/hiring/blob/master/Backend/ddd-and-cqrs-intermediare-senior.md).

A design step is available in folder 'design'. You may use [Excalidraw](https://excalidraw.com/) to open `.excalidraw` files.

# Setup

```
npm install
```

# Run tests

## Run Cucumber tests

```
npm test
```

## Run only specific Cucumber tests

Tag the Cucumber scenarios to run with '@only', then run:

```
npm run test:only
```

# Run executable

```
npm link
```

```
./fleet --help
./fleet create <userId> # returns fleetId on the standard output
./fleet register-vehicle <fleetId> <vehiclePlateNumber>
./fleet localize-vehicle <fleetId> <vehiclePlateNumber> lat lng [alt]
```

# DDD questions

- Park vs localize: choose only one
- Should Vehicle be isolated in a bounded context ?

# Technical questions

- How to access VO/Entities primitives ? (data persistence)
- Should members be public readonly vs getters ?

# Some possible improvements...

- Implement a GUID generator for Identifier (npm uuid ?)
- Make public members on Array private and make un getter to return a copy (Fleet, Vehicle...)
- 'deepCopy' implementation
- Rename App/Fleet => App/FleetManagement,VehicleLocalization
- Properly handle a global mongoose connection
- Add validation on Entity, ValueObject and RootAggregate
- CI/CD
- Make commands atomic: implement transactions
- Pagination on Queries that return arrays (ListVehicles)
- Implement a better deep equal method (npm deep-equal ?)
- Implement typed errors
- CommandBus & QueryBus for more abstraction & capabilities
- Separate db if needed

# Docker set up

```
Locally : docker run --name mongodb -d -p 27017:27017 mongo
```
