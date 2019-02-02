// the existing rollup-browser-sync plugin does not work with multiple rollup-configs (it calls init twice)
// furthermore it uses "bundle.dest" which seems not to exist (anymore) in rollup's generateBundle hook
import bs from 'browser-sync';

var bsInstance;

export function browsersync(options) {

    if (!bsInstance) {
        bsInstance = bs.create('rollup')
        console.log("Init Browser-Sync "+ JSON.stringify(options))
        bsInstance.init(options || {server: '.'});
    }

    return {
        name: 'browsersync',
        generateBundle: function({}, bundle, isWrite) {
            if (isWrite) {
                console.log("Browser-Sync reload for " + Object.keys(bundle))
                bsInstance.reload(Object.keys(bundle));
            }
        }
    };
    
};