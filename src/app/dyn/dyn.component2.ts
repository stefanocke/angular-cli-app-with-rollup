import { Component } from '@angular/core';
import { DynService } from './dyn.service';

@Component({
  selector: 'dyn2',
  templateUrl: './dyn.component2.html',
  styleUrls: ['./dyn.component2.css']
})
export class DynComponent2 {
  constructor(public dynService: DynService) {

  }
}
