import { Type } from '@sinclair/typebox';
import CategorySchema from './category.schema';

export default Type.Omit(CategorySchema, ['id'], { $id: 'CategoryNew' });
