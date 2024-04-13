'use client';

import { Counter } from './Counter';

export function ClientContainer({
  count,
  updateCount,
  resetCount,
  isError,
}: {
  isError: boolean;
  count?: number;
  updateCount?: () => void;
  resetCount?: () => void;
}) {
  return (
    <div>
      {isError && (
        <>
          <h1 className="m-auto text-center text-black">
            You got an error bitch
          </h1>

          <section className="p-8">
            <div className="m-auto text-center mb-4">
              Ain't no motherfuckin token here
            </div>
          </section>
        </>
      )}

      {!isError && (
        <>
          <h1 className="m-auto text-center text-black">
            React Server Components and Server Actions Demo
          </h1>

          <section className="p-8">
            <div className="m-auto text-center mb-4">
              Server Persisted Count: <strong>{count}</strong>
            </div>
            <Counter onChange={updateCount} resetCount={resetCount} />
          </section>
        </>
      )}
    </div>
  );
}
