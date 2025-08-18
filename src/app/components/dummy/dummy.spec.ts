import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dummy } from './dummy';

describe('Dummy', () => {
  let component: Dummy;
  let fixture: ComponentFixture<Dummy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dummy]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dummy);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
