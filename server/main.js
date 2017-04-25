import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  process.env.MAIL_URL = "smtp://dangraaf1@smtp.gmail.com:465/"
});
