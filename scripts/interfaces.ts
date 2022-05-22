export interface Resource {
    name: string
    srcPath: string
    buildPath: string
    entryServer: string
    entryClient: string
    config: ResourceConfig
}

export interface ResourceConfig {
    name: string
    deps: string[]
}
