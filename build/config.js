//import stripJsonComments from 'strip-json-comments';
import { readFileSync } from 'fs';

const filename = 'build.json';

const buildConfigOrg = JSON.parse(readFileSync(filename));

if(!process.env.BUILD) {
    throw new Error('process.env.BUILD has to be set');
}

if(!buildConfigOrg.env) {
    throw new Error('env is missing in ' + filename);
}

//env-specific configuration
const buildConfigEnv = buildConfigOrg.env[process.env.BUILD] || {};

export const buildConfig = Object.assign({}, buildConfigOrg, buildConfigEnv);

console.dir(buildConfig);




