/** @param {import('knex').Knex} knex */
exports.seed = async function (knex) {
  await knex.table('categories').insert([
    // Expense categories
    {
      name: 'Entertaiment', icon: 'tv', color: '#3d5afe', for_expenses: 1
    },
    {
      name: 'Food', icon: 'kitchen', color: '#4caf50', for_expenses: 1
    },
    {
      name: 'Health', icon: 'health_and_safety', color: '#f44336', for_expenses: 1
    },
    {
      name: 'House', icon: 'home', color: '#039be5', for_expenses: 1
    },
    {
      name: 'Other', icon: 'label', color: '#5c6bc0', for_expenses: 1
    },
    {
      name: 'Snacks', icon: 'local_pizza', color: '#ffeb3b', for_expenses: 1
    },
    // Income categories
    {
      name: 'Salary', icon: 'payments', color: '#b2ff59', for_expenses: 0
    },
    {
      name: 'Gift', icon: 'card_giftcard', color: '#f50057', for_expenses: 0
    },
    {
      name: 'Other', icon: 'label', color: '#5c6bc0', for_expenses: 0
    },
  ]);
};
