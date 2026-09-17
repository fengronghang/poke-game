// GET /api/status - 获取游戏状态（公开）
const { readData, TOTAL } = require('./_db');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const data = await readData();

  res.json({
    total: TOTAL,
    opened: data.opened,
    gifts: data.opened.map((o, i) => o ? data.gifts[i] : ''),
    hasCodes: Object.keys(data.codes || {}).length > 0
  });
};
