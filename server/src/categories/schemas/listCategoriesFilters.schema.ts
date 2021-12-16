import { Type } from '@sinclair/typebox';

export default Type.Object({
  for_expenses: Type.Optional(Type.String())
}, { $id: 'ListCategoriesFilters' });
