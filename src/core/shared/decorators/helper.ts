
export function registerDescriptor(descriptor: PropertyDescriptor): PropertyDescriptor {
    const original = descriptor.value
    descriptor.value = function (...args: any[]) {
        original.apply(this, args)
    }
    return descriptor
}
