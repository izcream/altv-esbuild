import { injectable } from 'tsyringe'

@injectable()
export class MyService {
    constructor() {
        console.log('MyService constructed')
    }
    public myMethod() {
        console.log('myMethod called')
    }
}
