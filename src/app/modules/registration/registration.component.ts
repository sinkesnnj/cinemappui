import { Component, OnInit } from '@angular/core';
import { Angular2TokenService } from 'angular2-token';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  user = {
    email: '',
    password: '',
    passwordConfirmation: ''
  };

  constructor(private tokenAuthService:Angular2TokenService, private toastr: ToastrService, private router: Router) { }

  ngOnInit() {
  }

  onSignUpSubmit(){
    this.tokenAuthService.init(environment.token_auth_config);
    this.tokenAuthService.registerAccount(this.user).subscribe(
        (res) => {
          if (res.status == 200){
            this.toastr.success('Welcome', 'Successfully registerd!', {positionClass: 'toast-bottom-right'});
            this.router.navigate(['/dashboard']);
          }

        },
        error => {
          this.toastr.error('Register failed', 'That combination is occupied', {positionClass: 'toast-bottom-right'});
        }
    )

  }
}
