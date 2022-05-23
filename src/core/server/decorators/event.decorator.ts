import { registerDescriptor } from '@future-rp/core-shared'
import { IServerEvent, on, onClient } from 'alt-server'
import { container } from 'tsyringe'

function On<K extends keyof IServerEvent>(eventName: K): MethodDecorator
function On<K extends string>(eventName: K): MethodDecorator
function On(eventName: string) {
    return function (target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
        on(eventName as string, (...args: any[]) => {
            const resolveTarget = container.resolve(target.constructor)
            descriptor.value.apply(resolveTarget, args)
        })
        return registerDescriptor(descriptor)
    }
}
function OnClient(eventName: string) {
    return function (target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
        onClient(eventName, (...args: any[]) => {
            const resolveTarget = container.resolve(target.constructor)
            descriptor.value.apply(resolveTarget, args)
        })
    }
}

export { On, OnClient }
