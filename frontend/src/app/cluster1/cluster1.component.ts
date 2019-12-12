import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ClusterService} from '../service/cluster.service';
import {SingleDataSet} from "ng2-charts";
import {ChartOptions, ChartType} from "chart.js";

@Component({
  selector: 'app-cluster1',
  templateUrl: './cluster1.component.html',
  styleUrls: ['./cluster1.component.css']
})
export class Cluster1Component implements OnInit {

  customerData: any = {};
  workLoadData: any = [];
  keys: any = [];
  pieChartLabels: any[] = [['Warn'], ['Error'], ['Info']];
  pieChartData: SingleDataSet = [0, 0, 0];
  pieChartType: ChartType = 'pie';
  pieChartOptions: ChartOptions = {
    responsive: true,
  };
  pieChartColors = [
    {backgroundColor: ["#d48538", "#ebebeb", "#d4af37"]},
    {borderColor: ["#d48538", "#ebebeb", "#d4af37"]}];

  constructor(private activatedRoute: ActivatedRoute,
              private clusterService: ClusterService) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((res) => {
      console.log('res', res);
      this.getworkLoadData(res.cluster_name, res.customer_id);
    });
  }

  getworkLoadData(Cluster, customer) {
    this.clusterService.getworkloadcomplianceReport(Cluster, customer)
      .subscribe((res) => {
        console.log('res', res);
        this.customerData = res.clusterDetails;
        this.workLoadData = JSON.parse(res.ReportData[0].summary_json);
        Object.keys(JSON.parse(res.ReportData[0].summary_json)).filter((x) => {
          if (x !== 'all') {
            this.keys.push(x);
          } else {
            console.log('**************', this.workLoadData[x]);
            this.pieChartData = [this.workLoadData[x].W, this.workLoadData[x].E,  this.workLoadData[x].I];
            console.log('**************', this.pieChartData );
          }
        });


      }, (err) => {
        console.log('err', err);
      });
  }

}
