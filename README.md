# AngularCliAppWithRollup

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.1.4.

## Rollup Build

In progress / experimental!

Shows a plugin architecture where an application (main.js) can load dynamically Angular modules and components (from dyn.js) an both share common libs (third party like Angular and common application code like app-common.js). The dynamic modules (dyn.js) would be typically in seperate project but are for simplicity included here.
Both, the main application and the dynamic module are build with rollup. The libs are defined to be externals for the application and the dynamic module and are also bundled with rollup. For loading the bundles / modules, SystemJS 2.x is used.

### Development Server

Run `npm run rollup-dev` for a dev-server on `http://localhost:5000/`.
Ngc (Angular AOT Compiler) and rollup will both run in watch mode.

### Production Build

Run `npm run rollup-prod`. Directory `dist-rollup` will contain the build result.

## Webpack Build

Not maintained here.
