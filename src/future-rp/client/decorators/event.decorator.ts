import { IClientEvent, on, onServer } from 'alt-client'
import { container } from 'tsyringe'

function On<K extends keyof IClientEvent, S extends string>(eventName: K | S) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        on(eventName as string, (...args: any[]) => {
            const resolveTarget = container.resolve(target.constructor)
            descriptor.value.apply(resolveTarget, args)
        })
        return registerDescriptor(descriptor)
    }
}
function OnServer(eventName: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        onServer(eventName as string, (...args: any[]) => {
            console.log('receive trigger in event: ',eventName, ' args: ', args)
            const resolveTarget = container.resolve(target.constructor)
            descriptor.value.apply(resolveTarget, args)
        })
        return registerDescriptor(descriptor)
    }
}
function registerDescriptor(descriptor: PropertyDescriptor): PropertyDescriptor {
    const original = descriptor.value
    descriptor.value = function (...args: any[]) {
        console.log('event callled', args)
        original.apply(this, args)
    }
    return descriptor
}
export { On, OnServer }
