import { registerDescriptor } from '@future-rp/core-shared'
import { IClientEvent, on, onServer } from 'alt-client'
import { container } from 'tsyringe'

function On<K extends keyof IClientEvent>(eventName: K): MethodDecorator
function On<K extends string>(eventName: K): MethodDecorator
function On(eventName: string) {
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
            const resolveTarget = container.resolve(target.constructor)
            descriptor.value.apply(resolveTarget, args)
        })
        return registerDescriptor(descriptor)
    }
}

export { On, OnServer }
