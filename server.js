import app from './app.js';
import sequelize from './config/db.js';
import User from './models/User.js';
import Record from './models/Record.js';
import './models/User.js'; 


const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // sync() will create tables in Supabase if they don't exist
    await sequelize.authenticate();
    console.log('✅ Supabase PostgreSQL Connection established.');
    
    await sequelize.sync({ alter: true }); 
    console.log('✅ Database models synchronized.');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

startServer();