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
  clusterData: any = {};
  display = 'none';
  viewDisplay = 'none';
  selectedStack = '';
  btncolor= false;

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
      this.btncolor = true;
    } else {
      alert('Please select any one cluster');
      this.display = 'none';
      this.btncolor = false;

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
    let stack_name =  {"stack_name": this.selectedStack};
    console.log('stack',stack_name);
    this.mainservice.updateStack(this.clusterData.cluster_name, stack_name).subscribe((res) => {
      console.log('stackrespone', res);
      if(this.clusterData.cnox_stack === "unsecured") {
        alert(this.clusterData.cluster_name + " is secured.");
      }
    });
  }

  closeView() {
    this.viewDisplay = 'none';

  }

  onClusterChange(data,index) {
    this.clusterData = data;
    this.clusterlist.forEach((x, i) => {
      if (index !== i) {
        x.checked = false;
      } else if (index === i && x.checked === false) {
        this.clusterData = {};
        this.btncolor = false;
      } else {
        this.btncolor = true;
      }
    });
    console.log('stackrespone', this.clusterData);

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
