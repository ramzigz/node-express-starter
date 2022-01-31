import axios from 'axios';

export default async function getFacebookUserData(token) {
  const fbResponse = await axios({
    url: 'https://graph.facebook.com/me',
    method: 'get',
    params: {
      fields: ['id', 'email', 'first_name', 'last_name'].join(','),
      access_token: token,
    },
  });
  const { data, error } = fbResponse;
  if (data) return fbResponse.data;
  return error;
}
