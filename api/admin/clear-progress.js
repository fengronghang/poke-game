// POST /api/admin/clear-progress - 清空戳奖记录
const { readData, writeData, TOTAL } = require('../_db');
const { checkAdmin } = require('../_admin');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  checkAdmin(req, res, async () => {
    const data = await readData();
    data.opened = new Array(TOTAL).fill(false);
    if (data.codes) {
      for (const name in data.codes) {
        data.codes[name].used = 0;
      }
    }
    await writeData(data);
    res.json({ success: true });
  });
};
