import '@abraham/reflection'
import { emitServer, on } from 'alt-client'
import { container } from 'tsyringe'
import { Client } from './client'


on('connectionComplete', () => {
    console.log('client connectionComplete')
    container.resolve(Client)
    emitServer('clientInit')
})
