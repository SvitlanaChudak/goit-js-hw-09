import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const calendar = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');
const daysValue = document.querySelector('[data-days]');
const hoursValue = document.querySelector('[data-hours]');
const minutesValue = document.querySelector('[data-minutes]');
const secondsValue = document.querySelector('[data-seconds]');

let formatDate = null;
let timeDifference = 0;
let timerId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
    onClose(selectedDates) {
        console.log(selectedDates[0]);
        if (selectedDates[0] < Date.now()) {
            startBtn.setAttribute('disabled', true);
            Notify.failure('Please choose a date in the future');
        } else {
            startBtn.removeAttribute('disabled');
          startBtn.addEventListener('click', () => {
                startBtn.setAttribute('disabled', true);
                calendar.setAttribute('disabled', true);
                timerId = setInterval(startTimer, 1000);
                timeDifference = selectedDates[0].getTime() - Date.now();
            });
        }
  },
};

startBtn.setAttribute('disabled', true);

flatpickr(calendar, options);

function startTimer() {
    timeDifference -= 1000;
  if (timeDifference < 1000) {
    Notify.success('Time end');
    clearInterval(timerId);
  } else {
    formatDate = convertMs(timeDifference);
    renderDate(formatDate);
  }
}

function renderDate(formatDate) {
  secondsValue.textContent = formatDate.seconds;
  minutesValue.textContent = formatDate.minutes;
  hoursValue.textContent = formatDate.hours;
  daysValue.textContent = formatDate.days;
}

window.addEventListener('keydown', evt => {
  if (evt.code === 'Escape' && timerId) {
    clearInterval(timerId);

    calendar.removeAttribute('disabled');
    startBtn.setAttribute('disabled', true);

    secondsValue.textContent = '00';
    minutesValue.textContent = '00';
    hoursValue.textContent = '00';
    daysValue.textContent = '00';
  }
});

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = pad(Math.floor(ms / day));
  // Remaining hours
  const hours = pad(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = pad(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = pad(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
}
function pad(value) {
  return String(value).padStart(2, '0');
}







