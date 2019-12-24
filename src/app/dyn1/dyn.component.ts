import { Component } from '@angular/core';
import { DynService } from './dyn.service';

@Component({
  selector: 'dyn',
  templateUrl: './dyn.component.html'
})
export class DynComponent {
  constructor(public dynService: DynService) {

  }
}
