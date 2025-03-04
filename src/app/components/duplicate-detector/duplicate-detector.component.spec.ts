import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateDetectorComponent } from './duplicate-detector.component';

describe('DuplicateDetectorComponent', () => {
  let component: DuplicateDetectorComponent;
  let fixture: ComponentFixture<DuplicateDetectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DuplicateDetectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DuplicateDetectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
