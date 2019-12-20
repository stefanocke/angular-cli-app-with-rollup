import { Component, ɵNgModuleFactory as NgModuleFactory, Injector, ViewChild, ViewContainerRef, NgModuleRef } from '@angular/core';

declare var System: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-cli-app-with-rollup';

  @ViewChild('placeholder1', { read: ViewContainerRef, static: true })
  container1: ViewContainerRef;

  @ViewChild('placeholder2', { read: ViewContainerRef, static: true })
  container2: ViewContainerRef;

  constructor(private injector: Injector) {

    // Here, des ES module is resolved by the import map.
    // For a real plugin architecture, the mapping to the full bundle name would be driven by some metadata from the backend.
    this.loadComponent('dyn', 'DynModule', 'dyn', injector)
      .then(({ componentFactory, injector }) => {
        this.container1.createComponent(componentFactory, 0, injector);
      });
    this.loadComponent('dyn', 'DynModule', 'dyn2', injector)
      .then(({ componentFactory, injector }) => {
        this.container2.createComponent(componentFactory, 0, injector);
      });
  }

  private loadComponent(esModule: string, angularModule: string, componentSelector: string, injector: Injector) {
    return this.loadAngularModule(esModule, angularModule, injector)
      .then(({ m, moduleRef }) => { return { componentFactory: this.getComponentFactory(m, componentSelector, moduleRef), injector: moduleRef.injector }; }
      );
  }

  private loadAngularModule(esModule: string, angularModule: string, injector: Injector): Promise<{m: any; moduleRef: NgModuleRef<any> }> {
    return System.import(esModule)
      .then(m => {

        const moduleRef = this.moduleRefs[esModule] || new NgModuleFactory(m[angularModule]).create(injector);
        this.moduleRefs[esModule] = moduleRef;

        return { m, moduleRef };
      });
  }

  //By reusing the moduleRefs, we also always get the same injector for the same angular module
  //Thus, there will be only one instance of DynService
  moduleRefs: { [esModule: string]: NgModuleRef<any> } = {};

  private getComponentFactory(m: any, componentSelector: string, moduleRef: NgModuleRef<any>) {
    //By type:
    //let componentType = m['DynComponent'];
    //By selector:
    let componentType = this.findComponent(m, componentSelector);
    return moduleRef.componentFactoryResolver.resolveComponentFactory(componentType);
  }

  /**
   * Finds the component by selector within the ES Module.
   * For this, the component must be exported.
   * Formerly, we iterated over NgModule-Metadata to find the component. But they are subject to tree shaking (even the entry components !?!).
   * ngModuleDef is anyway an internal API, so better to avoid it...
   *
   * This uses the internal API ngComponentDef and may break!
   * Could by avoided by using type name instead.
   */
  private findComponent(esModule: any, componentSelector: string): any {
    return Object.keys(esModule)
      .map(k => esModule[k])
      .find((t: any) => t.ɵcmp && t.ɵcmp.selectors[0][0] === componentSelector);
  }

}
