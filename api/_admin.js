// 管理员验证中间件
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

function checkAdmin(req, res, next) {
  const pwd = req.headers['x-admin-password'] || (req.body && req.body.password);
  if (pwd !== ADMIN_PASSWORD) {
    return res.json({ success: false, msg: '管理员密码错误' });
  }
  next();
}

module.exports = { checkAdmin, ADMIN_PASSWORD };
