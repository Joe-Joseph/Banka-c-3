document.getElementById('signinUser').addEventListener('submit', signin);

function signin(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const data = { email, password };
  fetch('https://banka-c-3-db.herokuapp.com/api/v2/auth/signin', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(res => res.json())
    .then(async (result) => {
      // console.log(result.status);
      const {
        status, message, error, data,
      } = result;

      await localStorage.setItem('userData', JSON.stringify(result));
      // console.log(status);

      if (status === 404) {
        document.getElementById('triggerPopup').style.display = 'block';
        document.getElementById('errors').innerHTML = error;
      }
      if (status === 400) {
        document.getElementById('triggerPopup').style.display = 'block';
        document.getElementById('errors').innerHTML = error;
      }
      if (status === 200) {
        if (data.type === 'staff' && !data.isAdmin) {
          window.location = '../html/staff.html';
        }
        if (data.isAdmin) {
          window.location = '../html/admin.html';
        }
        if (data.type === 'user') {
          window.location = '../html/profile.html';
        }
      }
    })
    .catch(err => console.log(err));
}
