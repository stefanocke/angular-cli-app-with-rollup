import { Component, ɵNgModuleFactory as NgModuleFactory, Injector, NgModule, ViewChild, ViewContainerRef } from '@angular/core';

declare var System: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-cli-app-with-rollup';

  @ViewChild('placeholder', { read: ViewContainerRef })
  container: ViewContainerRef;

  constructor(private injector: Injector) {
    System.import("/dyn.js").then(m => { 
      const moduleType = m['DynModule'];
      const moduleFactory = new NgModuleFactory(moduleType);
      const moduleRef = moduleFactory.create(injector);
      //Requires additional export statement for DynComponent.
      //Does not work by selector.
      //let componentType = m['DynComponent'];
      let componentType = this.findComponentInModule(moduleType, 'dyn'); 
      let componentFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(componentType);
      this.container.createComponent(componentFactory, 0, moduleRef.injector); 
    });
  }

  /**
   * This uses the internal APIs ngComponentDef and ngModuleDef and may break!
   */
  private findComponentInModule(moduleType: any, componentSelector: string): any {
    return this.findComponent(moduleType.ngModuleDef.exports, componentSelector);
  }

  private findComponent(componentTypes: any[], componentSelector: string): any {
    return componentTypes.find((c: any) => c.ngComponentDef.selectors[0][0] === componentSelector);
  }

}
