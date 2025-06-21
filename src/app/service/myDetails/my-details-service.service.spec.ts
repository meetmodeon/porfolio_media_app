import { TestBed } from '@angular/core/testing';

import { MyDetailsServiceService } from './my-details-service.service';

describe('MyDetailsServiceService', () => {
  let service: MyDetailsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyDetailsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
