// // ✅ search.service.ts
// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class SearchService {
//   private searchQuery = new BehaviorSubject<string>('');
//   public currentQuery$ = this.searchQuery.asObservable(); // ✅ This line is important

//   setQuery(query: string) {
//     this.searchQuery.next(query.toLowerCase());
//   }
// }
// src/app/services/search.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private querySubject = new BehaviorSubject<string>(''); // ✅ Holds the current search string
  currentQuery$ = this.querySubject.asObservable();       // ✅ Used to subscribe from components

  setQuery(query: string) {
    this.querySubject.next(query);
  }
}
