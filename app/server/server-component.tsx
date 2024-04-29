import { createFromFetch } from '@vinxi/react-server-dom/client';
import {
  type Dispatch,
  type SetStateAction,
  type Thenable,
  startTransition,
  use,
  useState,
} from 'react';

import { fetchServerAction } from '../client/fetchServerAction';

let updateRoot: Dispatch<SetStateAction<JSX.Element>>;

declare global {
  interface Window {
    init_server: ReadableStream<Uint8Array> | null;
    chunk(chunk: string): Promise<void>;
  }
}

export function getServerElementStream(url: string, token: string) {
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
        Authorization: token,
      },
    });
  }

  return stream;
}

export function ServerComponent({
  url,
  token,
}: { url: string; token: string }) {
  const [root, setRoot] = useState(use(useServerElement(url, token)));
  updateRoot = setRoot;
  return root;
}

export const serverElementCache = /*#__PURE__*/ new Map<
  string,
  Thenable<JSX.Element>
>();

export function createCallServer(base: string, token: string) {
  return async function callServer(id: string, args: string[]) {
    const root = await fetchServerAction(base, id, args, token, callServer);

    // Refresh the tree with the new RSC payload.
    startTransition(() => {
      updateRoot(root);
    });

    // return returnValue;
  };
}

const callServer = (token: string) => createCallServer('/_rsc', token);

export function useServerElement(url: string, token: string) {
  if (!serverElementCache.has(url)) {
    serverElementCache.set(
      url,
      createFromFetch(getServerElementStream(url, token), {
        callServer: callServer(token),
      }),
    );
  }

  // biome-ignore lint/style/noNonNullAssertion: the if above handles it
  return serverElementCache.get(url)!;
}
