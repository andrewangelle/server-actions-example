/// <reference types="vinxi/types/server" />
import { renderAsset } from '@vinxi/react';
import { renderToPipeableStream } from '@vinxi/react-server-dom/server';
import { Suspense } from 'react';
import { eventHandler, setHeaders } from 'vinxi/http';

import App from '../server/app';
import { logRSCEventsInfo } from './logging';
import {
  getClientAssets,
  getServerAssets,
  handleServerActionRequest,
} from './utils';

export default eventHandler(async (event) => {
  logRSCEventsInfo(event);

  if (event.node.req.method === 'POST') {
    await handleServerActionRequest(event);
  }

  const serverAssets = await getServerAssets();
  const clientAssets = await getClientAssets();

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

  // @ts-expect-error
  setHeaders(event, {
    'Content-Type': 'text/x-component',
    Router: 'rsc',
  });

  return stream;
});
