import glslify from 'snowpack-plugin-glslify'

export default {
    mount:
    {
        "sources": {url: '/'},
        "static": {url: '/static', static: true, resolve: false}
    },
    plugins:
    [
        'snowpack-plugin-glslify'
    ],
    packageOptions:
    {
        
    },
    devOptions:
    {
        port: 8083
    },
    buildOptions:
    {
        
    },
};
