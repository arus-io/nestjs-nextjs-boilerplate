const moment = require('moment');
const timekeeper = require('timekeeper');
const STEP_CHAPTERS = require('../../constants/step-chapters');
const getCurrentChapter = require('./get-current-chapter');

const dueDate = moment('12/10/19', 'MM/DD/YY').toISOString();
const returnDate = moment('3/10/20', 'MM/DD/YY').toISOString();

const preLeaveTestData = [
  { date: '12/03/19' },
  { date: '11/26/19' },
  { date: '11/19/19' },
  { date: '11/12/19' },
  { date: '11/05/19' },
  { date: '10/29/19' },
  { date: '10/22/19' },
  { date: '10/15/19' },
  { date: '10/8/19' },
  { date: '10/01/19' },
  { date: '9/24/19' },
  { date: '9/17/19' },
  { date: '9/10/19' },
  { date: '9/03/19' },
  { date: '8/27/19' },
  { date: '8/20/19' },
  { date: '8/13/19' },
  { date: '8/6/19' },
  { date: '7/30/19' },
  { date: '7/23/19' },
  { date: '7/16/19' },
  { date: '7/09/19' },
  { date: '7/02/19' },
  { date: '6/25/19' },
  { date: '6/18/19' },
  { date: '6/11/19' },
  { date: '6/04/19' },
  { date: '5/28/19' },
];

const onLeaveTestData = [
  { date: '12/10/19' },
  { date: '12/17/19' },
  { date: '12/24/19' },
  { date: '12/31/19' },
  { date: '1/7/20' },
  { date: '1/14/20' },
  { date: '1/21/20' },
  { date: '1/28/20' },
  { date: '2/4/20' },
  { date: '2/11/20' },
  { date: '2/18/20' },
  { date: '2/25/20' },
  { date: '3/3/20' },
];

const returnTestData = [{ date: '3/10/20' }, { date: '3/17/20' }, { date: '3/24/20' }, { date: '3/31/20' }];

preLeaveTestData.forEach((preLeave) => {
  it(`should get chapter EXPECTING when date is ${preLeave.date}`, () => {
    timekeeper.freeze(+moment(preLeave.date, 'MM/DD/YY') + 1);
    const { chapter } = getCurrentChapter({ dueDate, returnDate });

    expect(chapter).toBe(STEP_CHAPTERS.PRE_LEAVE);

    timekeeper.reset();
  });

  it(`should get chapter EXPECTING when date is ${preLeave.date} with added hours and seconds`, () => {
    const days = Math.round(Math.random() * 4 + 1);
    const hours = Math.round(Math.random() * 20 + 1);
    const now = moment(preLeave.date, 'MM/DD/YY').add(days, 'days').add(hours, 'hours');
    timekeeper.freeze(+now);
    const { chapter } = getCurrentChapter({ dueDate, returnDate });

    expect(chapter).toBe(STEP_CHAPTERS.PRE_LEAVE);

    timekeeper.reset();
  });
});

onLeaveTestData.forEach((leave) => {
  it(`should get chapter LEAVE when date is ${leave.date}`, () => {
    timekeeper.freeze(+moment(leave.date, 'MM/DD/YY') + 1);
    const { chapter } = getCurrentChapter({ dueDate, returnDate });

    expect(chapter).toBe(STEP_CHAPTERS.LEAVE);

    timekeeper.reset();
  });

  it(`should get chapter LEAVE when date is ${leave.date} with added hours and seconds`, () => {
    const days = Math.round(Math.random() * 4 + 1);
    const hours = Math.round(Math.random() * 20 + 1);
    const now = moment(leave.date, 'MM/DD/YY').add(days, 'days').add(hours, 'hours');
    timekeeper.freeze(+now);
    const { chapter } = getCurrentChapter({ dueDate, returnDate });

    expect(chapter).toBe(STEP_CHAPTERS.LEAVE);

    timekeeper.reset();
  });
});

returnTestData.forEach((retData) => {
  it(`should get chapter RETURN when date is ${retData.date}`, () => {
    timekeeper.freeze(+moment(retData.date, 'MM/DD/YY') + 1);
    const { chapter } = getCurrentChapter({ dueDate, returnDate });

    expect(chapter).toBe(STEP_CHAPTERS.RETURN);

    timekeeper.reset();
  });

  it(`should get chapter RETURN when date is ${retData.date} with added hours and seconds`, () => {
    const days = Math.round(Math.random() * 4 + 1);
    const hours = Math.round(Math.random() * 20 + 1);
    const now = moment(retData.date, 'MM/DD/YY').add(days, 'days').add(hours, 'hours');
    timekeeper.freeze(+now);
    const { chapter } = getCurrentChapter({ dueDate, returnDate });

    expect(chapter).toBe(STEP_CHAPTERS.RETURN);

    timekeeper.reset();
  });
});
