import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentNavbarComponent } from './content-navbar.component';

describe('ContentNavbarComponent', () => {
  let component: ContentNavbarComponent;
  let fixture: ComponentFixture<ContentNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentNavbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
