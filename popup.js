
const applyButton = document.getElementById('go-to-apply')
const inputAttendanceButton = document.getElementById('input-attendance')

const jobcanInputURI = 'https://ssl.jobcan.jp/employee/attendance/edit'

applyButton.addEventListener('click', event => {
  window.open(jobcanInputURI)
})

inputAttendanceButton.addEventListener('click', event => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { operation: 'inputAttendance' }, response => {
        if (response && response.result && response.result === 'error') {
          console.error(response.error)
          return
        }
        // ...
      })
    })
})

window.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (tabs[0].url !== jobcanInputURI) {
      inputAttendanceButton.classList.add('disabled')
    } else {
      inputAttendanceButton.classList.remove('disabled')
    }
  })
})
