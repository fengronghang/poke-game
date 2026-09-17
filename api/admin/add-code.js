// POST /api/admin/add-code - 添加口令
const { readData, writeData } = require('../_db');
const { checkAdmin } = require('../_admin');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  checkAdmin(req, res, async () => {
    const { name, count } = req.body;
    if (!name || !count || count < 1) {
      return res.json({ success: false, msg: '参数错误' });
    }
    const data = await readData();
    if (!data.codes) data.codes = {};
    if (data.codes[name]) {
      return res.json({ success: false, msg: '该口令已存在' });
    }
    data.codes[name] = { total: parseInt(count), used: 0 };
    await writeData(data);
    res.json({ success: true, codes: data.codes });
  });
};
