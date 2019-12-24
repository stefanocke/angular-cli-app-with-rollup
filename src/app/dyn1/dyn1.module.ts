import { NgModule } from '@angular/core';
import { MyCommonModule } from '@app/common';
import { DynCommonModule } from '../dyn-common/dyn-common.module';
import { DynComponent } from './dyn.component';
import { Dyn2Component } from './dyn2.component';
import { DynService } from './dyn.service';


@NgModule({
  declarations: [
    DynComponent,
    Dyn2Component
  ],
  imports: [
    MyCommonModule, DynCommonModule
  ],
  exports: [DynComponent],
  providers: [DynService]
})
export class Dyn1Module { }

//Necessary to find the component dynamically
export { DynComponent, Dyn2Component };

