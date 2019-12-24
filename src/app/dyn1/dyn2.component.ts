import { Component } from '@angular/core';
import { DynService } from './dyn.service';

@Component({
  selector: 'dyn2',
  templateUrl: './dyn2.component.html'
})
export class Dyn2Component {
  constructor(public dynService: DynService) {

  }
}
