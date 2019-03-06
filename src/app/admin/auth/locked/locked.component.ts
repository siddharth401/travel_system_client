import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-locked',
  templateUrl: './locked.component.html',
})
export class LockedComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  unlock(event){
    event.preventDefault();
    this.router.navigate(['/dashboard/analytics'])
  }
}
