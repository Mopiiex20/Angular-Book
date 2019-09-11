import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-NotWorkingComponent',
  templateUrl: './NotWorkingComponent.component.html'
})
export class NotWorkingComponent implements OnInit {
  myParam: any;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => this.myParam = params['caller']);
  }
}
