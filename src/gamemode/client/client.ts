import { OnServer } from '@core/client'
import { inject, singleton } from 'tsyringe'
import { MyService } from './service'

@singleton()
export class Client {
    constructor(
        @inject(MyService) private readonly myService: MyService
    ) {
        console.log('client constructor call')
    }
    @OnServer('clientInit')
    public clientInitResponse(data: string) {
        console.log('client init response with data: ', data)
        this.myService.myMethod()
        // loadRmlFont('/client/arial.ttf', 'arial')
        // const rml = new RmlDocument('/client/file.rml')
        // rml.show()
    }
}
