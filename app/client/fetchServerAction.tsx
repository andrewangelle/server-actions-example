import { createFromFetch, encodeReply } from '@vinxi/react-server-dom/client';

type CallServerCB = (id: string, args: string[]) => Promise<void>;

const defaultCallServer: CallServerCB = (_id, _args) => {
  throw new Error('No server action handler');
};

export async function fetchServerAction(
  base: string,
  id: string,
  args: string[],
  callServer: CallServerCB = defaultCallServer,
) {
  const headers = {
    Accept: 'text/x-component',
    'server-action': id,
  };

  const body = await encodeReply(args);

  const response = fetch(base, {
    method: 'POST',
    headers,
    body,
  });

  const serverAction = await createFromFetch(response, {
    callServer,
  });

  return serverAction;
}
