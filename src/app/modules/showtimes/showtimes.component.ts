import { Component, OnInit } from '@angular/core';
import { Angular2TokenService } from 'angular2-token';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { element } from 'protractor';

@Component({
  selector: 'app-showtimes',
  templateUrl: './showtimes.component.html',
  styleUrls: ['./showtimes.component.css']
})
export class ShowtimesComponent implements OnInit {
  movies = [];
  page = 1;
  hasNextPage = false;
  theatres = [];
  math = Math;

  constructor(public tokenAuthService: Angular2TokenService, private router: Router) { }

  ngOnInit(): void {
    this.getItems(this.page);
  }

  goReserve(movie_id){
    this.router.navigate(['/reservations/' + movie_id]);
  }

  getTheatreName(theatreId): string{
    let theatre = this.theatres.find(element => element.id == theatreId);
    return theatre.name;
  }

  getPage(page) {
    this.page = page;
    this.getItems(this.page);
  }

  getItems(page) {
    this.tokenAuthService.init(environment.token_auth_config);
    this.tokenAuthService.get('showtimes/index?page='+page).subscribe(
      res => {
        if (res.status == 200){
          let movies = res.json().data.movies;
          movies = JSON.parse(movies);
          this.hasNextPage = movies.length > 4;
          this.movies = movies.slice(0, 4);
          this.theatres = res.json().data.theatres;
        }
      }
    );
  }

}
