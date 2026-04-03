import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { userSchema, loginSchema } from '../validations/schemas.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

export const register = async (req, res, next) => {
  try {
    // Validate input with Zod
    const validatedData = userSchema.parse(req.body);

    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    const newUser = await User.create({
      ...validatedData,
      password: hashedPassword,
    });

    res.status(201).json({
      status: 'success',
      token: generateToken(newUser.id),
      data: { user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } }
    });
  } catch (error) {
    next(error);
  }
};
export const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, role } = req.body; 

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.update({ status, role });
    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    next(error);
  }
};
export const login = async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.status === 'Inactive') {
      return res.status(403).json({ message: 'Your account is deactivated' });
    }

    res.status(200).json({
      status: 'success',
      token: generateToken(user.id),
      data: { user: { id: user.id, name: user.name, role: user.role } }
    });
  } catch (error) {
    next(error);
  }
};