package controllers

import play.api._
import play.api.mvc._
import models.User
import Login.LoggedInAction
import org.slf4j.LoggerFactory

object Application extends Controller {
  val logger = LoggerFactory.getLogger(this.getClass)

  def index = LoggedInAction { user =>
    implicit request =>
      Ok(views.html.index(true, user.name))
  }

  def getUserFromSession(request: RequestHeader):Option[User] = {
    
    val name = request.session.get("name")
    val date = request.session.get("date")
    val gender = request.session.get("gender")
    getMaybeUser(name, date, gender)
  }

  def getMaybeUser(name:Option[String], date:Option[String], gender:Option[String]):Option[User] = {
        if (name.isDefined && date.isDefined && gender.isDefined) {
      Some(User(name.get,date.get,gender.get))
    }
    else {
      None
    }

  }
}