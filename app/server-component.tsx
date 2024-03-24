import { createFromFetch } from '@vinxi/react-server-dom/client';
import type * as React from 'react';
import { startTransition, use, useState } from 'react';

import { fetchServerAction } from './fetchServerAction';

let updateRoot: React.Dispatch<React.SetStateAction<JSX.Element>>;

declare global {
  interface Window {
    init_server: ReadableStream<Uint8Array> | null;
    chunk(chunk: string): Promise<void>;
  }
}

export function getServerElementStream(url: string) {
  let stream: { body: ReadableStream<Uint8Array> } | Promise<Response>;

  // Ideally we should have a readable stream inlined in the HTML
  if (window.init_server) {
    stream = { body: window.init_server };
    self.init_server = null;
  } else {
    stream = fetch(`/_rsc${url}`, {
      headers: {
        Accept: 'text/x-component',
        'x-navigate': url,
      },
    });
  }

  return stream;
}

export function ServerComponent({ url }: { url: string }) {
  const [root, setRoot] = useState(use(useServerElement(url)));
  updateRoot = setRoot;
  return root;
}

export const serverElementCache = /*#__PURE__*/ new Map<
  string,
  React.Thenable<JSX.Element>
>();

export function createCallServer(base: string) {
  return async function callServer(id: string, args: string[]) {
    const root = await fetchServerAction(base, id, args, callServer);

    // Refresh the tree with the new RSC payload.
    startTransition(() => {
      updateRoot(root);
    });

    // return returnValue;
  };
}

const callServer = createCallServer('/_rsc');

export function useServerElement(url: string) {
  if (!serverElementCache.has(url)) {
    serverElementCache.set(
      url,
      createFromFetch(getServerElementStream(url), {
        callServer,
      }),
    );
  }

  // biome-ignore lint/style/noNonNullAssertion: the if above handles it
  return serverElementCache.get(url)!;
}
