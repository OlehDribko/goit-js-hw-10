import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import "izitoast/dist/css/iziToast.min.css";
import "flatpickr/dist/flatpickr.min.css";

const datetimePicker = document.getElementById('datetime-picker');
const startButton = document.querySelector('[data-start]');
startButton.disabled = true;
const elements = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

let userSelectedDate = null;
let timerInterval = null;

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor((ms % hour) / minute);
  const seconds = Math.floor((ms % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimer() {
  const now = new Date();
  const timeDifference = userSelectedDate - now;

  if (timeDifference <= 0) {
    clearInterval(timerInterval);
    resetTimerDisplay();
    datetimePicker.disabled = false; 
    startButton.disabled = true; 
    return;
  }

  const timeComponents = convertMs(timeDifference);
  elements.days.textContent = addLeadingZero(timeComponents.days);
  elements.hours.textContent = addLeadingZero(timeComponents.hours);
  elements.minutes.textContent = addLeadingZero(timeComponents.minutes);
  elements.seconds.textContent = addLeadingZero(timeComponents.seconds);
}

function resetTimerDisplay() {
  elements.days.textContent = '00';
  elements.hours.textContent = '00';
  elements.minutes.textContent = '00';
  elements.seconds.textContent = '00';
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const now = new Date();
    userSelectedDate = selectedDates[0];
    if (userSelectedDate < now) {
      iziToast.error({
        title: 'Please choose a date in the future',
        position: 'topRight',
      });
      startButton.disabled = true;
      userSelectedDate = null;
    } else {
      startButton.disabled = false;
    }
  },
};

flatpickr(datetimePicker, options);

startButton.addEventListener('click', () => {
  if (!userSelectedDate) return;

  if (timerInterval) {
    clearInterval(timerInterval);
  }

  datetimePicker.disabled = true; 
  startButton.disabled = true; 

  timerInterval = setInterval(updateTimer, 1000);
});
