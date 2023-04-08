import {Component, OnInit, TemplateRef} from '@angular/core';
import {RezervationService} from "../rezervation.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {User} from "../user";
import {UserService} from "../user.service";
import { DatePipe } from '@angular/common'
import {Rezervation} from "../rezervation";
import {FormBuilder, FormGroup} from "@angular/forms";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";

@Component({
  selector: 'app-kalendar',
  templateUrl: './kalendar.component.html',
  styleUrls: ['./kalendar.component.scss']
})
export class KalendarComponent  {

  item!: Rezervation[];
  user$: Observable<User | undefined>;
  countRezervation: number | undefined;
  cancel_time!: Date;
  myForm: FormGroup;
  modalRef!: BsModalRef;
  modalRefAfter!: BsModalRef;
  infoText!: string;
  user!: User;

  constructor(private rezervationService: RezervationService
    , private router: Router
    , private userService: UserService
    , private modalService: BsModalService
    , private fb: FormBuilder
    , public datepipe: DatePipe) {

    this.myForm = this.fb.group({
      date: new Date(),
    });
    // pri zmene usera sa obnovi novy observable
    this.user$ =this.userService.onUserChange()
    if (this.user$ != undefined) {
      this.user$.subscribe(value => {
        // @ts-ignore
        this.user = value;

        }
      )

      this.reload();
    }

  }

  // reload stranky podla zvoleneho datumu
  reload(){
    let time_In_format =this.datepipe.transform(this.myForm.value.date, 'yyyy-MM-dd HH:mm');
    if (time_In_format != null) {
      this.rezervationService.getGeneratedRezervation(time_In_format).subscribe(
        value => {
          this.item = value
          console.log(value)
        },
        error => {
          console.log(error)
        })
    }
  }
  //pre zadanie premenich do Modal confirmu
  openModal(template: TemplateRef<any>, cancel_Time: Date) {
    this.cancel_time = cancel_Time;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }


  //confirm pre modal a rezervovanie rezervacie a nasledna informacia o ziskani rezervacie
  confirm(template: TemplateRef<any>): void {
        let time_In_format =this.datepipe.transform(this.cancel_time, 'yyyy-MM-dd HH:mm');
        this.rezervationService.bookRezervation(time_In_format,this.user.id).subscribe(value =>{
          this.infoText="Vytvorenie rezervácie prebehlo úspešne"
          this.reload()
        }, error =>{
          console.log(error)
          if (error.message == "Duplicity"){

            this.infoText="Na zadaný datum už svoj zvolený termín máš !"
          }
        })
    this.modalRef.hide();
    this.modalRefAfter = this.modalService.show(template);
  }

  //pri odmietnuti rezervacie
  decline(): void {
    this.modalRef.hide();
  }

}
