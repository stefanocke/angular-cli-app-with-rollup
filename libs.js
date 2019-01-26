// key is entry point for the lib
// value is array of packages provided by the lib 
export const libs = {
    '@angular/core': {},
    '@angular/common': {},
    '@angular/platform-browser': {},
    'rxjs': {},
    'rxjs/operators': {},
    'app-common': { entry: 'app/libs/app-common.js' }
};

export const packages = Object.keys(libs);

export function input(package_) {
    return libs[package_].entry && "out-tsc/" + libs[package_].entry || package_;
}

//Checks if a module id belongs to a lib
export function isLib(id) {
    return packages.find(p => id === p);
}