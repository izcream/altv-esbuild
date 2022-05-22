import { config } from 'dotenv'
import fg from 'fast-glob'
import fs from 'fs-extra'
import { build } from 'esbuild'
import { Resource } from './interfaces'
config()
const SRC_PATH = process.env.SRC_PATH
const BUILD_PATH = process.env.BUILD_PATH

class ResourceBuilder {
    private resources: Resource[]
    public analyze() {
        const files = fg.sync(['src/**/*/resource.json'])
        this.resources = files.map((file) => this.prepareResource(file))
    }
    public async build() {
        await this.cleanDist()
        this.resources.forEach((resource) => {
            Promise.all([this.buildServer(resource), this.buildClient(resource)])
            this.createResourceConfig(resource)
            this.copyAssets(resource)
        })
    }
    private createResourceConfig(resource: Resource) {
        let deps: string
        if (resource.config.deps !== undefined) {
            if (resource.config.deps.length > 0) {
                deps = '[\n'+resource.config.deps.map(d => `\t${d}`).join(',\n')+'\n]'
            }
            else {
                deps = '[]'
            }
        }
        const configContent = `type: "js",\nmain: server.js,\nclient-main: client.js,\nclient-files: [\n\tclient/*\n],\ndeps: ${deps}\n`
        if (!fs.existsSync(`${resource.buildPath}/resource.cfg`)) {
            fs.createFileSync(`${resource.buildPath}/resource.cfg`)
        }
        fs.writeFileSync(`${resource.buildPath}/resource.cfg`, configContent, {
            encoding: 'utf8',
        })
    }
    private copyAssets(resource: Resource) {
        if (fs.existsSync(`${resource.srcPath}/assets`)) {
            fs.copySync(`${resource.srcPath}/assets`, `${resource.buildPath}/client/`)
        }
    }
    private buildServer(resource: Resource) {
        return build({
            entryPoints: [`${resource.srcPath}/server/index.ts`],
            outfile: `${resource.buildPath}/server.js`,
            target: 'esnext',
            format: 'esm',
            bundle: true,
            external: ['alt-server', 'alt-shared']
        })
    }
    private buildClient(resource: Resource) {
        return build({
            entryPoints: [`${resource.srcPath}/client/index.ts`],
            outfile: `${resource.buildPath}/client.js`,
            target: 'esnext',
            format: 'esm',
            bundle: true,
            external: ['alt-client', 'natives', 'alt-shared', 'alt-webview']
        })
    }
    private prepareResource(resourceJsonFile: string): Resource {
        const config = fs.readJSONSync(resourceJsonFile)
        return {
            config,
            name: config.name,
            srcPath: `${SRC_PATH}/${config.name}`,
            buildPath: `${BUILD_PATH}/${config.name}`,
            entryClient: `${SRC_PATH}/${config.name}/client/index.ts`,
            entryServer: `${SRC_PATH}/${config.name}/server/index.ts`
        }
    }
    private cleanDist() {
        return fs.rm(BUILD_PATH, { recursive: true })
    }
}
export default ResourceBuilder
