/// <reference types="vinxi/types/server" />
import { renderAsset } from '@vinxi/react';
import {
  decodeReply,
  renderToPipeableStream,
} from '@vinxi/react-server-dom/server';
import { type ReactNode, Suspense } from 'react';
import { eventHandler, setHeaders } from 'vinxi/http';
import { getManifest } from 'vinxi/manifest';

import App from '../server/app';
import { logRSCEventsInfo } from './logging';

type ManifestAsset = {
  tag: string;
  attrs: Record<string, string>;
  children: ReactNode;
};

function isLinkOrStyles(m: ManifestAsset) {
  return (
    (m.tag === 'link' && m.attrs.rel === 'stylesheet') || m.tag === 'style'
  );
}

export default eventHandler(async (event) => {
  const reactServerManifest = getManifest('rsc');
  const clientManifest = getManifest('client');

  logRSCEventsInfo(event);

  if (event.node.req.method === 'POST') {
    const serverReference = event.headers.get('server-action');

    if (serverReference) {
      // This is the client-side case
      const [filepath, name] = serverReference.split('#');
      const action = (await reactServerManifest.chunks[filepath].import())[
        name
      ];

      // Validate that this is actually a function we intended to expose and
      // not the client trying to invoke arbitrary functions. In a real app,
      // you'd have a manifest verifying this before even importing it.
      if (action.$$typeof !== Symbol.for('react.server.reference')) {
        throw new Error('Invalid action');
      }

      const text = await new Promise((resolve) => {
        const requestBody = [];
        event.node.req.on('data', (chunks) => {
          requestBody.push(chunks);
        });
        event.node.req.on('end', () => {
          resolve(requestBody.join(''));
        });
      });

      const args: HTMLElement = await decodeReply(text);

      const result = action.apply(null, args);

      try {
        // Wait for any mutations
        await result;
      } catch (x) {
        // We handle the error on the client
      }

      // Refresh the client and return the value
      // return {};
    } else {
      throw new Error('Invalid request');
    }
  }

  const serverAssetsFromManifest = (await reactServerManifest.inputs[
    reactServerManifest.handler
  ].assets()) as unknown as ManifestAsset[];

  const serverAssets = serverAssetsFromManifest.filter(isLinkOrStyles);

  const clientAssets = (await clientManifest.inputs[
    clientManifest.handler
  ].assets()) as unknown as ManifestAsset[];

  const stream = renderToPipeableStream(
    <App
      isError={!event.context.token}
      assets={
        <Suspense>
          {serverAssets.map((m) => renderAsset(m))}
          {clientAssets.map((m) => renderAsset(m))}
        </Suspense>
      }
    />,
  );

  // // @ts-ignore
  // stream._read = () => {};

  // // @ts-ignore
  // stream.on = (event, listener) => {
  // 	events[event] = listener;
  // };

  // @ts-expect-error
  setHeaders(event, {
    'Content-Type': 'text/x-component',
    Router: 'rsc',
  });

  return stream;
});
