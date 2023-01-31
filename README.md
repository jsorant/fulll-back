# DDD questions

- Should Vehicle be an entity ?
- Should Vehicle be isolated in a bounded context ?

# Improvements

- Implement a better deep equal method (npm deep-equal ?)
- Implement a generic clone method
- CI/CD
- Add capabilities on Entity, ValueObject and RootAggregate (validate(), unique...)
- Make Entity, ValueObject and RootAggregate "snapshotable" (using an interface, force implementation of method "serialize" & force add a static builder from a snapshot) => Split behavior and data on DDD objects and use interfaces to ease persistance & evolutions (OCP)
- Typed errors
- CommandBus & QueryBus to decouple handlers from controllers and/or allow future implementation of event sourcing
- Separate db if needed
