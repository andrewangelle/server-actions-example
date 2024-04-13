import { ClientContainer } from '../client/ClientContainer';
import { getStore, resetCount, updateCount } from './actions';
import './style.css';

type AppProps = {
  assets: JSX.Element;
  isError?: boolean;
};

export default async function App({ assets, isError = false }: AppProps) {
  const count = await getStore();

  return (
    <html lang="en">
      <head>
        <base href="http://localhost:5000" />
        <link rel="icon" href="/favicon.ico" />
        {assets}
      </head>
      <body>
        <ClientContainer
          count={count}
          isError={isError}
          updateCount={updateCount}
          resetCount={resetCount}
        />
      </body>
    </html>
  );
}
