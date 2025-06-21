import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProjectByIdComponent } from './view-project-by-id.component';

describe('ViewProjectByIdComponent', () => {
  let component: ViewProjectByIdComponent;
  let fixture: ComponentFixture<ViewProjectByIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewProjectByIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewProjectByIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
