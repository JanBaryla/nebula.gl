import { doNothing } from '../../src/lib/edit-mode.js';

it('does nothing', () => {
  expect(doNothing()).toBeNull();
});
