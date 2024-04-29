import { Readable, Writable } from 'node:stream';
/// <reference types="vinxi/types/server" />
import { createFromNodeStream } from '@vinxi/react-server-dom/client';
import { createModuleLoader } from '@vinxi/react-server-dom/runtime';
import { renderToPipeableStream } from 'react-dom/server';
import { H3Event, eventHandler, handleHTTPEvent, setHeader } from 'vinxi/http';
import { getManifest } from 'vinxi/manifest';

import { logSSREventsInfo } from './logging';

function createStream() {
  const readable = new Readable({
    objectMode: true,
  });

  readable._read = () => {};

  // @ts-expect-error
  readable.headers = {};

  const writableStream = new Writable({
    write(chunk, encoding, callback) {
      readable.push(chunk);
      callback();
    },
  });

  // @ts-expect-error
  writableStream.setHeader = () => {};

  writableStream.on('finish', () => {
    readable.push(null);
    readable.destroy();
  });

  return {
    readable: readable,
    writable: writableStream,
  };
}

export default eventHandler(async (event) => {
  globalThis.__vite__ = createModuleLoader(getManifest('ssr').dev.server);

  logSSREventsInfo(event);

  const responseStream = createStream();

  event.node.req.url = `/_rsc${event.node.req.url ?? ''}`;

  // @ts-expect-error
  await handleHTTPEvent(new H3Event(event.node.req, responseStream.writable));

  const clientManifest = getManifest('client');
  const clientScriptPath =
    clientManifest?.inputs[clientManifest.handler].output.path;
  const element = createFromNodeStream(responseStream.readable);
  const streamOptions = {
    bootstrapModules: [clientScriptPath].filter(Boolean),
    bootstrapScriptContent: `
      window.base = "${import.meta.env.BASE_URL}";`,
  };

  const stream = renderToPipeableStream(element, streamOptions);

  setHeader(event, 'Content-Type', 'text/html');

  return stream;
});
