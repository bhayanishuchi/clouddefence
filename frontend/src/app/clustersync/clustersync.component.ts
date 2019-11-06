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

  fileContent = '';
  showProgress = false;

  constructor(private mainservice: MainService,
              private http: HttpClient,
              private socket: Socket,
              private userService: UserService) {

  }

  ngOnInit() {
    const socket = this.userService.newconnection();
    this.http.get('assets/file/deploy-cnox', {responseType: 'text'})
      .subscribe(data => {
        this.fileContent = data;
      });

    const that = this;
    this.userService.cluster(this.socket, function (data) {
      console.log('socket cluster', data);
      data.forEach((x) => {
        x.checked = false;
      })
      that.clusterlist = data;
    });
    this.getAllCluster();
    console.log("All cluster",this.getAllCluster());

    this.userService.updateCLuster(socket, function (data) {
      console.log('update-cluster', data);
      // that.clusterlist[0].cluster_name= "pooja"
      console.log("sdas",that.clusterlist);
      that.clusterlist.filter((x) => {
        if (x.cluster_name === data.cluster_name) {
          x.showProgress = true;
          console.log("numbere", x.barWidth);
          if(x.barWidth) {
            if((x.barWidth + data.percentage) <101) {
              x.barWidth += data.percentage;
            }
          }else{
            x.barWidth = data.percentage;
          }
        }
      });
    });
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

  onStackUpdate() {
    this.display = 'none';
    let stack_name = {"stack_name": this.selectedStack};
    console.log('stack', stack_name);
    this.mainservice.updateStack(this.clusterData.cnox_engine_url, this.clusterData.cluster_name, stack_name).subscribe((res) => {
      console.log('stackrespone', res);
      this.showProgress = true;
      // this.clusterlist.filter((x) => {
      //   if (x.cluster_name === this.clusterData.cluster_name) {
      //     x.showProgress = true;
      //     x.barWidth = 20;
      //   }
      // });
      if (this.clusterData.cnox_stack === "unsecured") {
        // alert(this.clusterData.cluster_name + " is secured.");
      }
    }, error => {
      /*this.clusterlist.filter((x) => {
        if (x.cluster_name === this.clusterData.cluster_name) {
          x.showProgress = true;
          x.barWidth = 20;
        }
      });*/
    });
  }

  closeView() {
    this.viewDisplay = 'none';
    this.display = 'none';

  }

  onClusterChange(data, index) {
    console.log('clusterData', data)
    this.clusterData = data;
    if (this.clusterData.cnox_stack !== "unsecured" && this.clusterData.cnox_stack !== '') {
      this.btncolor = true;
    } else {
      this.btncolor = false;
    }
    this.clusterlist.forEach((x, i) => {
      if (index !== i) {
        x.checked = false;
      } else if (index === i && x.checked === false) {
        this.clusterData = {};
      }
    });
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
    this.mainservice.deleteStack(this.clusterData.cnox_engine_url, this.clusterData.cluster_name)
      .subscribe((res) => {
        this.getAllCluster();
        // let stack = {
        //   'cnox_stack': "unsecured"
        // };
        // this.mainservice.changeStack(this.clusterData.cluster_name, stack)
        //   .subscribe((data) => {
        //     this.getAllCluster();
        //   })
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
