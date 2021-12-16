import { Type } from '@sinclair/typebox';
import IncomeSchema from './income.schema';

export default Type.Omit(IncomeSchema, ['id', 'created_at', 'updated_at'], { $id: 'IncomeNew' });