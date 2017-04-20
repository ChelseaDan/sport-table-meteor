import { Mongo } from 'meteor/mongo';

export const League = new Mongo.Collection('league');

League.publicFields = {
  _id: 1,
  name: 1
};
