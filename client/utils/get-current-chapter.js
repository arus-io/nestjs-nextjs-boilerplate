const moment = require('moment');
const STEP_CHAPTERS = require('../../constants/step-chapters');

const getCurrentChapter = ({ dueDate, returnDate }) => {
  const ret = moment(returnDate);
  const due = moment(dueDate);
  const now = moment();
  let chapter = STEP_CHAPTERS.LEAVE;
  if (now > ret) {
    chapter = STEP_CHAPTERS.RETURN;
  } else if (now < due) {
    chapter = STEP_CHAPTERS.PRE_LEAVE;
  }

  return {
    chapter,
  };
};

module.exports = getCurrentChapter;
