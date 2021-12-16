import { Type } from '@sinclair/typebox';

export default Type.Object({
  id: Type.Number(),
  name: Type.String({ minLength: 3, maxLength: 255 }),
  icon: Type.String({ minLength: 3, maxLength: 50 }),
  color: Type.String({ pattern: '/[#]([0-9a-f]{3}|[0-9a-f]{6})/' }),
  for_expenses: Type.Boolean(),
}, { $id: 'Category' });
