import {Component, OnInit} from '@angular/core';
import {MainService} from '../main.service';
import {HttpClient} from "@angular/common/http";

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
  selectedStack = '';

  constructor(private mainservice: MainService,
              private http: HttpClient) {

  }

  ngOnInit() {
    this.getAllCluster();
  }

  getAllCluster() {
    this.mainservice.getCluster()
      .subscribe(response => {
        this.clusterlist = response;
    });
  }

  openModal() {
    if (this.selectedCluster === undefined) {
      alert('Please select any one cluster');
      this.display = 'none';
    } else {
      this.display = 'block';
    }
  }

  onCloseHandled() {
    this.display = 'none';
    let data = {
      stack_name:  this.selectedStack
    };
    console.log('stackrespone', data, this.clusterData._id);
    // this.mainservice.updateStack(this.clusterData._id, data).subscribe((res) => {
    //   console.log('stackrespone', res);
    // });
  }

  onClusterChange(data) {
    this.clusterData = data;
  }

  onStackChange(event) {
    this.selectedStack = event.target.value;
  }
  getUnsecuredCluster() {
    this.mainservice.getUnsecCluster()
      .subscribe(response => {
        this.clusterlist = response;
      });
  }

}
