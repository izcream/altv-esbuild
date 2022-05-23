import { config } from 'dotenv'
import { build } from 'esbuild'
import { Resource } from './interfaces'
import fg from 'fast-glob'
import fs from 'fs-extra'
import pkg from '../package.json'

config()
const SRC_PATH = process.env.SRC_PATH
const BUILD_PATH = process.env.BUILD_PATH
const RETAIL_PATH = process.env.RETAIL_PATH

class ResourceBuilder {
    private resources: Resource[]
    public analyze() {
        const files = fg.sync(['src/**/*/resource.json'])
        this.resources = files.map((file) => this.prepareResource(file))
    }
    public async build() {
        await this.cleanDist()
        for (const resource of this.resources) {
            await this.buildServer(resource)
            await this.buildClient(resource)
            this.createResourceConfig(resource)
            this.copyAssets(resource)
        }
        this.copyRetail()
    }
    private createResourceConfig(resource: Resource) {
        let deps: string
        if (resource.config.deps !== undefined) {
            if (resource.config.deps.length > 0) {
                deps = '[\n' + resource.config.deps.map((d) => `\t${d}`).join(',\n') + '\n]'
            } else {
                deps = '[]'
            }
        }
        const configContent = `type: "js",\nmain: server.js,\nclient-main: client.js,\nclient-files: [\n\tclient/*\n],\ndeps: ${deps}\n`
        if (!fs.existsSync(`${resource.buildPath}/resource.cfg`)) {
            fs.createFileSync(`${resource.buildPath}/resource.cfg`)
        }
        fs.writeFileSync(`${resource.buildPath}/resource.cfg`, configContent, {
            encoding: 'utf8'
        })
    }
    private copyAssets(resource: Resource) {
        if (fs.existsSync(`${resource.srcPath}/assets`)) {
            fs.copySync(`${resource.srcPath}/assets`, `${resource.buildPath}/client/`)
        }
    }
    private buildServer(resource: Resource) {
        const external = [
            'alt-server',
            'alt-shared',
            ...Object.keys(pkg.dependencies),
            ...(resource.config?.external !== undefined ? resource.config.external : [])
        ]
        return build({
            entryPoints: [`${resource.srcPath}/server/index.ts`],
            outfile: `${resource.buildPath}/server.js`,
            target: 'esnext',
            format: 'esm',
            bundle: true,
            external
        })
    }
    private buildClient(resource: Resource) {
        const external = [
            'alt-client',
            'natives',
            'alt-shared',
            ...(resource.config?.external !== undefined ? resource.config.external : [])
        ]
        return build({
            entryPoints: [`${resource.srcPath}/client/index.ts`],
            outfile: `${resource.buildPath}/client.js`,
            target: 'es6',
            format: 'esm',
            bundle: true,
            external
        })
    }
    private prepareResource(resourceJsonFile: string): Resource {
        const config = fs.readJSONSync(resourceJsonFile)
        return {
            config,
            name: config.name,
            srcPath: `${SRC_PATH}/${config.name}`,
            buildPath: `${BUILD_PATH}/resources/${config.name}`,
            entryClient: `${SRC_PATH}/${config.name}/client/index.ts`,
            entryServer: `${SRC_PATH}/${config.name}/server/index.ts`
        }
    }
    private cleanDist() {
        if (!fs.existsSync(`${BUILD_PATH}/resources`)) return
        fs.readdirSync(`${BUILD_PATH}/resources`).forEach((folder) => {
            if (fs.existsSync(`${BUILD_PATH}/resources/${folder}`)) {
                fs.rmSync(`${BUILD_PATH}/resources/${folder}`, { recursive: true })
                console.log(`🗑️  removed: ${BUILD_PATH}/resources/${folder}`)
            }
        })
    }
    private copyRetail() {
        fs.copyFileSync(`${RETAIL_PATH}/server.cfg`, `${BUILD_PATH}/server.cfg`)
        fs.copyFileSync('package.json', `${BUILD_PATH}/package.json`)
        fs.readdirSync(`${RETAIL_PATH}/resources`).forEach((folder) => {
            if (!fs.pathExistsSync(`${BUILD_PATH}/resources/${folder}`)) {
                fs.mkdirSync(`${BUILD_PATH}/resources/${folder}`)
            }
        })
        fs.copy(`${RETAIL_PATH}/resources`, `${BUILD_PATH}/resources/`, { recursive: true })
    }
}
export default ResourceBuilder
