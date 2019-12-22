import { NgModule } from '@angular/core';
import { MyCommonModule } from '@app/common';
import { DynCommonModule } from '../dyn-common/dyn-common.module';


@NgModule({
  declarations: [

  ],
  imports: [
    MyCommonModule, DynCommonModule
  ],
  exports: [],
  providers: []
})
export class Dyn2Module { }


