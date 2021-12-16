import { Type } from '@sinclair/typebox';
import { Router } from 'express';
import validate from '../middlewares/validate.middleware';
import { createCategory, deleteCategory, findCategoryById, listCategories, ListCategoriesFilters, updateCategory } from './queries';
import CategoryNewSchema from './schemas/categoryNew.schema';
import CategoryUpdateSchema from './schemas/categoryUpdate.schema';
import ListCategoriesFiltersSchema from './schemas/listCategoriesFilters.schema';

const categoryRoutes = Router();

const ParamsSchema = Type.Object({ category: Type.Number() });

// List categories handler
categoryRoutes.get(
  '/',
  validate({ query: ListCategoriesFiltersSchema }),
  async (req, res, next) => {
    try {
      const filters: ListCategoriesFilters = {};

      if (req.query.for_expenses) {
        req.query.for_expenses = req.query.for_expenses.trim();

        filters.for_expenses = req.query.for_expenses === ''
          ? filters.for_expenses = undefined
          : ['1', 'yes', 'true'].includes(req.query.for_expenses);
      }

      const categories = await listCategories(filters);

      res.json({
        data: categories,
        total: categories.length
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get a category handler
categoryRoutes.get('/:category', async (req, res, next) => {
  try {
    const category = await findCategoryById(req.params.category);

    res.json({ data: category });
  } catch (error) {
    next(error);
  }
});

// Create categories handler
categoryRoutes.post(
  '/',
  validate({ body: CategoryNewSchema }),
  async (req, res, next) => {
    try {
      const category = await createCategory({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
        for_expenses: Boolean(req.body.for_expenses)
      });

      res.status(201).json({ data: category });
    } catch (error) {
      next(error);
    }
  }
);

// Edit category handler
categoryRoutes.put(
  '/:category',
  validate({ params: ParamsSchema, body: CategoryUpdateSchema }),
  async (req, res, next) => {
    try {
      const category = await updateCategory(req.params.category, {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
      });

      res.status(201).json({ data: category });
    } catch (error) {
      next(error);
    }
  }
);

// Delete category handler
categoryRoutes.delete(
  '/:category',
  async (req, res, next) => {
    try {
      await deleteCategory(req.params.category);

      res.status(204).json();
    } catch (error) {
      next(error);
    }
  }
);

export default categoryRoutes;
