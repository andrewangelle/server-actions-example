import { decodeReply } from '@vinxi/react-server-dom/server';
import type { ReactNode } from 'react';
import type { H3Event } from 'vinxi/http';
import { getManifest } from 'vinxi/manifest';

export async function handleServerActionRequest(event: H3Event) {
  const manifest = getManifest('rsc');
  const serverReference = event.headers.get('server-action');

  if (serverReference) {
    // This is the client-side case
    const [filepath, name] = serverReference.split('#');
    const action = (await manifest.chunks[filepath].import())[name];

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

/**
 *
 * Assets Utils
 */

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

export async function getServerAssets() {
  const reactServerManifest = getManifest('rsc');

  const serverAssetsFromManifest = (await reactServerManifest.inputs[
    reactServerManifest.handler
  ].assets()) as unknown as ManifestAsset[];

  return serverAssetsFromManifest.filter(isLinkOrStyles);
}

export async function getClientAssets() {
  const clientManifest = getManifest('client');

  const clientAssets = (await clientManifest.inputs[
    clientManifest.handler
  ].assets()) as unknown as ManifestAsset[];

  return clientAssets;
}
