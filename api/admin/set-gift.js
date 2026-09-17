// POST /api/admin/set-gift - 设置单个格子奖品
const { readData, writeData, TOTAL } = require('../_db');
const { checkAdmin } = require('../_admin');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  checkAdmin(req, res, async () => {
    const { index, content } = req.body;
    if (typeof index !== 'number' || index < 0 || index >= TOTAL) {
      return res.json({ success: false, msg: '无效的格子' });
    }
    const data = await readData();
    data.gifts[index] = String(content || '');
    await writeData(data);
    res.json({ success: true });
  });
};
