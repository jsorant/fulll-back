# Introduction

This repository contains a technical test regarding my application at Fulll.

Instructions for this test are available at [here](https://github.com/fulll/hiring/blob/master/Backend/ddd-and-cqrs-intermediare-senior.md).

A design step is available in folder 'design'. You may use [Excalidraw](https://excalidraw.com/) to open `.excalidraw` files.

# Setup

```
npm install
```

# Cucumber tests

## Run tests

### Mixed

Run critical tests with sqlite3 data persistence and other tests with in-memory data persistence:

```
npm test
```

### In-memory

Run tests with in-memory data persistence:

```
npm run test:inmemory
npm run test:inmemory:only # only run scenarios tagged with @only
```

Run tests with sqlite3 data persistence:

```
npm run test:sqlite3
npm run test:sqlite3:only # only run scenarios tagged with @only
```

## Debug tests (with VSCode)

Some VSCode launchers are configured to run tests tagged with @only and attach the debugger to the session.
Configure "RUN AND DEBUG" in the Debug panel then start debug session with 'F5'.

- Cucumber InMemory @only: Use in-memory data persistence
- Cucumber Sqlite3 @only: Use Sqlite3 data persistence

# CLI

## Setup the executable

```
npm link
```

## Run

```
./fleet --help # display available commands
./fleet create <userId> # returns fleetId on the standard output
./fleet register-vehicle <fleetId> <vehiclePlateNumber>
./fleet localize-vehicle <fleetId> <vehiclePlateNumber> lat lng [alt]
```

# Step 3

- For code quality, you can use some tools : which one and why (in a few words) ?
- you can consider to setup a ci/cd process : describe the necessary actions in a few words

# DDD questions

- Park vs localize: choose only one
- Should Vehicle be isolated in a bounded context ?

# Technical questions

- How to simplify VO/Entities persistence by decoupling data from logic ? (generic data persistence)
- Should members be public readonly vs getters ?

# Some possible improvements...

- Make public members on Array private and make un getter to return a copy (Fleet, Vehicle...)
- 'deepCopy' implementation
- Clean Code in Sqlite3 layer
- Rename App/Fleet => App/FleetManagement,VehicleLocalization
- Add validation method on Entity, ValueObject
- CI/CD: build, package scripts
- Make commands atomic: implement transactions / unit of work
- Pagination on Queries that return arrays (ListVehicles)
- Implement a better deep equal method (npm deep-equal ?)
- Implement typed errors / DomainError...
- CommandBus & QueryBus for more abstraction & capabilities
- Separate db if needed
