import { IServerEvent, on, onClient } from 'alt-server'
import { container } from 'tsyringe'

function On<K extends keyof IServerEvent, S extends string>(eventName: K | S) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        on(eventName as string, (...args: any[]) => {
            const resolveTarget = container.resolve(target.constructor)
            descriptor.value.apply(resolveTarget, args)
        })
        return registerDescriptor(descriptor)
    }
}
function OnClient(eventName: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        onClient(eventName, (...args: any[]) => {
            const resolveTarget = container.resolve(target.constructor)
            descriptor.value.apply(resolveTarget, args)
        })
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

export { On, OnClient }
