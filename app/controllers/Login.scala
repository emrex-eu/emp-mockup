package controllers

import play.api.Play
import play.api.mvc._
import play.api.data.Forms._
import org.slf4j.LoggerFactory
import models.User
import play.api.data.Form


object Login extends Controller{
  val logger = LoggerFactory.getLogger(this.getClass)
  
 val loginForm = Form(
    mapping(
      "givenNames" -> text,
      "familyName" -> text,
      "birthDate" -> text,
      "gender" -> text
    )(User.apply)(User.unapply)
  )
  
  def login = Action {implicit request =>
      Ok(views.html.login(loginForm))
  }
  def loginUser = Action { implicit request =>
    
    val user = loginForm.bindFromRequest().get
    val sessionId  = request.session.get("sessionId")
    val returnUrl = request.session.get("returnUrl")

    Redirect(routes.Application.index)
            .flashing(("message" ,"Welcome!" + user.name))
            .withSession(
                "givenNames" -> user.givenNames, 
                "familyName" -> user.familyName, 
                "birthDate" -> user.birthDate,
                "gender" -> user.gender, 
                "sessionId" -> sessionId.get, 
                "returnUrl" -> returnUrl.get)

    //BadRequest(views.html.login(loginForm, getLoggedInUser(request)))     
  }
   def logout = Action {implicit request =>
      Redirect(routes.Login.login()).withNewSession
      .flashing(("msg","Det der skjønte du vel ikke kunne gå!"))
  }

  
  def LoggedInOrRedirectAction(f: => User => Request[AnyContent] => Result) = {
      Authenticated() { user =>
      Action(request => f(user)(request))
    }
  }
  
 def Authenticated[A]()
    (action: User => EssentialAction): EssentialAction = {
    
    EssentialAction { request =>
      getLoggedInUser(request).map { userInfo => 
        action(userInfo)(request)
      }.getOrElse {
        play.api.libs.iteratee.Done(redirToLogin(request), play.api.libs.iteratee.Input.Empty)
      }
    }
  }

 def getLoggedInUser(request: RequestHeader): Option[User] = {
    Application.getUserFromSession(request)
  }
 def redirToLogin(request: RequestHeader) = Results.Redirect(routes.Login.login())  

}
  