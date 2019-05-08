// document.getElementById('submitButton').addEventListener('click', () => {
//   const firstname = document.getElementById('firstName').value;
//   const lastname = document.getElementById('lastName').value;
//   const password = document.getElementById('password').value;
//   const email = document.getElementById('email').value;

//   const data = {
//     firstname, lastname, password, email,
//   };

//   fetch('http://localhost:4000/api/v2/auth/signup', {
//     method: 'POST',
//     headers: {
//       'Content-type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   })
//     .then((response) => {
//       response.json();
//     })
//     .then(async (result) => {
//       console.log(result);
//       const {
//         status, message, error, data,
//       } = result;
//       await localStorage.setItem('UserData', JSON.stringify(data));
//       if (status === 201) {
//         window.location = '../html/profile.html';
//       }
//     })
//     .catch(err => console.log(err));
// });

document.getElementById('signupUser').addEventListener('submit', signup);

function signup(e) {
  e.preventDefault();
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const password = document.getElementById('password').value;
  const email = document.getElementById('email').value;

  fetch('http://localhost:4000/api/v2/auth/signup', {
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
      console.log(result);
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
    });
}
