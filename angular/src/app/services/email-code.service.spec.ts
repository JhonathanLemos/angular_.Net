import { TestBed } from '@angular/core/testing';

import { EmailCodeService } from './email-code.service';

describe('EmailCodeService', () => {
  let service: EmailCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
