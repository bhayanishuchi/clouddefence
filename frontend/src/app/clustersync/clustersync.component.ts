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
  clusterDisplay = 'none';
  selectedStack = '';
  btncolor = false;
  text = 'The finance ministry has extended the deadline for filing income tax return (ITR) for FY2018-19 by individuals to August 31, 2019 from July 31, 2019. The extension is a much needed relief as there were multiple problems being faced by individuals in filing ITR by July 31Last month, the income tax department had extended the deadline for filing income tax return to August 31. According to the fake order circulating on social media, the income tax filing deadline has been extended to 30th September.Last month, the income tax department had extended the deadline for filing income tax return to August 31. According to the fake order circulating on social media, the income tax filing deadline has been extended to 30th September.Last month, the income tax department had extended the deadline for filing income tax return to August 31. According to the fake order circulating on social media, the income tax filing deadline has been extended to 30th September.Last month, the income tax department had extended the deadline for filing income tax return to August 31. According to the fake order circulating on social media, the income tax filing deadline has been extended to 30th September.Last month, the income tax department had extended the deadline for filing income tax return to August 31. According to the fake order circulating on social media, the income tax filing deadline has been extended to 30th September.';

  constructor(private mainservice: MainService,
              private http: HttpClient,
              private socket: Socket,
              private userService: UserService) {

  }

  ngOnInit() {
    const that = this;
    this.userService.cluster(this.socket, function (data) {
      console.log('socket cluster', data);
      data.forEach((x) => {
        x.checked = false;
      })
      that.clusterlist = data;
    });
    this.getAllCluster();
  }

  getAllCluster() {
    this.mainservice.getCluster()
      .subscribe(response => {
        response.forEach((x) => {
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
    let stack_name = {"stack_name": this.selectedStack};
    console.log('stack', stack_name);
    this.mainservice.updateStack(this.clusterData.cnox_engine_url, this.clusterData.cluster_name, stack_name).subscribe((res) => {
      console.log('stackrespone', res);
      if (this.clusterData.cnox_stack === "unsecured") {
        alert(this.clusterData.cluster_name + " is secured.");
      }
    });
  }

  closeView() {
    this.viewDisplay = 'none';

  }

  onClusterChange(data, index) {
    console.log('clusterData', data)
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
        response.forEach((x) => {
          x.checked = false;
        });
        this.clusterlist = response;
      });
  }

  deleteStack() {
    this.mainservice.deleteStack(this.clusterData.cluster_name)
      .subscribe((res) => {
        this.getAllCluster();
        console.log('res', res);
      });
  }

  openClusterModal() {
    this.clusterDisplay = 'block';
  }

  onCloseCluster() {
    this.clusterDisplay = 'none';
  }

  copyText(val: string) {
    console.log('text', val)
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}
