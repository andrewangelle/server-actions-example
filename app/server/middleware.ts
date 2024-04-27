import { defineMiddleware, setContext } from 'vinxi/http';

export default defineMiddleware({
  onRequest: (event) => {
    const token = event.headers.get('authorization');
    setContext(event, 'token', token);
  },
  onBeforeResponse: (event) => {
    // console.log('FROM MIDDLEWARE - onBeforeResponse', event.context)
  },
});
