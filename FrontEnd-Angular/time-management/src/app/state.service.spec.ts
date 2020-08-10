import { StateService } from './state.service';
import { EMPLOYEE } from './test.constants';

describe('StateService', () => {
  let service: StateService;

  beforeEach(() => {
    service = new StateService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store employee', () => {
    service.store(EMPLOYEE);
    expect(service.employee).toBe(EMPLOYEE);
  });

  it('should clear state', () => {
    service.store(EMPLOYEE);
    expect(service.employee).toBe(EMPLOYEE);
    service.clear();
    expect(service.employee).toBeNull();
  })
});