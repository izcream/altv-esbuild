import '@abraham/reflection'
import { emitClient, Player } from 'alt-server'
import { On, OnClient } from '@core/server'

class ServerClass {
    @On('playerConnect')
    public handlePlayerConnect(player: Player) {
        console.log(`player ${player.name} connected`)
    }
    
    @OnClient('clientInit')
    public handlePlayerConnectClient(player: Player) {
        console.log(`receive client events: clientInit: `, player.name)
        emitClient(player, 'clientInit', 'hello client')
    }
}
new ServerClass()
