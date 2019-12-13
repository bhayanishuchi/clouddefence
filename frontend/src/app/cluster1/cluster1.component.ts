import {Component, OnInit} from '@angular/core';
import {ClusterService} from '../service/cluster.service';
import {SingleDataSet} from "ng2-charts";
import {ChartOptions, ChartType} from "chart.js";
import * as _ from 'lodash';

@Component({
  selector: 'app-cluster1',
  templateUrl: './cluster1.component.html',
  styleUrls: ['./cluster1.component.css']
})
export class Cluster1Component implements OnInit {

  customerData: any = {};
  workLoadData: any = [];
  keys: any = [];
  pieChartLabels: any[] = [['Info'], ['Warn'], ['Error']];
  pieChartData: SingleDataSet = [0, 0, 0, 0, 0];
  pieChartType: ChartType = 'pie';
  pieChartOptions: ChartOptions = {
    responsive: true,
  };
  pieChartColors = [
    {backgroundColor: ["#d4ae37", "#d48538", "#e62335"]},
    {borderColor: ["#d4ae37", "#d48538", "#e62335"]}];

  constructor(private clusterService: ClusterService) {
  }

  ngOnInit() {
    this.getworkLoadData(localStorage.getItem('clusterName'), localStorage.getItem('customer_id'));
  }

  getworkLoadData(Cluster, customer) {
    this.clusterService.getworkloadcomplianceReport(Cluster, customer)
      .subscribe((res) => {
        console.log('res', res);
        this.customerData = res.clusterDetails;
        this.workLoadData = JSON.parse(res.ReportData[0].summary_json);
        console.log('workLoadData', this.workLoadData);
        console.log(_.sortBy(Object.values(this.workLoadData), ['E']).reverse());
        // var result = _([this.workLoadData])
        //   .map(function(v, k) { // insert the key into the object
        //     return _.merge({}, v, { key: k });
        //   })
        //   .sortBy('E') // sort by name
        //   .value();
        // console.log('result', result);
        // console.log([this.workLoadData].sort(this.compareValues('E', 'asc')));
        // this.workLoadData = _.sortBy(Object.values(this.workLoadData), ['E']).reverse();
        // console.log(_.sortBy(this.workLoadData, (['E'])));
        Object.keys(JSON.parse(res.ReportData[0].summary_json)).filter((x) => {
          if (x !== 'all') {
            this.keys.push(x);
          } else {
            console.log('**************', this.workLoadData[x]);
            this.pieChartData = [this.workLoadData[x].I, this.workLoadData[x].W, this.workLoadData[x].E];
            console.log('**************', this.pieChartData);
          }
        });
      }, (err) => {
        console.log('err', err);
      });
  }

  compareValues(key, order = 'asc') {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }

      const varA = (typeof a[key] === 'string')
        ? a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string')
        ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  }

  getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }
}
