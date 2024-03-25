'use server';

import { createStorage } from 'unstorage';
import fsDriver from 'unstorage/drivers/fs-lite';

const storage = createStorage({
  driver: fsDriver({ base: './tmp' }),
});

/**
 * updateCount
 * @returns {number}
 */
export async function updateCount() {
  console.log('Client is updating the count. This is running on the server');

  await storage.setItem(
    'count',
    (Number(await storage.getItem('count')) ?? 0) + 1,
  );

  const nextCount = Number(await storage.getItem('count')) ?? 0;

  console.log(`Next Count is ${nextCount}`);

  return nextCount;
}

/**
 * getStore
 * @returns {number}
 */
export async function getStore() {
  return Number(await storage.getItem('count')) ?? 0;
}

/**
 * resetCount
 * @returns {void}
 */
export async function resetCount() {
  console.log('Client is resetting the count. Next count is 0');

  await storage.removeItem('count');
}
