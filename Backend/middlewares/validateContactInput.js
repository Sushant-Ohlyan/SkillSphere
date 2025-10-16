const validateContactInput = (req, res, next) => {
  const { name, email, message } = req.body;
  if(!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format' });
  }
  next();
};

module.exports = validateContactInput;
