// POST /api/verify-code - 验证戳奖口令
const { readData } = require('./_db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;
  const data = await readData();

  if (!data.codes[code]) {
    return res.json({ success: false, msg: '口令不正确' });
  }
  const remain = data.codes[code].total - data.codes[code].used;
  if (remain <= 0) {
    return res.json({ success: false, msg: '这个口令的次数已经用完啦' });
  }
  res.json({ success: true, remain, name: code });
};
