import { LOGIN_EVENT } from '@auth/shared/events'
import { OnServer } from '@future-rp/core-client'
import { singleton } from 'tsyringe'

@singleton()
export class LoginController {
    @OnServer(LOGIN_EVENT.SHOW_UI)
    public showLoginUI() {
        console.log('showLoginUI')
    }
}
