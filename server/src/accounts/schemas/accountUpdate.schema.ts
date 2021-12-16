import { Type } from '@sinclair/typebox';
import AccountSchema from './account.schema';

export default Type.Pick(AccountSchema, ['name', 'color', 'icon'], { $id: 'AccountUpdate' });