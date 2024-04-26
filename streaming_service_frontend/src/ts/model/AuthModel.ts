export class AuthModel {
  constructor() {}

  async getToken(username: string, password: string): Promise<string | null> {
    return fetch(`${process.env.API_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        password: password,
      }),
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.access_token) {
          localStorage.setItem(
            'access_token',
            JSON.stringify(res.access_token),
          );
          localStorage.setItem('user_name', JSON.stringify(username));
          return null;
        } else return res.message;
      });
  }

  async registration(
    username: string,
    password: string,
  ): Promise<string | null> {
    return fetch(`${process.env.API_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        password: password,
        firstName: username,
        lastName: username,
      }),
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        return res.json();
      })
      .then(async (res) => {
        if (res.access_token) {
          localStorage.setItem(
            'access_token',
            JSON.stringify(res.access_token),
          );
          localStorage.setItem('user_name', JSON.stringify(username));

          for (let index = 0; index < 7; index++) {
            await fetch(`${process.env.API_URL}/playlists`, {
              method: 'POST',
              body: JSON.stringify({
                name: `Плейлист #${index + 1}`,
              }),
              headers: {
                accept: 'application/json',
                Authorization: `Bearer ${res.access_token}`,
                'Content-Type': 'application/json',
              },
            });
          }

          return null;
        } else return res.message;
      });
  }
}
