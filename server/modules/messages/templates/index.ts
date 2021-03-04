import * as fs from 'fs';
//export * from './templates';

const baseTemplate = fs
  .readFileSync(__dirname + '/_base_template.html', 'utf8')
  .replace(/\t/g, '')
  .replace(/\n/g, '');

export function hydrateTemplate(
  template: { html: string; subject?: string; sms?: string },
  params,
): {
  sms: string;
  subject: string;
  html: string;
  innerBody: string;
} {
  let htmlWithoutBase = template.html;
  let subject = template.subject;
  let sms = template.sms || '';
  if (params && Object.keys(params).length > 0) {
    Object.keys(params).forEach((key) => {
      const pattern = `{{${key}}}`;
      const regex = new RegExp(pattern, 'g');
      htmlWithoutBase = htmlWithoutBase.replace(regex, params[key]);
      subject = subject.replace(regex, params[key]);
      sms = sms.replace(regex, params[key]);
    });
  }
  const html = baseTemplate.replace('${CONTENT}', htmlWithoutBase);
  // email.attachmentData = {
  //   filename: 'image.png',
  //   cid: 'logo',
  //   type: 'image/png',
  //   content: data,
  // };

  return {
    sms,
    subject,
    html,
    innerBody: htmlWithoutBase,
  };
}
