// POST /api/admin/data - 管理员获取完整数据
const { readData } = require('../_db');
const { checkAdmin } = require('../_admin');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  checkAdmin(req, res, async () => {
    const data = await readData();
    res.json({
      success: true,
      gifts: data.gifts,
      opened: data.opened,
      codes: data.codes || {}
    });
  });
};
