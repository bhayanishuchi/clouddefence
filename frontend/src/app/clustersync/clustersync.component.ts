import {Component, OnInit} from '@angular/core';
import {MainService} from '../main.service';
import {HttpClient} from "@angular/common/http";
import {UserService} from "../service/socket.service";
import {Socket} from "ngx-socket-io";

@Component({
  selector: 'app-clustersync',
  templateUrl: './clustersync.component.html',
  styleUrls: ['./clustersync.component.css']
})
export class ClustersyncComponent implements OnInit {
  clusterlist: any = [];
  selectedCluster;
  clusterData: any = {};
  display = 'none';
  viewDisplay = 'none';
  selectedStack = '';

  constructor(private mainservice: MainService,
              private http: HttpClient,
              private socket: Socket,
              private userService: UserService) {

  }

  ngOnInit() {
    const that = this;
    this.userService.cluster(this.socket, function (data) {
      console.log('socket cluster', data);
      data.forEach((x)=>{
        x.checked = false;
      })
      that.clusterlist = data;
    });
    this.getAllCluster();
  }

  getAllCluster() {
    this.mainservice.getCluster()
      .subscribe(response => {
        response.forEach((x)=>{
          x.checked = false;
        });
        this.clusterlist = response;
    });
  }

  openModal() {
    let length = Object.keys(this.clusterData).length;
    if (length > 0) {
      this.display = 'block';
    } else {
      alert('Please select any one cluster');
      this.display = 'none';

    }
  }

  openView() {
    let length = Object.keys(this.clusterData).length;
    if (length > 0) {
      this.viewDisplay = 'block';
    } else {
      alert('Please select any one cluster');
      this.viewDisplay = 'none';

    }
  }

  onCloseHandled() {
    this.display = 'none';
    this.mainservice.updateStack(this.clusterData.cluster_name, this.selectedStack).subscribe((res) => {
      console.log('stackrespone', res);
    });
  }

  closeView() {
    this.viewDisplay = 'none';

  }

  onClusterChange(data,index) {
    console.log('stackrespone', data);
    this.clusterlist.forEach((x,i)=>{
      if(index !== i){
        console.log('in if', index, i);
        x.checked = false;
      }
    });
    this.clusterData = data;
  }

  onStackChange(event) {
    this.selectedStack = event.target.value;
  }
  getUnsecuredCluster() {
    this.mainservice.getUnsecCluster()
      .subscribe(response => {
        response.forEach((x)=>{
          x.checked = false;
        });
        this.clusterlist = response;
      });
  }

}
