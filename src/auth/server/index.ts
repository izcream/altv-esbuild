import { on } from "alt-server"
import { container } from "tsyringe"
import { LoginController } from "./login.controller"

on('resourceStart', bootstrap)
function bootstrap() {
    container.resolve(LoginController)
}
