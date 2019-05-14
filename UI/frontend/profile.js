const userInfo = JSON.parse(localStorage.getItem('userData'));
console.log(userInfo);

const firstName = document.getElementById('fname');
const lastName = document.getElementById('lname');
const email = document.getElementById('email');
const type = document.getElementById('type');
const isAdmin = document.getElementById('isAdmin');

firstName.innerHTML = `First name: ${userInfo.data.firstName}`;
lastName.innerHTML = `Last name: ${userInfo.data.lastName}`;
email.innerHTML = `Email: ${userInfo.data.email}`;
