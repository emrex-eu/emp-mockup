package controllers

import play.api.Play.current
import play.api._
import play.api.mvc._
import models.User
import Login.LoggedInOrRedirectAction
import org.slf4j.LoggerFactory
import play.api.libs.json.Json
import play.api.libs.json.JsValue
import play.twirl.api.Xml
import com.ning.http.client.Realm.AuthScheme
import play.api.libs.ws._
import scala.concurrent.Promise
import java.util.concurrent.TimeoutException
import scala.concurrent.Future
import scala.concurrent.Await
import scala.concurrent.duration._

object Application extends Controller {
  val logger = LoggerFactory.getLogger(this.getClass)
  implicit val context = play.api.libs.concurrent.Execution.Implicits.defaultContext

  def index = LoggedInOrRedirectAction { user =>
    implicit request =>
      val sessionId = request.session.get("sessionId").get
      val returnUrl= request.session.get("returnUrl").get
      Ok(views.html.index(true, user.name, getELMOData, sessionId, returnUrl))
  }
  
  def init = Action {
    implicit request =>
      val form = request.body.asFormUrlEncoded
      val sessionId = form.get("sessionId").headOption
      val returnUrl= form.get("returnUrl").headOption
      if (sessionId.isDefined && returnUrl.isDefined) {      
        Redirect(routes.Application.index()).withSession("sessionId" -> sessionId.get, "returnUrl" -> returnUrl.get)    
      } 
      else {
        BadRequest(views.html.error())
      }
  }

  def getELMO = LoggedInOrRedirectAction { user =>
    implicit request =>
      val xmlString = getELMOData
      Ok(xmlString)
  }
  
  def getELMOData:String =  {
    val url = WS.url("https://jboss-test.uio.no/fsrest/rest/elm/report2/2529290201")
    val requestHolder = url.withHeaders("Authorization"->"Basic a3VuX2Zvcl90ZXN0OnRlc3QxMjM0")
    val futureString = requestHolder.get() map {response => response.body}
    Await.result(futureString, 5 second)
  }
    

  def getUserFromSession(request: RequestHeader): Option[User] = {

    val uid = request.session.get("uid")
    val inst = request.session.get("inst")
    val name = request.session.get("name")
    getMaybeUser(uid,inst,name)
  }

  def getMaybeUser(uid: Option[String], inst: Option[String], name: Option[String]): Option[User] = {
    if (name.isDefined && uid.isDefined && inst.isDefined) {
      Some(User(uid.get, inst.get, name.get))
    } else {
      None
    }

  }
}