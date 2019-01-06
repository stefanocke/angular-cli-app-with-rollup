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
  entryComponents: [DynComponent],
  providers: []
})
export class DynModule { }
