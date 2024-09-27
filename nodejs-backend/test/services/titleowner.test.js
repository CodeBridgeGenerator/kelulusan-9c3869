const assert = require('assert');
const app = require('../../src/app');

describe('\'titleowner\' service', () => {
  it('registered the service', () => {
    const service = app.service('titleowner');

    assert.ok(service, 'Registered the service (titleowner)');
  });
});
