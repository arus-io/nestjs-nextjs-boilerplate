import { AuthUtils } from './authUtils';
const timekeeper = require('timekeeper');

beforeEach(() => timekeeper.reset());
const secret = 'secret';

it('should create token and decrypt', async () => {
  const t = await AuthUtils.signJwt(
    secret,
    {
      foo: 'bar',
    },
    1000,
  );

  const result = await AuthUtils.verifyJwt(secret, t.token);

  expect(result.foo).toEqual('bar');
});

it('should not expire within 999 secs', async () => {
  const t = await AuthUtils.signJwt(
    secret,
    {
      foo: 'bar',
    },
    1000,
  );

  timekeeper.freeze(Date.now() + 999 * 1000);
  const result = await AuthUtils.verifyJwt(secret, t.token);

  expect(result.foo).toEqual('bar');
});

it('should expire after 1000 secs', async () => {
  const t = await AuthUtils.signJwt(
    secret,
    {
      foo: 'bar',
    },
    999,
  );

  timekeeper.freeze(Date.now() + 1000 * 1000);
  try {
    await AuthUtils.verifyJwt(secret, t.token);
  } catch (e) {
    expect(e.message).toBe('jwt expired');
    return;
  }
  throw new Error('should expire');
});
