import { NgModule } from '@angular/core';
import { MyCommonModule } from '@app/common';
import { DynComponent } from './dyn.component';
import { DynComponent2 } from './dyn.component2';
import { DynService } from './dyn.service';


@NgModule({
  declarations: [
    DynComponent,
    DynComponent2
  ],
  imports: [
    MyCommonModule
  ],
  exports: [DynComponent],
  providers: [DynService]
})
export class DynModule { }

//Necessary to find the component dynamically
export { DynComponent, DynComponent2 };

