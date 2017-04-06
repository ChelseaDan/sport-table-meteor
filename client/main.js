import angular from 'angular';
import angularMeteor from 'angular-meteor';
import sportTable from '../imports/components/sportTable/sportTable';
import '../imports/startup/accounts-config.js';

angular.module('sport-table', [
  angularMeteor,
  sportTable.name,
  'accounts.ui'
]);

function onReady() {
  angular.bootstrap(document, ['sport-table']);
}

if(Meteor.isCordova) {
  angular.element(document).on('deviceready', onReady);
} else {
  angular.element(document).ready(onReady);
}
