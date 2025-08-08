import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasinmazListComponent } from './tasinmaz-list.component';

describe('TasinmazListComponent', () => {
  let component: TasinmazListComponent;
  let fixture: ComponentFixture<TasinmazListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasinmazListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasinmazListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
