import { Component, OnInit } from '@angular/core';
import { Angular2TokenService } from 'angular2-token';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-movie-preview',
  templateUrl: './movie_preview.component.html',
  styleUrls: ['./movie_preview.component.css']
})
export class MoviePreviewComponent implements OnInit {
  movie = {
    poster_path: '',
    name: '',
    summary: '',
    run_time: 0,
    rating: 0,
    release_date: ''
  };
  actors = [];
  genres = [];
  reviews = [];
  reviewers = [];
  commentForm = new FormGroup({});
  model = {
    id: null
  };
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: 'col-2',
          key: 'rating',
          type: 'input',
          templateOptions: {
            label: 'Rating',
            placeholder: 'Rating',
            pattern: /([12345]{1})/,
            required: false,
          },
          validation: {
            messages: {
              pattern: (error, field: FormlyFieldConfig) => `"${field.formControl.value}" is not a valid rating, please specifie something between 1 and 5`,
            },
          },
        },
        {
          className: 'col-10',
          type: 'textarea',
          key: 'review_text',
          templateOptions: {
            label: 'Review Text',
            placeholder: 'Review Text',
            required: false,
          },
        },
      ],
    },
    { template: '<hr />' },
    {
      type: 'checkbox',
      key: 'anonymous',
      templateOptions: {
        label: 'Is Anonymous?',
      },
    }
  ];

  constructor(public tokenAuthService: Angular2TokenService, private route: ActivatedRoute, private location: Location, private toastr: ToastrService) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.tokenAuthService.init(environment.token_auth_config);
    this.tokenAuthService.get('movies/show/'+id).subscribe(
      res => {
        if (res.status == 200){
          this.movie = res.json().data.movie;
          this.actors = res.json().data.actors;
          this.genres = res.json().data.genre;
          this.reviews = res.json().data.reviews;
          this.reviewers = res.json().data.reviewers;
        }
      }
    );
  }

  formatActors(): string{
    let actors = this.actors.map(actor => ' ' + actor.name + ' ' + actor.surname);
    if (actors.length < 1)
      return 'N/A';

    return actors.join(',');
  }

  formatGenre(): string{
    let genres = this.genres.map(genre => ' ' + genre.genre_name);
    if (genres.length < 1)
      return 'N/A';

    return genres.join(',');
  }

  onSubmit(){
    this.tokenAuthService.init(environment.token_auth_config);
    this.tokenAuthService.post('movies/'+this.route.snapshot.paramMap.get('id')+'/comment', this.model).subscribe(
      res => {
        if (res.status == 200){
          this.reviews = res.json().data.reviews;
          this.reviewers = res.json().data.reviewers;
          this.movie = res.json().data.movie;
          this.model = {
            id: null
          };
          this.toastr.success('Action successful!', '', {positionClass: 'toast-bottom-right'});
        }
      },
      error => {
        this.toastr.error('Something went wrong', 'Please check submited data', {positionClass: 'toast-bottom-right'});
      }
    );
  }

  getReviewersName(user_id){
    let usr = {
      name: '',
    }
    let user = this.reviewers.filter(u=> u.id == user_id);
    usr = user[0];
    return usr.name;
  }

}
