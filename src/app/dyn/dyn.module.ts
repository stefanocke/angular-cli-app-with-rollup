import { NgModule } from '@angular/core';

import { DynComponent } from './dyn.component';
import { MyCommonModule } from '../common/common.module';

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
