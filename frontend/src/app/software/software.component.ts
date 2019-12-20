import {Component, OnInit} from '@angular/core';
import * as _ from "lodash";
import {ClusterService} from "../service/cluster.service";
import {UserService} from "../service/socket.service";
import {Socket} from "ngx-socket-io";

@Component({
  selector: 'app-software',
  templateUrl: './software.component.html',
  styleUrls: ['./software.component.css']
})
export class SoftwareComponent implements OnInit {

  clusterData: any = {};
  ReportTotal: any = {
    Critical: 0, High: 0, Medium: 0, Low: 0, Negligible: 0, Unknown: 0
  };
  customerData: any = {};
  sevData: any = [];
  isData: any = false;
  isSevData: any = false;
  newUpdate: any = false;
  src: any = [];
  scannerUrl: any = '';
  lastScanValue: any = +new Date();

  constructor(private clusterService: ClusterService,
              private userService: UserService,
              private socket: Socket) {
  }

  ngOnInit() {
    const socket = this.userService.newconnection();
    this.getScanImageData(localStorage.getItem('clusterName'), localStorage.getItem('customer_id'));
    this.getappComplianceData(localStorage.getItem('clusterName'), localStorage.getItem('customer_id'));
    const that = this;
    this.userService.getAppComplianceReport(socket, function (data) {
      console.log('dataaaaaaaaaaaaaaa', data);
      const jsonData = JSON.parse(data.summary_json);
      that.ReportTotal = jsonData.severity_count;
      that.src = jsonData.report_by_image;
      that.sevData = jsonData.report_by_severity;
      that.lastScanValue = data.timestamp;
      that.isSevData = true;
      that.isData = true;
      that.newUpdate = true;
    });
  }

  getScanImageData(Cluster, customer) {
    this.clusterService.getScanImageComplianceReport(Cluster, customer)
      .subscribe((res) => {
        console.log('res', res);
        console.log('this.customerData', res.clusterData);
        console.log('this.scannerUrl', res.clusterData.scanner_url);
        this.clusterData = res.clusterData;
        this.customerData = res.customerData;
        this.scannerUrl = res.clusterData.scanner_url;
        if (res.ReportData[0].img.length > 0) {
          (res.ReportData[0].img).filter((x) => {
            this.src.push({Image: x, Vulnerability: '', Severity: ''});
          })
          this.isData = true;
        }
      }, (err) => {
        console.log('err', err);
      });
  }

  getappComplianceData(Cluster, customer) {
    this.clusterService.getAppComplianceReport(Cluster, customer)
      .subscribe((res) => {
        console.log('app compliance res', res);
        console.log('app compliance this.customerData', res.clusterData);
        console.log('app compliance  this.scannerUrl', res.clusterData.scanner_url);
        if (res.ReportData[0].summary_json) {
          const jsonData = JSON.parse(res.ReportData[0].summary_json);
          this.ReportTotal = jsonData.severity_count;
          this.src = jsonData.report_by_image;
          this.sevData = jsonData.report_by_severity;
          this.lastScanValue = res.ReportData[0].timestamp;
          this.isSevData = true;
          this.newUpdate = true;
        }
      }, (err) => {
        console.log('err', err);
      });
  }

}
