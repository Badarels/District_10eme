import { EmployePipe } from './employe.pipe';

describe('EmployePipe', () => {
  it('create an instance', () => {
    const pipe = new EmployePipe();
    expect(pipe).toBeTruthy();
  });
});
