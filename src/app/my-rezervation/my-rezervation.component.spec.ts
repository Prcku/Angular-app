import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRezervationComponent } from './my-rezervation.component';

describe('MyRezervationComponent', () => {
  let component: MyRezervationComponent;
  let fixture: ComponentFixture<MyRezervationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyRezervationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyRezervationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
