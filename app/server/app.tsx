import { Counter } from '../client/Counter';
import { getStore, resetCount, updateCount } from './actions';
import './style.css';

export default function App({ assets }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        {assets}
      </head>
      <body>
        <h1 className="m-auto text-center text-black">
          React Server Components and Server Actions Demo
        </h1>

        <section className="p-8">
          <div className="m-auto text-center mb-4">
            Server Persisted Count: <strong>{getStore()}</strong>
          </div>
          <Counter onChange={updateCount} resetCount={resetCount} />
        </section>
      </body>
    </html>
  );
}
