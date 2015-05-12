
name := """NCP Mockup"""

version := "1.0-SNAPSHOT"


lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.6"


libraryDependencies ++= Seq(
  "no.fsat" %% "fun" % "1.0-SNAPSHOT" ,
  "no.fsat" %% "fun" % "1.0-SNAPSHOT" classifier "assets",
  cache,
  ws
)


