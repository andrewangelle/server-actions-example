import { defineMiddleware, setContext, setHeader } from 'vinxi/http';

export default defineMiddleware({
  onRequest: (event) => {
    const token = event.headers.get('authorization');

    if (!token) {
      throw new Error('Unauthorized');
    }

    setContext(event, 'token', token);
  },
  onBeforeResponse: (event) => {
    setHeader(event, 'Access-Control-Allow-Origin', '*');
    setHeader(event, 'Mid-Check', 'Test');
  },
});
