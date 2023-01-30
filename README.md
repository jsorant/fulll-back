# Improvements

- CI/CD
- Add capabilities on Entity, ValueObject and RootAggregate (equals(), unique...)
- Make Entity, ValueObject and RootAggregate "snapshotable" (using an interface, force implementation of method "serialize" & force add a static builder from a snapshot) => Split behavior and data on DDD objects and use interfaces to ease persistance & evolutions (OCP)
- Typed errors
- CommandBus & QueryBus to decouple handlers from controllers and/or allow future implementation of event sourcing
- Separate db if needed
