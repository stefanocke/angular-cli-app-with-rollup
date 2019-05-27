import { Component, ɵNgModuleFactory as NgModuleFactory, Injector, NgModule, ViewChild, ViewContainerRef } from '@angular/core';

declare var System: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-cli-app-with-rollup';

  @ViewChild('placeholder', { read: ViewContainerRef, static: true })
  container: ViewContainerRef;

  constructor(private injector: Injector) {
    System.import("/dyn.js").then(m => { 
      const moduleType = m['DynModule'];
      const moduleFactory = new NgModuleFactory(moduleType);
      const moduleRef = moduleFactory.create(injector);

      //By type:
      //let componentType = m['DynComponent'];
      //By selector:
      let componentType = this.findComponent(m, 'dyn'); 
      let componentFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(componentType);
      this.container.createComponent(componentFactory, 0, moduleRef.injector); 
    });
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
    return Object.values(esModule).find((t: any) => t.ngComponentDef && t.ngComponentDef.selectors[0][0] === componentSelector);
  }

}
