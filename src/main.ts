import { enableProdMode, ɵNgModuleFactory as NgModuleFactory } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';

import { environment } from './environments/environment';
import { AppModule } from './app/app.module';

if (environment.production) {
  enableProdMode();
}

platformBrowser().bootstrapModuleFactory(new NgModuleFactory(AppModule))
  .catch(err => console.error(err));
