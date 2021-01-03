import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService, public auth: AngularFireAuth) { }

  ngOnInit(): void {
    this.spinner.show("mainSpin");
  }

  ngAfterViewInit(): void {
    this.spinner.show("mainSpin");

  setTimeout(() => {
    this.spinner.hide("mainSpin");
  }, 2500);

  }

}
