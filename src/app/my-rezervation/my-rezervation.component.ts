import {Component, TemplateRef} from '@angular/core';
import {User} from "../user";
import {UserService} from "../user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Rezervation} from "../rezervation";
import {RezervationService} from "../rezervation.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";

@Component({
  selector: 'app-my-rezervation',
  templateUrl: './my-rezervation.component.html',
  styleUrls: ['./my-rezervation.component.scss']
})
export class MyRezervationComponent  {

  user = {} as User;
  count = 0 ;
  items: Rezervation[] | undefined;
  inactive: Rezervation[] = [];
  modalRef!: BsModalRef;
  cancel_time!: string;
  rezervation_to_delete!: Rezervation;
  private id: number;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private rezervationService: RezervationService,
              private modalService: BsModalService) {
    this.id = Number(route.snapshot.paramMap.get('id'));
    userService.getById(this.id)
      .subscribe(
        value => {
          this.user = value;
          this.reload();
        })
  }

  openModal(template: TemplateRef<any>, rezervation_to_delete: Rezervation) {
    this.rezervation_to_delete = rezervation_to_delete;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  reload(){
    this.userService.getUserRezervation(this.user.id).subscribe(value => {
      this.items = value;
      for (let item of this.items) {
        if( !item.status ){
          this.inactive.push(item);
        }
      }
      },)

  }

  confirm(): void {
    this.rezervationService.cancelRezervation(this.rezervation_to_delete.currentTime.toLocaleString(), this.id).subscribe(() =>{
      this.reload();
    })
    this.modalRef.hide();
  }

  decline(): void {
    this.modalRef.hide();
  }

}
