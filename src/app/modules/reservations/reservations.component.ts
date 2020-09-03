import { Component, OnInit } from '@angular/core';
import { Angular2TokenService } from 'angular2-token';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css', './ticketing.css']
})
export class ReservationsComponent implements OnInit {
  showtime_users =[];
  selected = [];
  showtimes = [];
  selectedValue = 0;
  movie = null;

  constructor(public tokenAuthService: Angular2TokenService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.getMovie(this.route.snapshot.paramMap.get('id'));
    this.getShowtimes(this.route.snapshot.paramMap.get('id'));
  }

  getShowtimes(id){
    this.tokenAuthService.init(environment.token_auth_config);
    this.tokenAuthService.get('movies/'+id+'/showtimes').subscribe(
      res => {
        if (res.status == 200){
          this.showtimes = res.json().data.showtimes;
        }
      }
    );
  }

  goReserve(){
    this.tokenAuthService.init(environment.token_auth_config);
    this.tokenAuthService.post('showtime_users/'+this.selectedValue+'/reserve', {reserve: this.selected}).subscribe(
      res => {
        if (res.status == 200){
          this.toastr.success('Action successful!', '', {positionClass: 'toast-bottom-right'});
          this.router.navigate(['/showtimes']);
        }
      },
      error => {
        this.toastr.error('Something went wrong', 'Please check submited data', {positionClass: 'toast-bottom-right'});
      }
    );
  }

  getMovie(id){
    this.tokenAuthService.init(environment.token_auth_config);
    this.tokenAuthService.get('movies/show/'+id).subscribe(
      res => {
        if (res.status == 200){
          this.movie = res.json().data.movie;
        }
      }
    );
  }

  seatClicked(i, j){
    if (this.showtime_users[i][j] === null || this.showtime_users[i][j] === undefined){
      if (this.selected.length > 2){
        this.showtime_users[this.selected[0][0]][this.selected[0][1]] = null;
        this.selected.shift();
      }
      this.selected.push([i,j]);
      this.showtime_users[i][j] = 1;
    } else if (this.showtime_users[i][j] == 1) {
      this.showtime_users[i][j] = null;
      this.selected = this.selected.filter(sel => sel[0] != i && sel[1] != j)
    } else {
      return;
    }
  }

  getImgSrc(i,j): string{
    if (this.showtime_users[i][j] === null || this.showtime_users[i][j] === undefined)
      return 'https://www.cineplexx.rs/ticketing/static/seat_normal_available.png';
    else if (this.showtime_users[i][j] === 'reserved')
      return 'https://www.cineplexx.rs/ticketing/static/seat_normal_sold.png';
    else
      return 'https://www.cineplexx.rs/ticketing/static/seat_normal_selected.png';
  }

  onChange(){
    if (this.selectedValue > 0){
      this.tokenAuthService.init(environment.token_auth_config);
      this.tokenAuthService.get('showtime_users/'+this.selectedValue).subscribe(
        res => {
          if (res.status == 200){
            this.showtime_users = res.json().data.showtime_users;
          }
        }
      );
    }
  }

}
