import Record from '../models/Record.js';
import sequelize from '../config/db.js';
import { Op } from 'sequelize';

export const getSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'Admin';
    
    // Base filter: Admins see global stats, others see their own
    const filter = isAdmin ? {} : { userId };

    // 1. Calculate Totals (Income, Expense, Net)
    const stats = await Record.findAll({
      where: filter,
      attributes: [
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN type = 'Income' THEN amount ELSE 0 END")), 'totalIncome'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN type = 'Expense' THEN amount ELSE 0 END")), 'totalExpense'],
      ],
      raw: true
    });

    const totalIncome = parseFloat(stats[0].totalIncome || 0);
    const totalExpense = parseFloat(stats[0].totalExpense || 0);
    const netBalance = totalIncome - totalExpense;

    // 2. Category-wise Totals
    const categoryTotals = await Record.findAll({
      where: filter,
      attributes: [
        'category',
        'type',
        [sequelize.fn('SUM', sequelize.col('amount')), 'total']
      ],
      group: ['category', 'type'],
      raw: true
    });

    // 3. Recent Activity (Last 5 transactions)
    const recentActivity = await Record.findAll({
      where: filter,
      limit: 5,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      status: 'success',
      data: {
        summary: {
          totalIncome,
          totalExpense,
          netBalance
        },
        categoryBreakdown: categoryTotals,
        recentActivity
      }
    });
  } catch (error) {
    next(error);
  }
};