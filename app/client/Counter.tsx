'use client';

import { useState } from 'react';

export function Counter({
  onChange,
  resetCount,
}: {
  onChange: () => void;
  resetCount: () => void;
}) {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        className="bg-blue-500 text-white py-2 px-2 rounded w-56"
        onClick={() => {
          setCount((c) => c + 1);
          onChange();
        }}
      >
        Client Side Count: {count}
      </button>

      <button
        type="button"
        className="bg-blue-500 text-white py-2 px-2 rounded w-56"
        onClick={() => {
          resetCount();
          setCount((_c) => 0);
        }}
      >
        Reset Server Count
      </button>
    </div>
  );
}
