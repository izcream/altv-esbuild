import { LOGIN_EVENT } from "@auth/shared/events";
import { OnClient } from "@future-rp/core-server";
import { emitClient, Player, Vector3 } from "alt-server";
import { singleton } from "tsyringe";

@singleton()
export class LoginController {
    @OnClient(LOGIN_EVENT.CONNECTED)
    public onPlayerConnected(player: Player): void {
        console.log("onPlayerConnected called: ", player.name)
        emitClient(player, LOGIN_EVENT.SHOW_UI)
        player.model = 'mp_m_freemode_01'
        player.pos = new Vector3(0, 0, 0)
        player.dimension = 0
    }
}
