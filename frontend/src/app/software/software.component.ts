import {Component, OnInit} from '@angular/core';
import * as _ from "lodash";
import {ClusterService} from "../service/cluster.service";

@Component({
  selector: 'app-software',
  templateUrl: './software.component.html',
  styleUrls: ['./software.component.css']
})
export class SoftwareComponent implements OnInit {

  customerData: any = {};
  isData: any = false;
  src: any = [];
  scannerUrl: any = '';

  constructor(private clusterService: ClusterService) {
  }

  ngOnInit() {
    this.getworkLoadData(localStorage.getItem('clusterName'), localStorage.getItem('customer_id'));
  }

  getworkLoadData(Cluster, customer) {
    this.clusterService.getScanImageComplianceReport(Cluster, customer)
      .subscribe((res) => {
        console.log('res', res);
        console.log('this.customerData', res.clusterDetails);
        console.log('this.scannerUrl', res.clusterDetails.scanner_url);
        this.customerData = res.clusterDetails;
        this.scannerUrl = res.clusterDetails.scanner_url;
        if (res.ReportData[0].img.length > 0) {
          this.src = res.ReportData[0].img;
          this.isData = true;
        }
      }, (err) => {
        console.log('err', err);
      });
  }

}
