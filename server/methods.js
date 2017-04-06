import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { League } from '../imports/api/league.js';
import { Random } from 'meteor/random';

Meteor.methods({
  'league.insert' (emails, leagueName, sport) {
    for (var i = 0; i < emails.length; i++) {
        check(emails[i], String);
    }
    check(leagueName, String);
    check(sport, String);
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorised');
    }
    var random = Random.id();
    League.insert({
      name: leagueName,
      sport: sport,
      owner: Meteor.userId(),
      players: emails,
      random: random
    });
    return random;
  }
});
