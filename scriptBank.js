'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2025-02-24T21:31:17.178Z',
    '2024-05-23T07:42:02.383Z',
    '2022-01-28T09:15:04.904Z',
    '2022-04-01T10:17:24.185Z',
    '2022-06-08T14:11:59.604Z',
    '2023-09-26T17:01:17.194Z',
    '2023-08-28T23:36:17.929Z',
    '2021-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2024-11-01T13:15:33.035Z',
    '2024-11-30T09:48:16.867Z',
    '2023-12-25T06:04:23.907Z',
    '2023-01-25T14:18:46.235Z',
    '2023-02-05T16:33:06.386Z',
    '2021-04-10T14:43:26.374Z',
    '2021-06-25T18:49:59.371Z',
    '2021-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2025-01-18T21:31:17.178Z',
    '2024-12-23T07:42:02.383Z',
    '2024-01-28T09:15:04.904Z',
    '2024-04-01T10:17:24.185Z',
    '2023-05-08T14:11:59.604Z',
    '2023-07-26T17:01:17.194Z',
    '2022-07-28T23:36:17.929Z',
    '2022-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2022-11-01T13:15:33.035Z',
    '2022-10-30T09:48:16.867Z',
    '2022-12-25T06:04:23.907Z',
    '2023-02-25T14:18:46.235Z',
    '2023-03-05T16:33:06.386Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnHome = document.querySelector('.btnHome');
const btnLogin2 = document.querySelector('.login2');
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const input2 = document.querySelector('.input2');
const pin2 = document.querySelector('.pin2');
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const mainPage = document.querySelector('.mainPage');
const accountPage = document.querySelector('.accountPage');

btnHome.addEventListener('click', function (e) {
  e.preventDefault();
  accountPage.style.display = 'none';
  mainPage.style.display = 'block';
  closeModal();
});

function calcDate(date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
}

function displayMovements(account, sort = false) {
  containerMovements.innerHTML = '';

  const combinedMovsDates = account.movements.map((mov, i) => ({
    movement: mov,
    movementDate: account.movementsDates.at(i),
  }));

  if (sort) combinedMovsDates.sort((a, b) => a.movement - b.movement);
  combinedMovsDates.forEach(function (obj, i) {
    const { movement, movementDate } = obj;
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(movementDate);
    const displayDate = calcDate(date, account.locale);

    // const formattedMov = formatCur(movement, account.locale, account.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${movement.toFixed(2)}$</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

function calcPrintBalance(account) {
  account.balance = account.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = ` ${account.balance.toFixed(2)}$`;
}

function clacDisplaySummary(account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);

  const outcomes = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * account.interestRate) / 100)
    .filter(mov => mov >= 1)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumIn.textContent = `${incomes.toFixed(2)}$`;
  labelSumOut.textContent = `${Math.abs(outcomes).toFixed(2)}$`;
  labelSumInterest.textContent = `${interest.toFixed(2)}$`;
}

function createUserName(accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
}

createUserName(accounts);

let currentAccount, timer;

function loginContent() {
  //Diplay Ui and message
  labelWelcome.textContent = `Welcome back  ${
    currentAccount.owner.split(' ')[0]
  }`;
  accountPage.style.display = 'block';
  mainPage.style.display = 'none';
  containerApp.style.display = 'grid';

  // Display the Current Date

  const now = new Date();
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  };
  const currentDate = new Intl.DateTimeFormat(
    currentAccount.locale,
    options
  ).format(now);

  labelDate.textContent = currentDate;

  if (timer) clearInterval(timer);
  timer = logoutTimer();

  // Display
  display(currentAccount);
}

// BTN LOGINS

btnLogin2.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === input2.value);

  if (currentAccount?.pin === +pin2.value) {
    loginContent();
    clear(input2, pin2);
  }
});

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('jawad');
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value || input2.value
  );

  if (currentAccount?.pin === +inputLoginPin.value || +pin2.value) {
    loginContent();
    clear(inputLoginPin, inputLoginUsername);
  }
});

// Transfer

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const reciverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    reciverAccount &&
    amount > 0 &&
    currentAccount.balance >= amount &&
    reciverAccount.username !== currentAccount.username
  ) {
    reciverAccount.movements.push(amount);
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    reciverAccount.movementsDates.push(new Date().toISOString());
    display(currentAccount);
    clear(inputTransferAmount, inputTransferTo);

    // Reset Timer
    clearInterval(timer);
    timer = logoutTimer();
  }
});

// Loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(acc => acc > amount * 0.1)) {
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      // ubdate UI
      display(currentAccount);
    }, 2500);

    clear(inputLoanAmount, inputClosePin);

    // Reset Timer
    clearInterval(timer);
    timer = logoutTimer();
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // Delete account
    accounts.splice(index, 1);
    // Hide UI
    containerApp.style.display = 'none';
  }
  // Clear inputs
  clear(inputCloseUsername, inputClosePin);
});

function clear(input1, input2) {
  input1.value = input2.value = '';
  input1.blur();
  input2.blur();
}

function display(cur) {
  // Display movements
  displayMovements(cur);
  // Display balance

  calcPrintBalance(cur);
  // Display summary
  clacDisplaySummary(cur);
}

// Sort
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  // BUG in video:
  // displayMovements(currentAccount.movements, !sorted);

  // FIX:
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// logout Timer
function logoutTimer() {
  let time = 300;
  function tick() {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.display = 'none';
    }

    time--;
  }
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
}
