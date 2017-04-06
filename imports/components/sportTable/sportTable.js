import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import { League } from '../../api/league.js';
import template from './sportTable.html';

export class SportTableCtrl {
  constructor($scope) {
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

  createLeague() {
  this.addEmail();
    if (this.emails.length > 0 && this.leagueName != "" && this.sport != "") {
      this.viewCreate = false;
      this.viewJoin = false;
      Meteor.call('league.insert', this.emails, this.leagueName, this.sport, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          alert("Your league code is " + result);
          this.created = true;
          this.players = this.emails;
        }
      });
    }
  }
}

export default angular.module('sportTable', [
  angularMeteor
]).component('sportTable', {
  templateUrl: 'imports/components/sportTable/sportTable.html',
  controller: ['$scope', SportTableCtrl]
});
