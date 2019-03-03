import { NgModule } from '@angular/core';

import { DynComponent } from './dyn.component';
import { MyCommonModule } from '@app/common';

@NgModule({
  declarations: [
    DynComponent
  ],
  imports: [
    MyCommonModule
  ],
  exports: [DynComponent],
  entryComponents: [DynComponent],
  providers: []
})
export class DynModule { }

//export { DynComponent };
