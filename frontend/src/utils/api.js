export async function fetchConToken(url, options = {}) {
  let token = localStorage.getItem("token");

  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    credentials: "include"
  });

  if (res.status === 401) {
    const refreshRes = await fetch("https://trabajo-final-prog-iii.onrender.com/api/usuarios/refresh", {
      method: "POST",
      credentials: "include" 
    });
    const data = await refreshRes.json();
    token = data.token;
    localStorage.setItem("token", token);

    res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      credentials: "include"
    });
  }

  return res;
}
