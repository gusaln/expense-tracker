const db = require('../../database/connection');
const ApiError = require('../errors/ApiError');
const RecordNotFound = require('../errors/RecordNotFound');

const transformDbRecordToCategory = (dbCategory) => ({
  id: Number(dbCategory.id),
  name: dbCategory.name,
  icon: dbCategory.icon,
  color: dbCategory.color,
  for_expenses: Boolean(dbCategory.for_expenses),
});

const isInvalidId = (id) => Number.isNaN(parseInt(id, 10));

/**
 * Lists all the categories
 */
const listCategories = async (filters = {}) => {
  const builder = db.select().from('categories');

  if (typeof filters.for_expenses === 'boolean') {
    builder.where('for_expenses', filters.for_expenses);
  }

  const categories = await builder;

  return categories.map(transformDbRecordToCategory);
};

/**
 * Finds an categories by its id
 *
 * @param {string|number} id
 * @throws A RecordNotFound error if the category does not exist.
 */
const findCategoryById = async (id) => {
  if (isInvalidId(id)) {
    throw new RecordNotFound(`Category ID ${id} not found.`);
  }

  const categories = await db.table('categories').where({ id }).limit(1);

  if (categories.length === 0) {
    throw new RecordNotFound(`Category ID ${id} not found.`);
  }

  return transformDbRecordToCategory(categories[0]);
};

/**
 * Finds multiple categories by its their ids
 *
 * @param {string[]|number[]} ids
 * @throws A RecordNotFound error if the category does not exist.
 */
const findMultipleCategoriesById = async (ids) => {
  ids = Array.isArray(ids) ? ids : [ids];

  ids.forEach((id) => {
    if (isInvalidId(id)) {
      throw new RecordNotFound(`Category ID ${id} not found.`);
    }
  });
  const categories = await db.table('categories').whereIn('id', ids);

  if (categories.length !== ids.length) {
    throw new RecordNotFound(`Category IDs ${ids} not found.`);
  }

  return categories.map(transformDbRecordToCategory);
};

/**
 * Persistes an categories to the database
 *
 * @param {object} data
 */
const createCategory = async (data) => {
  const newCategories = await db.table('categories')
    .insert({
      name: data.name,
      icon: data.icon,
      color: data.color,
      for_expenses: data.for_expenses,
    })
    .returning('*');

  return transformDbRecordToCategory(newCategories[0]);
};

/**
 * Updates an category.
 *
 * Note that whether a caregory
 *
 * @param {number} id
 * @param {object} data
 * @throws A RecordNotFound error if the category does not exist.
 */
const updateCategory = async (id, data) => {
  // Checks if category exists
  await findCategoryById(id);

  const updatedCategories = await db.table('categories')
    .where({ id })
    .update({
      name: data.name,
      icon: data.icon,
      color: data.color,
    })
    .returning('*');

  return transformDbRecordToCategory(updatedCategories[0]);
};

/**
 * Deletes an category
 *
 * @param {number} id
 * @throws A RecordNotFound error if the category does not exist.
 */
const deleteCategory = async (id) => {
  // Checks if category exists
  await findCategoryById(id);

  const transactionsInCount = await db.count('id').from('transactions').where('category_id', id);
  if (transactionsInCount[0].count > 0) {
    throw new ApiError("There are transactions in this category. As long as there are, the category can't be deleted.", 400);
  }

  await db.table('categories').where({ id }).del();
};

module.exports = {
  listCategories,
  findCategoryById,
  findMultipleCategoriesById,
  createCategory,
  updateCategory,
  deleteCategory,
};
