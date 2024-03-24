import { createFromFetch, encodeReply } from '@vinxi/react-server-dom/client';

export async function fetchServerAction(
  base: string,
  id: string,
  args: string[],
  callServer: (id: string, args: string[]) => Promise<void> = (_id, _args) => {
    throw new Error('No server action handler');
  },
) {
  const response = fetch(base, {
    method: 'POST',
    headers: {
      Accept: 'text/x-component',
      'server-action': id,
    },
    body: await encodeReply(args),
  });

  return await createFromFetch(response, {
    callServer,
  });
}
