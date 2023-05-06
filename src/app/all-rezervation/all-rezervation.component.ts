import {Component, TemplateRef} from '@angular/core';
import {User} from "../user";
import {UserService} from "../user.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import { FormBuilder, FormGroup } from '@angular/forms';
import {RezervationService} from "../rezervation.service";
import {moment} from "ngx-bootstrap/chronos/testing/chain";
import {DATE} from "ngx-bootstrap/chronos/units/constants";
import {DatePipe} from "@angular/common";
import {Observable} from "rxjs";

@Component({
  selector: 'app-all-rezervation',
  templateUrl: './all-rezervation.component.html',
  styleUrls: ['./all-rezervation.component.scss']
})
export class AllRezervationComponent {

    rezervations: Map<string,User[]> | undefined;
    modalRef!: BsModalRef;
    myForm: FormGroup;
    user!: User;
    cancel_time!: string;

  constructor(private userService: UserService,
              private rezervationService: RezervationService,
              private modalService: BsModalService,
              private fb: FormBuilder,
              public datepipe: DatePipe) {
    this.myForm = this.fb.group({
      date: new Date(),
    });

      this.reload();
  }

  //aby sa nedali zrusit rezervacie ktore uz boli
  compareTime(date: string){
    const rezervationTime = new Date(date)
    if (rezervationTime.getTime() <= new Date().getTime() ){
      return false
    }
    return true
  }

  reload(){
    this.selected_date();
  }

  format = (input: number, padLength: number): string => {
    return input.toString().padStart(padLength, '0');
  };

  openModal(template: TemplateRef<any>, user: User,cancel_Time: string) {
    this.user = user;
    this.cancel_time = cancel_Time;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  selected_date() {
    this.myForm.value.date.setHours(6, 0, 0, 0);
    this.myForm.value.date =
      this.format(this.myForm.value.date.getFullYear(), 4) +
      '-' +
      this.format(this.myForm.value.date.getMonth() + 1, 2) +
      '-' +
      this.format(this.myForm.value.date.getDate(), 2) +
      ' ' +
      this.format(this.myForm.value.date.getHours(), 2) +
      ':' +
      this.format(this.myForm.value.date.getMinutes(), 2) +
      ':' +
      this.format(this.myForm.value.date.getSeconds(), 2);
    this.userService.getAllUsersInRezervationInDay(this.myForm.value.date).subscribe( value => {
      this.rezervations = value;
    })
  }

  confirm(): void {
    let format_date = this.datepipe.transform(this.cancel_time, 'yyyy-MM-dd HH:mm');
    // @ts-ignore
    this.rezervationService.cancelRezervation(format_date,this.user.id)
      .subscribe(() => {
          this.userService.getAllUsersInRezervationInDay(this.myForm.value.date).subscribe( value => {
            this.rezervations = value;
            console.log(value)
          })
        },
        () => {console.log("Neznama chyba")}
      )
    this.modalRef.hide();
  }

  decline(): void {
    this.modalRef.hide();
  }

}
