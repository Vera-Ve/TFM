import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OriginalLanguageComponent } from './original-language.component';

describe('OriginalLanguageComponent', () => {
  let component: OriginalLanguageComponent;
  let fixture: ComponentFixture<OriginalLanguageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OriginalLanguageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OriginalLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
