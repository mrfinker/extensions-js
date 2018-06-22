import StateClient from '../src/state-client';
import { ENVIRONMENTS } from '../src/util';

import mockXHR from '../libs/__mocks__/xhr-promise';

jest.mock('../libs/xhr-promise');

const clientId = 'fake-id';
const expiredJWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGFubmVsX2lkIjoiMTI2OTU1MjExIiwicm9sZSI6InZpZXdlciIsImV4dGVuc2lvbl9pZCI6ImthM3kyOHJyZ2gyZjUzM214dDltbDM3ZnY2emI4ayIsImV4cCI6MTQ5Nzk5MDQzMiwib3BhcXVlX3VzZXJfaWQiOiJBODk0MzIzNiIsImFsbG93ZWRfc3RhZ2UiOiJ0ZXN0aW5nIiwiYXBwX2lkIjoibXlfYXdlc29tZV9hcHAifQ.s49uwSdy9C7KyubpYQPtJfuN4q_-9a-nuG4MxnIvoBo';

/** @test {StateClient} */
describe('StateClient', () => {
  const broadcasterClient = new StateClient();
  const viewerClient = new StateClient();

  beforeAll(async () => {
    StateClient.setEnvironment(ENVIRONMENTS.TESTING);
    await StateClient.fetchTestAuth(clientId, '12345', 'broadcaster').then(broadcasterAuth => {
      broadcasterClient.updateAuth(broadcasterAuth.token);
    });
    await StateClient.fetchTestAuth(clientId, '12345', 'viewer').then(viewerAuth => {
      viewerClient.updateAuth(viewerAuth.token);
    });
  });

  beforeEach(() => {
    mockXHR.reset();
  });

  /** @test {StateClient#validateJWT} */
  it('should fail with invalid JWT', async () => {
    const client = new StateClient();
    await expect(client.getRank(clientId, 'empty')).rejects.toEqual('Your authentication token has expired.');
  });

  /** @test {StateClient#validateJWT} */
  it('should fail with an expired JWT', async () => {
    const client = new StateClient();
    client.updateAuth(expiredJWT);
    await expect(client.getRank(clientId, 'empty')).rejects.toEqual('Your authentication token has expired.');
  });

  /** @test {StateClient#getRank} */
  it('should make a request', async () => {
    // const viewerClient = new StateClient();
    // await StateClient.fetchTestAuth(clientId, '12345', 'viewer').then(viewerAuth => {
    //   viewerClient.updateAuth(viewerAuth.token);
    // });

   await expect(viewerClient.getRank(clientId, 'empty')).resolves.toEqual({ data: [] });
  });

  /** @test {StateClient#getViewerState} */
  it('sets and gets viewer state', async () => {
    await expect(viewerClient.getViewerState(clientId)).resolves.toEqual({});
    await expect(viewerClient.setViewerState(clientId, { state: 'hello' })).resolves;
    await expect(viewerClient.getViewerState(clientId)).resolves.toEqual({ state: 'hello' });
    await expect(viewerClient.getState(clientId)).resolves.toEqual({ viewer: { state: 'hello' } });
  });
});
