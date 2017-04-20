import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import { League } from '../../api/league.js';
import template from './sportTable.html';
import toastr from 'toastr';

export class SportTableCtrl {
  constructor($scope) {
    const League = new Mongo.Collection('personalLeagues');
    Tracker.autorun(() => {
      Meteor.subscribe('league.all');
    });
    this.viewCreate = false;
    this.viewJoin = false;
    $scope.viewModel(this);
    this.helpers({
        currentUser() {
          return Meteor.user();
        }
    })
  }

  addEmail() {
    if (this.email.indexOf('@') > -1) {
      this.emails.push(this.email);
      this.email = "";
    }
  }

  create() {
    this.viewCreate = true;
    this.viewJoin = false;
    this.emails = [];
    this.leagueName = "";
    this.sport = "";
  }

  join() {
    this.viewCreate = false;
    this.viewJoin = true;
  }

  joinLeague() {
    Meteor.call('league.join', this.leagueCode, function(err, result) {
      if (err) {
        toastr.error(err.error);
      } else {
        toastr.success("You've been added to the league");
        this.viewJoin = false;
        this.leagueCode = "";
      }
    });
  }

  createLeague() {
  this.addEmail();
    if (this.emails.length > 0 && this.leagueName != "" && this.sport != "") {
      this.viewCreate = false;
      this.viewJoin = false;
      Meteor.call('league.insert', this.emails, this.leagueName, this.sport, function(err, result) {
        if (err) {
          toastr.error(err);
        } else {
          toastr.success("Your league code is " + result);
          this.created = true;
          this.players = this.emails;
        }
      });
    }
  }

  viewLeagues() {
    this.viewJoin = false;
    this.viewCreate = false;
    this.viewAllLeagues = true;
    Meteor.call('league.findAll', function(err, result) {
      if (err) {
        toastr.error(err);
      } else {
        const leagues = League.find({}).fetch();
        console.log(leagues);
      }
    });
  }
}

export default angular.module('sportTable', [
  angularMeteor
]).component('sportTable', {
  templateUrl: 'imports/components/sportTable/sportTable.html',
  controller: ['$scope', SportTableCtrl]
});
