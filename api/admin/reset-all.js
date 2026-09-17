// POST /api/admin/reset-all - 重置所有数据
const { writeData, TOTAL, defaultData } = require('../_db');
const { checkAdmin } = require('../_admin');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  checkAdmin(req, res, async () => {
    const data = JSON.parse(JSON.stringify(defaultData));
    await writeData(data);
    res.json({ success: true });
  });
};
