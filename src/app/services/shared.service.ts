import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  bookmark: boolean = false;
  sideBar: boolean = false;
  pathId: string = '';
  bar: string = '';
  
  bookmarkVisibilityChange: Subject<boolean> = new Subject<boolean>();
  sideBarVisibilityChange: Subject<boolean> = new Subject<boolean>();
  pathIdChange: Subject<string> = new Subject<string>();
  barChange: Subject<string> = new Subject<string>();

  constructor() {
      this.bookmarkVisibilityChange.subscribe((value) => {
        this.bookmark = value
    });
    this.sideBarVisibilityChange.subscribe((value) => {
        this.sideBar = value
    });
    this.pathIdChange.subscribe((value) => {
      this.pathId = value
    });
    this.barChange.subscribe((value) => {
      this.bar = value
    });
   }

   toggleBookmarkVisibility() {
    this.bookmarkVisibilityChange.next(!this.bookmark);
  }

  toggleSidebarVisibility(state, id, letter){
    this.sideBarVisibilityChange.next(state);
    this.pathIdChange.next(id);
    this.barChange.next(letter);
  }
}
