import {Component, NgZone } from '@angular/core';
import {NgForm} from "@angular/forms";
import {UserService} from "../user.service";
import { Router} from "@angular/router";
import {UserDTO} from "../userDTO";
import {error} from "jquery";
import {Observable, ReplaySubject} from "rxjs";
import {ChangeDetection} from "@angular/cli/lib/config/workspace-schema";
import {LocalStorageService} from "angular-2-local-storage";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent{
  // title = 'loginGoogle';
  //
  // auth2: any;
  //
  // @ViewChild('loginRef', {static: true }) loginElement!: ElementRef;

  item = {} as UserDTO;
  error: string | undefined;
  guser: any;

  constructor(private userService: UserService,
              private router: Router,
              private localStorageService: LocalStorageService,
              ngZone: NgZone) {

    // @ts-ignore
    window['onSingIn'] = (user: any) => ngZone.run(
      () => {
        this.afterSingUp({googleUser: user});
      }
    )
    this.error = undefined;
  }

  afterSingUp({googleUser}: { googleUser: any } ){
    console.log(googleUser)
    this.guser = googleUser;
    this.localStorageService.set("token", googleUser.credential);
    this.router.navigate(['/home'])
  }
  // ngOnInit(): void {
  //   this.googleAuthSDK();
  //   // this.signInService.observable().subscribe( user => {
  //   //   this.user = user
  //   //   this.ref.detectChanges()
  //   //   console.log(user)
  //   // })
  // }
  //
  // callLoginButton() {
  //
  //   this.auth2.attachClickHandler(this.loginElement.nativeElement, {},
  //     (googleAuthUser:any) => {
  //
  //       let profile = googleAuthUser.getBasicProfile();
  //       console.log('Token || ' + googleAuthUser.getAuthResponse().id_token);
  //       console.log('ID: ' + profile.getId());
  //       console.log('Name: ' + profile.getName());
  //       console.log('Image URL: ' + profile.getImageUrl());
  //       console.log('Email: ' + profile.getEmail());
  //
  //       /* Write Your Code Here */
  //
  //     }, (error:any) => {
  //       alert(JSON.stringify(error, undefined, 2));
  //     });
  //
  // }
  //
  // /**
  //  * Write code on Method
  //  *
  //  * @return response()
  //  */
  // googleAuthSDK() {
  //
  //   (<any>window)['googleSDKLoaded'] = () => {
  //     (<any>window)['gapi'].load('auth2', () => {
  //       this.auth2 = (<any>window)['gapi'].auth2.init({
  //         client_id: '39944140550-bjmrjf43jd3r0v8049d0op7j06fonamb.apps.googleusercontent.com',
  //         cookiepolicy: 'single_host_origin',
  //         scope: 'profile email'
  //       });
  //       this.callLoginButton();
  //     });
  //   }
  //
  //   (function(d, s, id){
  //     var js, fjs = d.getElementsByTagName(s)[0];
  //     if (d.getElementById(id)) {return;}
  //     js = d.createElement('script');
  //     js.id = id;
  //     js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
  //     fjs?.parentNode?.insertBefore(js, fjs);
  //   }(document, 'script', 'google-jssdk'));
  //
  // }

  // signIn () {
  //   this.signInService.signIn();
  // }
  //
  // signOut () {
  //   this.signInService.singOut();
  // }

  check(formElemnt: NgForm){
   if (formElemnt.invalid){
     return
   }
   this.item.email = formElemnt.value.email;
   this.item.password = formElemnt.value.password;
   this.userService.isAutorized(this.item).subscribe(value => {

     if (value.authorities[0] == "ROLE_USER"){
       this.router.navigate(['/home'])
     }
     else if(value.authorities[0] == "ROLE_ADMIN"){
       this.router.navigate(['/adminpage'])
     }
     else if(value.authorities[0] == "ROLE_WATCHER"){
       this.router.navigate(['/info'])
     }
     },
     error => {
        if (error){
          this.error = error;
        }
     }
   )
  }
}
