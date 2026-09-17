// POST /api/admin/del-code - 删除口令
const { readData, writeData } = require('../_db');
const { checkAdmin } = require('../_admin');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  checkAdmin(req, res, async () => {
    const { name } = req.body;
    const data = await readData();
    if (data.codes && data.codes[name]) {
      delete data.codes[name];
      await writeData(data);
    }
    res.json({ success: true, codes: data.codes || {} });
  });
};
