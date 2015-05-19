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
import encryption.DataResponse
import encryption.DataSign
import java.util.Date

object Application extends Controller {
  val logger = LoggerFactory.getLogger(this.getClass)
  implicit val context = play.api.libs.concurrent.Execution.Implicits.defaultContext

  def index = LoggedInOrRedirectAction { user =>
    implicit request =>
      val sessionId = request.session.get("sessionId").get
      val returnUrl= request.session.get("returnUrl").get
      Ok(views.html.index(true, user.name, getELMOSigned(sessionId), sessionId, returnUrl))
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

  def getELMOSigned(sessionId:String):String = {
      val xmlString = getELMOData
      val cert = getCert()
      val key = getKey()
      val dataResp = new DataResponse(sessionId, cert, key, xmlString, new Date())
      val sign = new DataSign
      val signedString = sign.getSignedElmo(dataResp)
      logger.info("sign(): " + signedString);
      logger.info("verifySignature(): " + sign.verifySignature(dataResp.certificate, signedString));

      signedString
  } 

  def getELMOData:String =  {
    val url = WS.url("https://jboss-test.uio.no/fsrest/rest/elm/report2/2529290201")
    val requestHolder = url.withHeaders("Authorization"->"Basic a3VuX2Zvcl90ZXN0OnRlc3QxMjM0")
    val futureString = requestHolder.get() map {response => response.body}
    Await.result(futureString, 5 second)
  }
  
  /*
  def getELMOFromFile:String =  {
     getFile(getConfVal("sign.fileLocation"))
  }
  
  */
    
    

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

  def getCert() = {
     getFile(getConfVal("sign.certLocation"))
     
  }
  def getKey() = {
     getFile(getConfVal("sign.keyLocation"))
    
  }
  
  private def getConfVal(key: String): String = {
    Play.current.configuration.getString(key)  match {
      case Some(v) => v
      case None => throw new Exception("Missing configuration key: " + key)
    }
  }
  private def getFile(filename: String): String = {
    val file = Play.getFile(filename)
    val source = scala.io.Source.fromFile(file,"UTF-8")
    val lines = try source.mkString finally source.close()
    lines
  }

}