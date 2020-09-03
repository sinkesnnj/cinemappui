import { Component, OnInit } from '@angular/core';
import { Angular2TokenService } from 'angular2-token';
import { environment } from 'src/environments/environment';
import { StateService } from 'src/app/core/services/state.service';
import { RequestOptions } from '@angular/http';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  news = [];
  categories = [];
  search = null;
  filter = null;
  page = 1;
  hasNextPage = false;

  constructor(public tokenAuthService: Angular2TokenService, public stateService: StateService) {
    this.stateService.search.subscribe(value => {
      this.search = value;
      this.filter = null;
      this.startSearch();
    });

    this.stateService.filter.subscribe(value => {
      this.filter = value;
      this.search = null;
      this.startFilter();
    });
  }

  ngOnInit(): void {
    this.getItems(this.page);
    this.getCategories();
  }

  getPage(page) {
    this.page = page;
    if (this.search !== null && this.search !== undefined && this.search !== '')
      this.startSearch();
    else if (this.filter !== null && this.filter !== undefined && this.filter !== '')
      this.startFilter();
    else
      this.getItems(this.page);
  }

  getItems(page) {
    this.tokenAuthService.init(environment.token_auth_config);
    this.tokenAuthService.get('news/index?page='+page).subscribe(
      res => {
        if (res.status == 200){
          let news = res.json().data.news;
          this.hasNextPage = news.length > 3;
          this.news = news.slice(0, 3);
        }
      }
    );
  }

  startSearch(): void {
    this.tokenAuthService.init(environment.token_auth_config);
    this.tokenAuthService.get('news/index?page='+this.page+'&search='+this.search).subscribe(
      res => {
        if (res.status == 200){
          let news = res.json().data.news;
          this.hasNextPage = news.length > 3;
          this.news = news.slice(0, 3);
        }
      }
    );
  }

  startFilter(): void {
    this.tokenAuthService.init(environment.token_auth_config);
    this.tokenAuthService.get('news/index?page='+this.page+'&filter='+this.filter).subscribe(
      res => {
        if (res.status == 200){
          let news = res.json().data.news;
          this.hasNextPage = news.length > 3;
          this.news = news.slice(0, 3);
        }
      }
    );
  }

  getCategories() {
    this.tokenAuthService.init(environment.token_auth_config);
    this.tokenAuthService.get('news/categories').subscribe(
      res => {
        if (res.status == 200){
          this.categories = res.json().data.categories;
        }
      }
    );
  }

  clearFilters(){
    this.filter = null;
    this.search = null;
    this.getItems(this.page);
  }

  getNameOfCategorie(cat_id) {
    let cat = {
      title: '',
    }
    let categorie = this.categories.filter(u=> u.id == cat_id);
    cat = categorie[0];
    return cat.title;
  }

}
