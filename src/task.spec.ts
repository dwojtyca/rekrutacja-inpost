import test from 'ava';

import { CORRECT } from './correctResult';
import { INCORRECT } from './currentResult';
import { categoryTree } from './task';

test('should pass', async (t) => {
  const result = await categoryTree();
  t.deepEqual(result, CORRECT);
});

test('should fail', async (t) => {
  const result = await categoryTree();
  t.notDeepEqual(result, INCORRECT);
});
