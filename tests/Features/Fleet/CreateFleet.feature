Feature: Create a fleet

    In order to follow many vehicles with my application
    As an application user
    I should be able to create my fleet

    @critical
    Scenario: I can create my fleet
        Given my user identifier
        When I create my fleet
        Then I should be able to identify my fleet

    Scenario: I can't create my fleet twice
        Given my user identifier
        And I have created my fleet
        When I try to create my fleet
        Then I should be informed that my fleet is already created
    