document.getElementById('signupUser').addEventListener('submit', signup);

function signup(e) {
  e.preventDefault();
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const password = document.getElementById('password').value;
  const email = document.getElementById('email').value;

  fetch('https://banka-c-3-db.herokuapp.com/api/v2/auth/signup', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      firstName, lastName, email, password,
    }),
  }).then(res => res.json())
    .then(async (result) => {
      // console.log(result);
      const {
        status, message, error, data,
      } = result;

      await localStorage.setItem('userData', JSON.stringify(data));
      if (status === 201) {
        window.location = '../html/profile.html';
      }
      if (status === 400) {
        document.getElementById('triggerPopup').style.display = 'block';
        document.getElementById('errors').innerHTML = error;
      }
    })
    .catch(err => console.log(err));
}
