# ncp-mockup (a scala play application)
A mockup of an NCP, can be used to test clients

install sbt first

To start the server:
sbt run


Documentation of how an NCP should work is here
https://confluence.csc.fi/display/EMREX/Implementation+details%3A+NCP

This application can be used to test the EMREX client.
There is an elmo_example.xml in conf that simulates a result from a result service.
The information that is typed in the simulated login is used to change the contents of the elmo xml
before it is signed and sent back to the client.
