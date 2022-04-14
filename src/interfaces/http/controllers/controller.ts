import { HttpRequest } from '../contracts/http-request'
import { HttpResponse } from '../contracts/http-response'

export interface Controller {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
