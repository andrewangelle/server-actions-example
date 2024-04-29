import {
  type EventHandlerRequest,
  type H3Event,
  defineMiddleware,
  setContext,
  setHeader,
} from 'vinxi/http';

function onRequest(event: H3Event<EventHandlerRequest>) {
  const token = event.headers.get('authorization');

  if (!token) {
    throw new Error('Unauthorized');
  }

  setContext(event, 'token', token);
}

function onBeforeResponse(event: H3Event<EventHandlerRequest>) {
  setHeader(event, 'Access-Control-Allow-Origin', '*');
}

export default defineMiddleware({
  onRequest,
  onBeforeResponse,
});
