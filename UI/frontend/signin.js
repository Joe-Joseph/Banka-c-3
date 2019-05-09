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
      const {
        status, message, error, data,
      } = result;

      await localStorage.setItem('userData', JSON.stringify(data));

      if (status === 404) {
        document.getElementById('triggerPopup').style.display = 'block';
        document.getElementById('errors').innerHTML = error;
      }
      if (status === 400) {
        document.getElementById('triggerPopup').style.display = 'block';
        document.getElementById('errors').innerHTML = error;
      }
      if (status === 200) {
        if (result.type === 'staff' && !result.isAdmin) {
          window.location = '../html/staff.html';
        }
        if (result.isAdmin) {
          window.location = '../html/admin.html';
        }
        if (result.type === 'user') {
          window.location = '../html/profile.html';
        }
      }
    })
    .catch(err => console.log(err));
}
