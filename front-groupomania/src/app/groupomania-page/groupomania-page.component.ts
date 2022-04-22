import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../apiservice.service';

@Component({
  selector: 'app-groupomania-page',
  templateUrl: './groupomania-page.component.html',
  styleUrls: ['./groupomania-page.component.scss']
})
export class GroupomaniaPageComponent implements OnInit {

  constructor(private service: ApiserviceService) { }

  readData: any;

  ngOnInit(): void {
    this.allPosts();
  }

  // tous les posts
  allPosts() {
    this.service.getAllPosts().subscribe((res) => {
      console.log(res, 'res ==>');
      this.readData = res.data;
    });
  }
}
