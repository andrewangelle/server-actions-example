import type { EventHandlerRequest, H3Event } from 'vinxi/http';

export function logRSCEventsInfo(event: H3Event<EventHandlerRequest>) {
  console.log(
    '\x1b[36m%s\x1b[0m',
    'from RSC handler - Node Req METHOD',
    event.node.req.method,
  );

  console.log(
    '\x1b[36m%s\x1b[0m',
    'from RSC handler - Event Auth Header',
    event.headers.get('authorization'),
  );
  console.log(
    '\x1b[36m%s\x1b[0m',
    'from RSC handler - Node Req Auth Header',
    event.node.req.headers.authorization,
  );

  console.log('\x1b[36m%s\x1b[0m', {
    isSlash: event.node.req.url !== '/',
    isRSC: event.node.req.url !== '/_rsc/',
    doesNotHaveHeader: !event.headers.get('authorization'),
    url: event.node.req.url,
  });
}

export function logSSREventsInfo(event: H3Event<EventHandlerRequest>) {
  console.log(
    '\x1b[36m%s\x1b[0m',
    'from ssr handler - Node Req URL',
    event.node.req.url,
  );
  console.log(
    '\x1b[36m%s\x1b[0m',
    'from ssr handler - Event METHOD',
    event.method,
  );
  console.log(
    '\x1b[36m%s\x1b[0m',
    'from ssr handler - Event Auth Header',
    event.headers.get('authorization'),
  );
  console.log(
    '\x1b[36m%s\x1b[0m',
    'from ssr handler - Node Req METHOD',
    event.node.req.method,
  );
  console.log(
    '\x1b[36m%s\x1b[0m',
    'from ssr handler - Node Req Auth Headers',
    event.node.req.headers.authorization,
  );
}
