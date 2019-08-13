import { Component } from '@angular/core';
import { CommonService } from './common.service';

@Component({
  selector: 'my-common',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.css']
})
export class CommonComponent {
  title = 'angular-cli-app-with-rollup';

  constructor(private service: CommonService ) {

  }
}
