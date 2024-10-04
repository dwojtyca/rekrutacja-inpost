import test from 'ava';

import { CORRECT } from './correctResult';
import { INCORRECT } from './currentResult';
import { getCategories } from './mockedApi';
import { categoryTree } from './task';

test('should pass', async (t) => {
  const result = await categoryTree(getCategories);
  t.deepEqual(result, CORRECT);
});

test('should fail', async (t) => {
  const result = await categoryTree(getCategories);
  t.notDeepEqual(result, INCORRECT);
});
