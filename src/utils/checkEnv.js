export function isRunBuild() {
    return process.env.HOST === 'prod' ? process.env.HOST : false;
}

export function isRunTestBuild() {
    return process.env.HOST === 'test' ? process.env.HOST : false;
}

export function isRunDev() {
    return process.env.HOST === 'dev' ? process.env.HOST : false;
}
export function isRunBuildOsType() {
    return Number(process.env.HOST) ? Number(process.env.HOST) : false;
}