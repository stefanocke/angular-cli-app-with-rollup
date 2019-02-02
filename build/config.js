//import stripJsonComments from 'strip-json-comments';
import { readFileSync } from 'fs';

export const buildConfig = JSON.parse(readFileSync('build.json'));
