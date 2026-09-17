// POST /api/poke - 戳开格子
const { readData, writeData, TOTAL } = require('./_db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { index, code } = req.body;

  if (typeof index !== 'number' || index < 0 || index >= TOTAL) {
    return res.json({ success: false, msg: '无效的格子' });
  }

  const data = await readData();

  if (data.opened[index]) {
    return res.json({ success: false, msg: '这个格子已经被戳开啦' });
  }

  const codeNames = Object.keys(data.codes || {});
  if (codeNames.length > 0) {
    if (!code) {
      return res.json({ success: false, msg: '需要口令才能戳奖', needCode: true });
    }
    if (!data.codes[code]) {
      return res.json({ success: false, msg: '口令不正确' });
    }
    const remain = data.codes[code].total - data.codes[code].used;
    if (remain <= 0) {
      return res.json({ success: false, msg: '这个口令的次数已经用完啦' });
    }
    data.codes[code].used++;
  }

  data.opened[index] = true;
  const gift = data.gifts[index] || '什么都没有～';

  await writeData(data);

  const result = {
    success: true,
    gift,
    index,
    openedCount: data.opened.filter(x => x).length
  };

  if (code && data.codes[code]) {
    result.remainCount = data.codes[code].total - data.codes[code].used;
  }

  res.json(result);
};
