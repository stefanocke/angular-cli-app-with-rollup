import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MyCommonModule } from './common/common.module';
import { BallastModule } from './ballast/ballast.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, MyCommonModule, BallastModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 

}
