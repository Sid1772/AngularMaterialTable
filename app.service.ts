import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn:'root'
})
export class TableService{
  constructor(private http:HttpClient){

  }
  public getTableData(){
    return this.http.get('https://run.mocky.io/v3/1a408dc6-3e7c-47f5-b2ca-d39e77af5284')
  }
}