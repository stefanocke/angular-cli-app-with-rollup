import { NgModule } from '@angular/core';

import { CommonComponent } from './common.component';

@NgModule({
  declarations: [    
    CommonComponent
  ],
  imports: [

  ],
  exports: [CommonComponent],
  //TODO: Without that, it won't be in ModuleFactory and thus not in the lib bundle either.
  //This will probably improve with Ivy, where the factories will be provided by the libs instead of being created 
  //during app build
  entryComponents: [CommonComponent],
  providers: []
})
export class MyCommonModule { }
