package encryption

import java.util.Date

case class DataResponse(sessionId: String, certificate: String, encKey: String, data:String, timestamp:Date)