import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRezervationComponent } from './all-rezervation.component';

describe('AllRezervationComponent', () => {
  let component: AllRezervationComponent;
  let fixture: ComponentFixture<AllRezervationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllRezervationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllRezervationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
