EMP Mockup (a scala play application)
=====================================

A mockup of an EMP which can be used to test clients

Before starting make sure [sbt](https://www.scala-sbt.org/) is installed

To start the server:
```
sbt run
```


Documentation of how an EMP should work is [here](https://github.com/emrex-eu/standard).

This application can be used to test the EMREX Client.
There is an elmo_example.xml in conf file that simulates a result from a result service.
The information that is typed in the simulated login is used to change the contents of the elmo xml before it is signed and sent back to the client.
