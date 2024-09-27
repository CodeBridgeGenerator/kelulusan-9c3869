const assert = require('assert');
const app = require('../../src/app');

describe('\'landtitle\' service', () => {
  it('registered the service', () => {
    const service = app.service('landtitle');

    assert.ok(service, 'Registered the service (landtitle)');
  });
});
