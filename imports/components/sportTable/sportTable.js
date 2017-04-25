import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { League } from '../../api/league.js';
import { Email } from 'meteor/email';
import template from './sportTable.html';
import toastr from 'toastr';

export class SportTableCtrl {

  constructor($scope, $meteor) {
    this.viewEnum = {CREATE : {name: "CREATE"}, JOIN : {name: "JOIN"}, LEAGUES : {name: "LEAGUES"}, NONE : {name: "NONE"}};
    this.view = this.viewEnum.NONE;
    Tracker.autorun(() => {
      Meteor.subscribe('league.all');
    });
    $scope.viewModel(this);
    this.helpers({
        currentUser() {
          return Meteor.user();
        },
        leagues() {
          /*Need to only find your leagues*/
          this.leagues = League.find({}).fetch();
          return League.find({});
        }
    });
  }

  addEmail() {
    if (this.email.indexOf('@') > -1) {
      this.emails.push(this.email);
      this.email = "";
    } else {
      toastr.error("Emails must contain a '@'");
    }
  }

  create() {
    this.view = this.viewEnum.CREATE;
    this.emails = [];
    this.leagueName = "";
    this.sport = "";
  }

  join() {
    this.view = this.viewEnum.JOIN;
  }

  joinLeague() {
    Meteor.call('league.join', this.leagueCode, function(err, result) {
      if (err) {
        toastr.error(err.error);
      } else {
        toastr.success("You've been added to the league");
        this.view = this.viewEnum.NONE;
        this.leagueCode = "";
      }
    });
  }

  createLeague() {
  this.addEmail();
    if (this.emails.length > 0 && this.leagueName != "" && this.sport != "") {
      this.view = this.viewEnum.NONE;
      Meteor.call('league.insert', this.emails, this.leagueName, this.sport, function(err, result) {
        if (err) {
          toastr.error(err);
        } else {
          toastr.success("League created successfully.");
          this.created = true;
          this.players = this.emails;
        }
      });
    }
  }

  viewLeagues() {
    this.view = this.viewEnum.LEAGUES;
  }

  viewLeague(league) {
    for (var i = 0; i < this.leagues.length; i++) {
      if (league._id == this.leagues[i]._id) {
        this.selectedLeague = this.leagues[i];
        break;
      }
    }
  }

  challenge(player) {
    console.log("challenging " + player);
  }
}

export default angular.module('sportTable', [
  angularMeteor
]).component('sportTable', {
  templateUrl: 'imports/components/sportTable/sportTable.html',
  controller: ['$scope', '$meteor', SportTableCtrl]
});
