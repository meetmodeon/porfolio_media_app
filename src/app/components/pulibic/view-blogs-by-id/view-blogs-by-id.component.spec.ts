import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBlogsByIdComponent } from './view-blogs-by-id.component';

describe('ViewBlogsByIdComponent', () => {
  let component: ViewBlogsByIdComponent;
  let fixture: ComponentFixture<ViewBlogsByIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewBlogsByIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewBlogsByIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
