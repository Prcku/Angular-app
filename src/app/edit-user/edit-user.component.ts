import {Component, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../user.service";
import {User} from "../user";
import {NgForm} from "@angular/forms";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {valHooks} from "jquery";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent  {

  modalRef!: BsModalRef;
  infoText: string | undefined;
  item = {} as User;
  private id: number;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private router: Router,
              private modalService: BsModalService) {
    this.id = Number(route.snapshot.paramMap.get('id'));
    userService.getById(this.id)
      .subscribe(
        value => {
          this.item = value;
      },
        error => {
          console.log(error.message)
          return;
        })
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  modo(){
    console.log(this.item.role)
    switch(this.item.role) {
      case "ROLE_ADMIN":
          this.item.role= "ROLE_ADMIN"
        break;
      case "ROLE_USER":
          this.item.role= "ROLE_USER"
        break;
      case "ROLE_WATCHER":
          this.item.role= "ROLE_WATCHER"
        break;
    }
  }

  submit(form: NgForm) {
    if(form.invalid || !this.item){
      return
    }
    console.log(this.item)
    this.userService.edit(this.item).subscribe(
      () => (this.infoText="Údaje úspešne zmenené"),
      error => {{
          this.infoText="Údaje sa nepodarilo zmeniť"
          return;
        }},
      () => this.router.navigate(['/adminpage'])
    )}

}
