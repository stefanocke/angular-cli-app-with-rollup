import { NgModule } from '@angular/core';
import { MyCommonModule } from '@app/common';
import { DynCommonModule } from '../dyn-common/dyn-common.module';
import { DynComponent } from './dyn.component';
import { DynComponent2 } from './dyn.component2';
import { DynService } from './dyn.service';


@NgModule({
  declarations: [
    DynComponent,
    DynComponent2
  ],
  imports: [
    MyCommonModule, DynCommonModule
  ],
  exports: [DynComponent],
  providers: [DynService]
})
export class DynModule { }

//Necessary to find the component dynamically
export { DynComponent, DynComponent2 };

