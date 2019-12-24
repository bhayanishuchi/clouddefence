import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ClusterService} from "../service/cluster.service";
import {UserService} from "../service/socket.service";
import {Socket} from "ngx-socket-io";
import {Router} from "@angular/router";

@Component({
  selector: 'app-software',
  templateUrl: './software.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./software.component.css']
})

export class SoftwareComponent implements OnInit {
  @ViewChild('myTable', {static: false}) table: any;
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
  newSrc: any = [];
  scannerUrl: any = '';
  lastScanValue: any = +new Date();
  totalSize;
  pageSize = 5;

  constructor(private clusterService: ClusterService,
              private userService: UserService,
              private router: Router,
              private socket: Socket) {
  }

  ngOnInit() {
    const socket = this.userService.newconnection();
    this.scannerUrl = localStorage.getItem('scanner_url');
    console.log('scannerUrl', this.scannerUrl);
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
        // this.scannerUrl = res.clusterData.scanner_url;
        if (res.ReportData[0].img.length > 0) {
          (res.ReportData[0].img).filter((x) => {
            this.src.push({Image: x, Vulnerability: '', Severity: ''});
          });
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
        this.clusterData = res.clusterData;
        this.customerData = res.customerData;
        if (res.ReportData[0].summary_json) {
          const jsonData = JSON.parse(res.ReportData[0].summary_json);
          console.log('jsonData.report_by_severity', jsonData.report_by_severity);
          console.log('jsonData.report_by_image', jsonData.report_by_image);
          this.ReportTotal = jsonData.severity_count;
          this.src = jsonData.report_by_image;
          this.sevData = jsonData.report_by_severity;
          this.lastScanValue = res.ReportData[0].timestamp;
          this.isSevData = true;
          this.newUpdate = true;
          this.totalSize = this.src.length;
        }
      }, (err) => {
        console.log('err', err);
      });
  }

  onScannerURL() {
    this.router.navigate([]).then(result => {
      window.open(this.scannerUrl, '_blank');
    });
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(eve) {
    console.log('toggle', eve);

  }

  toggleExpandGroup(group) {
    console.log('Toggled Expand Group!', group);
    this.table.groupHeader.toggleExpandGroup(group);
  }

}
