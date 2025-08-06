import { TestBed } from '@angular/core/testing';

import { TasinmazService } from './tasinmaz.service';

describe('TasinmazService', () => {
  let service: TasinmazService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TasinmazService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
