/**
 * Jobcan content script
 * This script will work on https://ssl.jobcan.jp
 */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    switch (request.operation) {
      case 'inputAttendance':
        inputAttendance()
        break
      default:
        throw new Error(`There is no operation: ${request.operation}`)
    }
    sendResponse({ result: 'ok' })
  } catch (error) {
    sendResponse({ result: 'error', error: error.message })
  }

})

/**
 * Input attendance data to Jobcan 出退勤編集 page
 */
function inputAttendance() {
  const { starts, ends } = extractInputsFromTable(document.querySelector('.note'))

  for (const input of starts) {
    if (input.value) {
      continue
    }
    input.value = getWorkStartedAt()
  }

  for (const input of ends) {
    if (input.value) {
      continue
    }
    input.value = getWorkEndedAt()
  }
}


function extractInputsFromTable(table) {
  const trs = Array.from(document.querySelectorAll('input[name^=start]'))
    .map(el => el.closest('tr'))
    .filter(el => {
      const date = el.querySelector('td:nth-child(4)').textContent
      return !date.includes('休')
    })

  return {
    starts: trs.map(el => el.querySelector('input[name^=start]')),
    ends: trs.map(el => el.querySelector('input[name^=end]'))
  }
}

/**
 * Get work start time
 * @return {string} "HH:mm" format string
 */
function getWorkStartedAt() {
  const dummyDay = '2019-01-01'
  const range = ['10:00', '11:00']

  const from = moment(`${dummyDay} ${range[0]}`)
  const until = moment(`${dummyDay} ${range[1]}`)

  return getRangedWorkingTime(from, until).format('HH:mm')
}

/**
 * Get work end time
 * @return {string} "HH:mm" format string
 */
function getWorkEndedAt() {
  const dummyDay = '2019-01-01'
  const range = ['20:00', '21:00']
  
  const from = moment(`${dummyDay} ${range[0]}`)
  const until = moment(`${dummyDay} ${range[1]}`)

  return getRangedWorkingTime(from, until).format('HH:mm')
}

/**
 * Get ranged working time
 * 
 * @param {Moment} from
 * @param {Moment} until
 * @return {Moment}
 */
function getRangedWorkingTime(from, until) {
  const diffSec = until.diff(from) / 1000 * Math.random()
  return moment(from).add(diffSec, 'seconds')
}
