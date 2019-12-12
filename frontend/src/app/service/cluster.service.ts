import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ClusterService {


  api = environment.api;

  constructor(private http: HttpClient) {
  }

  getworkloadcomplianceReport(cluster_name, customer_id) {
    return this.http.get<any>(this.api + '/getworkloadcompliancereport/' + cluster_name + '/' + customer_id);
  }
}
