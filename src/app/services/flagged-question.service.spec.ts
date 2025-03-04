import { TestBed } from '@angular/core/testing';

import { FlaggedQuestionService } from './flagged-question.service';

describe('FlaggedQuestionService', () => {
  let service: FlaggedQuestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlaggedQuestionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
