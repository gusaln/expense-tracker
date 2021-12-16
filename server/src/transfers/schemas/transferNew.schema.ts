import { Type } from '@sinclair/typebox';
import TransferSchema from './transfer.schema';

export default Type.Omit(TransferSchema, ['id', 'created_at', 'updated_at'], { $id: 'TransferNew' });