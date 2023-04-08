import {Component, TemplateRef} from '@angular/core';
import {UserService} from '../user.service';
import {User} from "../user";
import {Subject} from "rxjs";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  modalRef!: BsModalRef;
  items!: User[];
  currentUsers: User[] | undefined;
  user!: User;
  constructor(private userService: UserService,
              private modalService: BsModalService) {
    this.reload();
  }

  openModal(template: TemplateRef<any>, user: User) {
    this.user = user;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  reload(){
    this.userService.getCurrentUsersInRezervation().subscribe( value => {
      if (!value){
        this.currentUsers = undefined;
      }
      this.currentUsers = value;
    })

    this.userService.onUserChange()
    this.userService.getAll().subscribe(value => {this.items = value
    this.dtTrigger.next(value);})
    console.log(this.items)
    //pre krajsie vypisanie ROLi
    // for (let user of this.items){
    //   switch (user.role){
    //     case "ROLE_ADMIN": {
    //       user.role = "ADMIN";
    //       break;
    //     }
    //     case "ROLE_USER": {
    //       user.role = "USER";
    //       break;
    //     }
    //     default: {
    //       user.role = "WATCHER";
    //     }
    //   }
    // }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  confirm(): void {
    this.userService.delete(this.user.id)
      .subscribe(() => {
        this.reload();
      },
        () => console.log("non catch error"))
    this.modalRef.hide();
  }

  decline(): void {
    this.modalRef.hide();
  }
}
