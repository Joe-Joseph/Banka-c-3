document.getElementById('create-account-form').style.marginTop = '105px';
document.getElementById('create-account').addEventListener('submit', createAccount);

const data = JSON.parse(localStorage.getItem('userData'));
// console.log(data);

function createAccount(e) {
  e.preventDefault();
  const accountType = document.getElementById('account-type').value;
  // console.log(accountType);

  fetch('https://banka-c-3-db.herokuapp.com/api/v2/accounts/', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      'Authorization': data.data.token,
    },
    body: JSON.stringify({ type: accountType }),
  }).then(res => res.json())
    .then(async (result) => {
      // console.log(result);

      const {
        status, error, message, data,
      } = result;

      if (status === 201) {
        document.getElementById('triggerPopup').style.display = 'block';
        document.getElementById('triggerPopup').style.background = 'rgb(22, 148, 113)';
        document.getElementById('errors').style.color = '#fff';
        document.getElementById('errors').style.lineHeight = '1.5em';
        document.getElementById('errors').innerHTML = message;
      }
      if (status === 400) {
        document.getElementById('triggerPopup').style.display = 'block';
        document.getElementById('errors').innerHTML = error;
      }
      if (status === 401) {
        document.getElementById('triggerPopup').style.display = 'block';
        document.getElementById('errors').innerHTML = error;
      }
    })
    .catch(err => console.log(err));
}
