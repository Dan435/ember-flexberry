import DS from 'ember-data';
import BaseModel from './base';
import Proj from 'ember-flexberry-projections';

var Model = BaseModel.extend({
    name: DS.attr('string'),
    validations: { 
 name: { presence: true }
 }
});

Model.defineProjection('LocalizationE', 'ember-flexberry-dummy-localization', {
name: Proj.attr('Name')
});
    Model.defineProjection('LocalizationL', 'ember-flexberry-dummy-localization', {
name: Proj.attr('Name')
});

export default Model;
