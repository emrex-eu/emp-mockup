package models

case class User(givenNames:String, familyName:String, birthDate:String, gender:String) {
  def name = givenNames + " " +familyName
}

