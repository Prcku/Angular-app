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
  items: Rezervation[] | undefined;
  inactive: Rezervation[] = [];
  modalRef!: BsModalRef;
  cancel_time!: string;
  rezervation_to_delete!: Rezervation;
  private id: number;
  public isHovered = false;
  rank_numbers = [1,10,25,50,100]


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

  //pre pohyb myši
  onHover() {
    this.isHovered = true;
  }

  onLeave() {
    this.isHovered = false;
  }

  //na zaokruhlenie nadol funkcia pre vypis odcvicenych hodin
  roundDown(numberToRound: number): number {
    return Math.floor(numberToRound);
  }

  openModal(template: TemplateRef<any>, rezervation_to_delete: Rezervation) {
    this.rezervation_to_delete = rezervation_to_delete;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  reload(){
    while(this.inactive.length){
      this.inactive.pop();
    }
    this.userService.getUserRezervation(this.user.id).subscribe(value => {
      this.items = value;
      for (let item of this.items) {
        if( !item.status ){
          for (let one of this.inactive){
            if (one.currentTime == item.currentTime){

            }else{
              this.inactive.push(item);
            }
          }
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
