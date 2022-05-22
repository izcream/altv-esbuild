import ResourceBuilder from './builder'

function buildResource() {
    const builder  = new ResourceBuilder()
    builder.analyze()
    builder.build()
}

buildResource()
