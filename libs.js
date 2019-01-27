// key is the package / module.
// value can be empty in case of a node-module.
// when bundeling from src, an entry point must be given ("index.js")
export const libs = {
    '@angular/core': {},
    '@angular/common': {},
    '@angular/platform-browser': {},
    '@angular/forms': {},
    '@angular/router': {},
    'rxjs': {},
    'rxjs/operators': {},
    'app-common': { entry: 'app/common/index.js' }
};

export const packages = Object.keys(libs);

export function input(package_) {
    return libs[package_].entry && "out-tsc/app/" + libs[package_].entry || package_;
}

//Checks if a module id belongs to a lib
export function isLib(id) {
    return packages.find(p => id === p);
}