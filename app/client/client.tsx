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

// This should come from consumer
const token = 'Bearer 12345';

const [_origin, id] = window.location.pathname.split(window.location.origin);

hydrateRoot(document, <ServerComponent url={id} token={token} />);
