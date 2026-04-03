import Record from '../models/Record.js';
import { recordSchema } from '../validations/schemas.js';
import { Op } from 'sequelize';

// Create a new record
export const createRecord = async (req, res, next) => {
  try {
    const validatedData = recordSchema.parse(req.body);
    const record = await Record.create({
      ...validatedData,
      userId: req.user.id // Link to the logged-in user
    });

    res.status(201).json({ status: 'success', data: record });
  } catch (error) {
    next(error);
  }
};

// Get all records with filtering
export const getAllRecords = async (req, res, next) => {
  try {
    const { type, category, startDate, endDate, page = 1, limit = 10 } = req.query;
    
    // 1. Calculate Pagination values
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    const filter = {};

    // Logic: Viewers/Analysts see their own. Admins see everything.
    if (req.user.role !== 'Admin') {
      filter.userId = req.user.id;
    }

    // Dynamic Filtering
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate && endDate) {
      filter.date = { [Op.between]: [startDate, endDate] };
    }

    // 2. Use findAndCountAll to get both the data and total count
    const { count, rows } = await Record.findAndCountAll({
      where: filter,
      limit: limitNum,
      offset: offset,
      order: [['date', 'DESC']],
    });

    // 3. Send structured response
    res.status(200).json({
      status: 'success',
      results: rows.length,
      totalRecords: count,
      totalPages: Math.ceil(count / limitNum),
      currentPage: pageNum,
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};
// Update record
export const updateRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const record = await Record.findOne({ where: { id } });

    if (!record) return res.status(404).json({ message: 'Record not found' });

    // Access Check: Only owner or admin can update
    if (record.userId !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Unauthorized to update this record' });
    }

    await record.update(req.body);
    res.status(200).json({ status: 'success', data: record });
  } catch (error) {
    next(error);
  }
};

// Delete record
export const deleteRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const record = await Record.findOne({ where: { id } });

    if (!record) return res.status(404).json({ message: 'Record not found' });

    if (record.userId !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Unauthorized to delete' });
    }

    await record.destroy();
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
};