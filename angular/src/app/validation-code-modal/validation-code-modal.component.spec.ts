import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationCodeModalComponent } from './validation-code-modal.component';

describe('ValidationCodeModalComponent', () => {
  let component: ValidationCodeModalComponent;
  let fixture: ComponentFixture<ValidationCodeModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValidationCodeModalComponent]
    });
    fixture = TestBed.createComponent(ValidationCodeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
