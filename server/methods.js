import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { League } from '../imports/api/league.js';
import { Random } from 'meteor/random';
import { _ } from 'underscore';

Meteor.publish('league.all', function() {
  return League.find({}, {
    fields : League.publicFields
  });
});

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
      ids: [Meteor.userId()],
      random: random
    });
    return random;
  },
  'league.join' (code) {
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorised');
    }
    var league = League.findOne({ random: code });
    if (league == null) {
      throw new Meteor.Error('No league with that code found!');
    } else {
      if (league.ids.indexOf(Meteor.userId()) > -1) {
        throw new Meteor.Error('Already a member!');
      }
      league.ids.push(Meteor.userId());
      return league;
      }
    },
    'league.findAll' () {
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorised');
      }
      var leaguesOwned = League.find({ owner: Meteor.userId() }).fetch();
      var leaguesMember = League.find({ ids: Meteor.userId() }).fetch();
      var names = [];
      for (var i = 0; i < leaguesOwned.length; i++) {
        names.push({id: leaguesOwned[i]._id, name: leaguesOwned[i].name});
      }
      for (var i = 0; i < leaguesMember.length; i++) {
        names.push({id: leaguesMember[i]._id, name: leaguesMember[i].name});
      }
      return names;
    },
    'sendEmail' (to, from)
});
