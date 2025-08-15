import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordScoringComponent } from './word-scoring.component';

describe('WordScoringComponent', () => {
  let component: WordScoringComponent;
  let fixture: ComponentFixture<WordScoringComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WordScoringComponent]
    });
    fixture = TestBed.createComponent(WordScoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
