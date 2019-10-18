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
    this.policiesField.stack = 'bronze_stack';
    this.policiesField.resource = 'performance-btn';
    this.policiesField.upgrade = 'true';
    this.policiesField.dashboard = 'grafana';
    this.policiesField.alerting = 'false';
    this.policiesField.ha = 'true';
    this.policiesField.storageSize = '512Mb';
    this.policiesField.imageRegistry = 'dockerHub';
    this.policiesField.frequency = 'hourly';
    this.policiesField.externalDb = 'true';
    this.policiesField.storage = '1Gb';
  }

  onSubmit() {
    console.log('policiesField', this.policiesField, this.selectedStack);
  }

}
