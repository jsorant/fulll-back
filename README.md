# Introduction

This repository contains a technical test regarding my application at Fulll.

Instructions for this test are available [here](https://github.com/fulll/hiring/blob/master/Backend/ddd-and-cqrs-intermediare-senior.md).

# Setup

```
npm install
```

# Tests (BDD/Cucumber)

## Run tests

### Mixed

Run critical tests with `sqlite3` data persistence and other tests with `in-memory` data persistence:

```
npm test
```

### In-memory

Run tests with `in-memory` data persistence:

```
npm run test:inmemory
npm run test:inmemory:only # run scenarios tagged with @only
```

### Sqlite3

Run tests with `sqlite3` data persistence:

```
npm run test:sqlite3
npm run test:sqlite3:only # run scenarios tagged with @only
```

## Debug tests (with VSCode)

Some VSCode configurations are set in `.vscode` folder to run tests tagged with `@only` and attach the debugger to the session.
Set "RUN AND DEBUG" configuration in VSCode Debug panel then start a debug session with 'F5'.

Configurations:

- `Cucumber InMemory @only`: Debug with `in-memory` data persistence
- `Cucumber Sqlite3 @only`: Debug with `sqlite3` data persistence

# CLI

## Setup the executable

```
npm link
```

## Run

```
./fleet --help # display available commands
./fleet create <userId> # returns fleetId on the standard output
./fleet display <fleetId>
./fleet register-vehicle <fleetId> <vehiclePlateNumber>
./fleet localize-vehicle <fleetId> <vehiclePlateNumber> <latitude> <longitude> [altitude]
./fleet locate-vehicle <fleetId> <vehiclePlateNumber>
```

# Step 3

## For code quality, you can use some tools: which one and why (in a few words) ?

- a linter (ESLint) to define rules regarding code style (indentation, semi-colons, brackets...) and some code security (eslint-plugin-security)
- a code formatter (Prettier) linked to the linter to auto-format code on save
- a SAST tools (Sonar, GitLab CI, GitHub actions, Snyk Code) to analyze code
- a tool to detect vulnerabilities on dependencies (Snyk Open Source, Sonar...)
- a tool to detect vulnerabilities on Docker images (Snyk Container, Sonar...)
- a code coverage tools (nyc), especially focused on the domain layer
- work in a Docker container to have a unique environment, this container is ideally the same used by the CI

Shift left: make available most of these tools to the dev team, and use them automatically in the CI/CD to detect issues fast. Some of them could be launched automatically during a Git commit to prevent quality issues on important branches (git hooks).

## You can consider to setup a ci/cd process: describe the necessary actions in a few words

CI: Use a dedicated tool (Jenkins, GitHub Actions, GitLab CI...). Implement steps and execute them in a Docker container:

- Execute linter
- Run white-box tests (unit, integration...) with code coverage
- Vulnerability analyzis (SAST, dependencies, dockerfiles, linter, secrets detection...)
- Build and package the application in a Docker image then sign it (security)
- Run black-box tests (system, acceptance, stress, fuzzing...) against the Docker image, and if needed, use docker-compose to test the application with external components (remote database, micro services...)
- Docker image packaging: Publish & tag the image in a Docker registry (Harbor)
- Security: daily builds, add DAST strategies...

Maximize parallelization to have the fastest feedback on the build.

CD for an executable:

- Package the application for a dedicated packet manager in CI step, then publish it (apt, MacPorts...)
- Create a setup to wrap the application (Mac DMG, InstallShield, InnoSetup...)

CD for SaaS: Based on my experience, I will cover a Kubernetes deployment in a cluster managed with OpenShift/OpenStack

- Track changes on the Docker registry (Harbor/pulling) with a dedicated tool to trigger automatic deployment (ArgoCD)
- Write manifests (infratructure as code) to setup the pods, services, deployments, HA strategies & replicas...
- Use tools to detect vulnerabilities on these manifests (Snyk Infrastructure as Code...)
- Routing (& security): use Istio to configure routing and set mTLS (zero trust) using side-cars between internal microservices
- Monitor routing: use Kiali to monitor the traffic inside the Kubernetes cluster
- Setup observability based on logs/metrics: Prometheus, Greylog, Grafana (dashboards)
- Setup alerting based on logs/metrics: Prometheus Alert Manager, PagerDuty, StatusPage, Company messaging system (Emails/Phone/Slack/Mattermost/Discord...)

# Improvements...

- Park vs Localize: use only one term (ubiquitous language)
- Clean Code in Sqlite3 layer (sorry for that, I was running out of time...)
- Add unit tests to check basic validation/business rules
- Add validation methods on every Entities & ValueObjects, right now domain objects lacks basic validations (no empty values, realistic location...)
- Add unit tests to validate everything in the 'Domain' layer that is not covered by BDD/Cucumber tests
- Protect objects' internal data from external access: make public members that are 'Array' private then make getters that return a deep copy of the array (Fleet, Vehicle...)
- Implement a 'deepCopy' function (using new 'structuredClone' method ?)
- Implement a better deep equal method (npm deep-equal ?)
- Make Commands atomic to avoid data inconsistency: implement transactions / units of work
- Implement typed errors (DomainError, then a error class for each business rule...)
- Add pagination on Queries that may return a lot of data (arrays...)
- Security: make sure that all external data (calls data, external component response data...) is validated, sanitized then cloned before using it
- Implement Domain Events for even more isolation and DDD capabilities
- Implement CommandBus & QueryBus for more abstraction & capabilities
- Separate databases if needed: Commands store data in a SQL database (Postgresql...), replicate data in a NoSQL database (MongoDB...) for faster read access
- Implement Event Sourcing...

# Pre-dev DDD-oriented brainstorm

A design step is available in the folder `design`. You may use [Excalidraw](https://excalidraw.com/) to open `fleet.excalidraw`.

Simple Event storming:

![](./design/EventStorming.png "Event storming")

Definition of Root Aggregates, Entities, Value Objects:

![](./design/Model.png "Model")
