import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.css']
})
export class PolicyComponent implements OnInit {

  selectedStack = '';
  policiesField: any = {};
  constructor() { }

  ngOnInit() {
    this.policiesField.stack = '';
    this.policiesField.resource = 'performance-btn';
    this.policiesField.upgrade = 'true';
    this.policiesField.dashboard = '';
    this.policiesField.alerting = 'false';
    this.policiesField.ha = 'true';
    this.policiesField.storageSize = '';
    this.policiesField.imageRegistry = '';
    this.policiesField.frequency = '';
    this.policiesField.externalDb = 'true';
    this.policiesField.storage = '';
  }

  onSubmit() {
    console.log('policiesField', this.policiesField, this.selectedStack);
  }

}
