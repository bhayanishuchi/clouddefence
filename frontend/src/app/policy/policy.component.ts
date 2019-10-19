import { Component, OnInit } from '@angular/core';
import {MainService} from "../main.service";

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.css']
})
export class PolicyComponent implements OnInit {

  selectedStack = '';
  policiesField: any = {};
  gpoliciesField: any = {};
  cnoxUrl = 'http://12345.us-west2.elb.amazonaws.com:8888'
  constructor(private mainservice: MainService) { }

  ngOnInit() {
    this.policiesField.stack = 'bronze_stack';
    this.gpoliciesField.security_resource = 'efficient';
    this.policiesField.upgrade = 'true';
    this.policiesField.dashboard = 'grafana';
    this.policiesField.alerting = 'false';
    this.policiesField.ha = 'true';
    this.policiesField.storageSize = '512Mb';
    this.policiesField.imageRegistry = 'dockerHub';
    this.policiesField.frequency = 'hourly';
    this.gpoliciesField.compliance_frequency = 'hourly';
    this.policiesField.externalDb = 'true';
    this.policiesField.storage = '1Gb';
  }

  onSubmit() {
    console.log('policiesField', this.policiesField, this.selectedStack);
  }

  onGeneralSubmit() {
    console.log('gpoliciesField', this.gpoliciesField);
    this.mainservice.addPolicy(this.cnoxUrl, this.gpoliciesField)
      .subscribe((res) => {
        console.log('res', res);
      }, error => {
        console.log('error', error);
      });
  }

}
