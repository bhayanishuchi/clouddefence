import {Component, OnInit} from '@angular/core';
import {MainService} from '../main.service';
import {UserService} from '../service/socket.service';
import {ChartType, ChartOptions} from 'chart.js';

import {Socket} from 'ngx-socket-io';
import {SingleDataSet} from "ng2-charts";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  clusterlist: any;
  logeventlist: any;
  totalCounts: any = {};
  pieChartLabels: any[] = [['Gold','Nodes:0'],['Silver','Nodes:0'],['Bronze','Nodes:0']];
  pieChartData: SingleDataSet = [0, 0, 0];
  pieChartType: ChartType = 'pie';
  pieChartOptions: ChartOptions = {
    responsive: true,
  };
  pieChartColors = [
    {backgroundColor: ["#d48538", "#ebebeb", "#d4af37"]},
    {borderColor: ["#d48538", "#ebebeb", "#d4af37"]}];

  constructor(private mainservice: MainService,
              private socket: Socket,
              private userService: UserService) {
  }

  ngOnInit() {
    const socket = this.userService.newconnection();
    const that = this;
    this.mainservice.getUnsecCluster()
      .subscribe(response => {
        this.clusterlist = response;
        console.log("resp", response);
    });
    this.mainservice.getlogevent()
      .subscribe(response => {
        this.logeventlist = response;
        console.log("respnew", this.logeventlist);
    });
    this.mainservice.getTotalResource().subscribe((res) => {
      this.totalCounts = res;
    });
    this.mainservice.getTotalList().subscribe((res) => {
      console.log('response', res);
      this.pieChartLabels = [['Gold','Nodes:'+ res.Gold.TotalNodes],['Silver','Nodes:'+ res.Silver.TotalNodes],
        ['Bronze','Nodes:'+ res.Bronze.TotalNodes]];
      this.pieChartData = [res.Gold.Totalstack, res.Silver.Totalstack, res.Bronze.Totalstack];
    });
    this.userService.logs(socket, function (data) {
      console.log('socket logs', data);
      that.logeventlist = data;
    });
    this.userService.totals(socket, function (data) {
      console.log('socket totals', data);
      that.totalCounts = data;
    });
    this.userService.list(socket, function (res) {
      console.log('socket list', res);
      that.pieChartLabels = [['Gold','Nodes:'+ res.Gold.TotalNodes],['Silver','Nodes:'+ res.Silver.TotalNodes],
        ['Bronze','Nodes:'+ res.Bronze.TotalNodes]];
      that.pieChartData = [res.Gold.Totalstack, res.Silver.Totalstack, res.Bronze.Totalstack];
    });
    this.userService.unseccluster(socket, function (data) {
      console.log('socket unseccluster', data);
      that.clusterlist = data;
    });
  }

}
