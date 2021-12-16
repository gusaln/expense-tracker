import { Type } from '@sinclair/typebox';
import { TransferTransactionSchema } from '../../transactions/schemas';

const TransferSchema = Type.Omit(TransferTransactionSchema, ['type'], { $id: 'Transfer' });

export default TransferSchema;
