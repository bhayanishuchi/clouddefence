import {Component, OnInit} from '@angular/core';
import {MainService} from '../main.service';
import {HttpClient} from "@angular/common/http";
import {UserService} from "../service/socket.service";
import {Socket} from "ngx-socket-io";
import {ActivatedRoute, Router} from "@angular/router";

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
  selectedCluster;

  constructor(private mainservice: MainService,
              private http: HttpClient,
              private socket: Socket,
              private userService: UserService,
              private activatRoute: ActivatedRoute,
              private router: Router) {

  }

  ngOnInit() {
    this.activatRoute.queryParams.subscribe((data) => {
      console.log('data.stack', data.stack);
      this.selectedCluster = data.stack;
      this.getAllCluster();
    });
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
      });
      if (that.selectedCluster === undefined && that.selectedCluster === '')
        that.clusterlist = data;

      console.log('that.cluster', that.clusterlist);

    });


    this.userService.updateCLuster(socket, function (data) {
      console.log('update-cluster', data);
      // that.clusterlist[0].cluster_name= "pooja"
      console.log("sdas", that.clusterlist);
      that.clusterlist.filter((x) => {
        if (x.cluster_name === data.cluster_name) {
          x.showProgress = true;
          console.log("numbere", x.barWidth);
          if (x.barWidth) {
            if ((x.barWidth + data.percentage) < 101) {
              x.barWidth += data.percentage;
            }
          } else {
            x.barWidth = data.percentage;
          }
        }
      });
    });
  }

  getAllCluster() {

    console.log('this.selectedCluster', this.selectedCluster);
    this.mainservice.getCluster()
      .subscribe(response => {
        this.clusterlist = [];
        if (this.selectedCluster === 'Silver') {
          response.filter((x) => {
            if (x.cnox_stack === 'silver_stack') {
              this.clusterlist.push(x);
            }
            console.log('silver', this.clusterlist);
          });
        } else if (this.selectedCluster === "Bronze") {
          response.filter((x) => {
            if (x.cnox_stack === 'bronze_stack') {
              this.clusterlist.push(x);
            }
            console.log('oooooooooooooooo', this.clusterlist);
          });
        } else if (this.selectedCluster === 'Gold') {
          response.filter((x) => {
            if (x.cnox_stack === 'gold_stack') {
              this.clusterlist.push(x);
            }
            console.log('gold_stack', this.clusterlist);
          });
        } else {
          response.forEach((x) => {
            x.checked = false;
          });
          this.clusterlist = response;
          console.log('yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy', this.clusterlist);
        }
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
      // this.viewDisplay = 'block';
      this.router.navigate(['/cluster-1']);
    } else {
      alert('Please select any one cluster');
      this.viewDisplay = 'none';

    }
  }

  onStackUpdate() {
    this.display = 'none';
    let stack_name = {"stack_name": this.selectedStack};
    console.log('stack', stack_name);
    this.clusterlist.filter((x) => {
      if (x.cluster_name === this.clusterData.cluster_name) {
        x.showProgress = true;
        x.barWidth = 0;
      }
    });
    this.mainservice.updateStack(this.clusterData.cnox_engine_url, this.clusterData.cluster_name, stack_name).subscribe((res) => {
      console.log('stackrespone', res);
      // this.showProgress = true;
      this.clusterlist.filter((x) => {
        if (x.cluster_name === this.clusterData.cluster_name) {
          x.showProgress = true;
          x.barWidth = 0;
        }
      });
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
    this.clusterlist.filter((x) => {
      if (x.cluster_name === this.clusterData.cluster_name) {
        x.cnox_stack = "Stack delete in progress";
      }
    });


    this.mainservice.deleteStack(this.clusterData.cnox_engine_url, this.clusterData.cluster_name)
      .subscribe((res) => {
        console.log('res', res);
        this.getAllCluster();
        // let stack = {
        //   'cnox_stack': "unsecured"
        // };
        // this.mainservice.changeStack(this.clusterData.cluster_name, stack)
        //   .subscribe((data) => {
        //     this.getAllCluster();
        //   })
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
