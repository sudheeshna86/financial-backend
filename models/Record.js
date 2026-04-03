import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

const Record = sequelize.define('Record', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('Income', 'Expense'),
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false, // e.g., 'Salary', 'Rent', 'Food'
  },
  date: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  timestamps: true,
});

// Defining the Relationship
User.hasMany(Record, { foreignKey: 'userId', onDelete: 'CASCADE' });
Record.belongsTo(User, { foreignKey: 'userId' });

export default Record;