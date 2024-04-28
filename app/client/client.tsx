/// <reference types="vinxi/types/client" />
import { createModuleLoader } from '@vinxi/react-server-dom/runtime';
import { hydrateRoot } from 'react-dom/client';
import 'vinxi/client';
import { getManifest } from 'vinxi/manifest';

import { ServerComponent } from '../server/server-component';

globalThis.__vite__ = createModuleLoader({
  loadModule: async (id: string) => {
    return getManifest('client').chunks[id].import();
  },
});

const [_origin, id] = globalThis.location.pathname.split(
  window.location.origin,
);

globalThis.top.postMessage({ message: 'EPS host ready' }, '*');

globalThis.addEventListener('message', (event) => {
  if (event.data.token) {
    hydrateRoot(
      document,
      <ServerComponent url={id} token={event.data.token} />,
    );
  }
});
