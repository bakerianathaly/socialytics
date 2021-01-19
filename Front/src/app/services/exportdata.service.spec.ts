import { TestBed } from '@angular/core/testing';

import { ExportdataService } from './exportdata.service';

describe('ExportdataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExportdataService = TestBed.get(ExportdataService);
    expect(service).toBeTruthy();
  });
});
