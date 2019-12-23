import { Component } from '@angular/core';
import { DynService } from './dyn.service';

@Component({
  selector: 'dyn',
  templateUrl: './dyn.component.html',
  styleUrls: ['./dyn.component.css']
})
export class DynComponent {
  constructor(public dynService: DynService) {

  }
}
