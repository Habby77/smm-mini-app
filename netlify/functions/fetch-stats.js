const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { profileUrl } = JSON.parse(event.body);
  const username = profileUrl.split('/').filter(Boolean).pop();

  try {
    // Пример запроса к неофициальному Instagram API
    const res = await fetch(`https://www.instagram.com/${username}/?__a=1`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();

    const user = json.graphql.user;
    const stats = {
      followers: user.edge_followed_by.count,
      following: user.edge_follow.count,
      posts: user.edge_owner_to_timeline_media.count
    };

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, stats })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
