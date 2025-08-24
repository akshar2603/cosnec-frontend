import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dummy2 } from './dummy2';

describe('Dummy2', () => {
  let component: Dummy2;
  let fixture: ComponentFixture<Dummy2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dummy2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dummy2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
