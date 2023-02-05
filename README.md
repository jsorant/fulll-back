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

Run tests with Sqlite3 data persistence:

```
npm run test:sqlite3
npm run test:sqlite3:only # only run scenarios tagged with @only
```

## Debug tests (with VSCode)

Some VSCode configurations are implemented to run tests tagged with @only and attach the debugger to the session.
Set "RUN AND DEBUG" configuration in VSCode Debug panel then start a debug session with 'F5'.

Configurations:

- `Cucumber InMemory @only`: Debug with in-memory data persistence
- `Cucumber Sqlite3 @only`: Debug with Sqlite3 data persistence

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

## For code quality, you can use some tools : which one and why (in a few words) ?

- Use a linter (ESLint) to define rules regarding code style (indentation, semi-colons, brackets...) and code security (eslint-plugin-security)
- Use a code formatter (Prettier) linked to the linter to auto-format code on save (integrated in the IDE)
- Use SAST tools (Sonar, GitLab CI, GitHub actions, Snyk Code) to analyze code
- Use tools to detect vulnerabilities on dependencies (Snyk Open Source, Sonar...)
- Use tools to detect vulnerabilities on Docker images (Snyk Container, Sonar...)
- Use code coverage tools (nyc), especially focused on the domain layer
- Work in a Docker container to have a unique environment, this container is ideally the same used by the CI

Shift left: make available most of those tools in dev environment so that anyone can run them, and use them automatically in the CI/CD to detect issues fast.

## You can consider to setup a ci/cd process : describe the necessary actions in a few words

CI: Use a dedicated tool (Jenkins, GitHub Actions, GitLab CI). Implement steps in a Docker container:

- Execute linter
- Run white-box tests (unit, integration...) with code coverage
- Vulnerability analyzis (SAST, dependencies, dockerfiles, linter, secrets detection...)
- Build and package the application in a Docker image then sign it (security)
- Run black-box tests (system, acceptance, stress, fuzzing...) against the Docker image, if needed, use docker-compose to test the application with external components (remote database...)
- Publish & tag the image in a Docker registry (Harbor)
- Security: daily builds, add DAST strategies...

Maximize parallelization to have the fastest feedback on the build.

CD: Based on my experience, I'll will cover a Kubernetes deployment in a cluster managed with OpenShift/OpenStack

- Track changes on the Docker registry (Harbor/pulling) with a dedicated tool to trigger automatic deployment (ArgoCD)
- Write manifests (infratructure as code) to setup the pods, services, deployments, HA strategies...
- Use tools to detect vulnerabilities on these manifests (Snyk Infrastructure as Code...)
- Routing (& security): use Istio to configure routing and set mTLS (zero trust) using side-cars between internal microservices
- Monitor routing: use Kiali to monitor the traffic inside the Kubernetes cluster
- Setup observability based on logs/metrics: Prometheus, Greylog, Grafana
- Setup alerting based on logs/metrics: Prometheus Alert Manager, PagerDuty, StatusPage, Company messaging system (Emails/Phone/Slack/Mattermost/Discord...)

# Some possible improvements...

- Clean Code in Sqlite3 layer (sorry for that, I was running out of time...)
- Add validation methods on Entities, ValueObjects (right now every domain objects lacks basic validations (no empty values, realistic location...))
- Create dedicated Value Objects for Latitude, Longitude and Altitude (with their own validation rules)
- Add unit tests to check 'small' validation rules (keep BDD/Cucumber for nominal cases)
- Add unit tests to validate everything in the 'Domain layer' that is not covered by BDD/Cucumber tests
- Protect objects' internal data from external access: make public members that are 'Array' private then make getters that return a copy of the array (Fleet, Vehicle...)
- Implement a 'deepCopy' function (using new 'structuredClone' method ?)
- Implement a better deep equal method (npm deep-equal ?)
- Make Commands atomic to avoid data inconsistency: implement transactions / units of work
- Implement typed errors (DomainError, then a error class for each business rule...)
- Add pagination on Queries that may return a lot of data (arrays...)
- Implement Domain Events for even more isolation and DDD capabilities
- Implement CommandBus & QueryBus for more abstraction & capabilities
- Separate databases if needed: Commands store data in a SQL database (Postgresql...), replicate data in a NoSQL database (MongoDB...) for faster access
- Implement Event Sourcing...
