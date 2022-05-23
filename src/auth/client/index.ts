import { LOGIN_EVENT } from '@auth/shared/events'
import { emitServer, on } from 'alt-client'
import { container } from 'tsyringe'
import { LoginController } from './login.controller'

on('connectionComplete', bootstrap)

function bootstrap() {
    container.resolve(LoginController)
    emitServer(LOGIN_EVENT.CONNECTED)
}
