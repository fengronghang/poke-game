// 数据存储 - 使用 GitHub Gist
// 需要环境变量: GITHUB_TOKEN, GIST_ID

const TOTAL = 25;

const defaultData = {
  gifts: new Array(TOTAL).fill(''),
  opened: new Array(TOTAL).fill(false),
  codes: {}
};

async function readData() {
  const token = process.env.GITHUB_TOKEN;
  const gistId = process.env.GIST_ID;

  if (!token || !gistId) {
    // 没有配置 Gist，用内存存储（仅用于本地调试）
    if (!global._memoryData) {
      global._memoryData = JSON.parse(JSON.stringify(defaultData));
    }
    return global._memoryData;
  }

  try {
    const res = await fetch(`https://api.github.com/gists/${gistId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'poke-game'
      }
    });
    if (!res.ok) throw new Error('Gist read failed: ' + res.status);
    const gist = await res.json();
    const content = gist.files['poke-data.json'].content;
    return JSON.parse(content);
  } catch (e) {
    console.error('读取数据失败:', e.message);
    return JSON.parse(JSON.stringify(defaultData));
  }
}

async function writeData(data) {
  const token = process.env.GITHUB_TOKEN;
  const gistId = process.env.GIST_ID;

  if (!token || !gistId) {
    global._memoryData = data;
    return true;
  }

  try {
    const res = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'poke-game'
      },
      body: JSON.stringify({
        files: {
          'poke-data.json': {
            content: JSON.stringify(data, null, 2)
          }
        }
      })
    });
    if (!res.ok) throw new Error('Gist write failed: ' + res.status);
    return true;
  } catch (e) {
    console.error('保存数据失败:', e.message);
    return false;
  }
}

module.exports = { readData, writeData, TOTAL, defaultData };
