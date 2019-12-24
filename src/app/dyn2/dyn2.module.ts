import { NgModule } from '@angular/core';
import { MyCommonModule } from '@app/common';
import { DynCommonModule } from '../dyn-common/dyn-common.module';
import { Dyn3Component } from './dyn3.component';


@NgModule({
  declarations: [
    Dyn3Component
  ],
  imports: [
    MyCommonModule, DynCommonModule
  ],
  exports: [],
  providers: []
})
export class Dyn2Module { }

export { Dyn3Component };
