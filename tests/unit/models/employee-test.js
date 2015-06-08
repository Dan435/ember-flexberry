import DS from 'ember-data';
import Ember from 'ember';
import { test, moduleForModel } from 'ember-qunit';

import startApp from '../../helpers/start-app';

var App;

moduleForModel('employee', {
    // Specify the other units that are required for this test.
    needs: ['service:validations',
            'ember-validations@validator:local/presence',
            'ember-validations@validator:local/length'],
    setup: function(){
        App = startApp();
    },
    teardown: function(){
        Ember.run(App, 'destroy');
        Ember.$.mockjax.clear();
    }
});

test('it exists', function(assert) {
    var model = this.subject();
    assert.ok(!!model);
});

test('it returns fields', function(assert) {
    var model = this.subject({ firstName: "Ivanov", lastName: "Ivan" });
    var store = this.store();
    assert.ok(model);
    assert.ok(model instanceof DS.Model);
    assert.equal(model.get('firstName'), "Ivanov");
    assert.equal(model.get('lastName'), "Ivan");
  
    // set a relationship
    Ember.run(function() {
        model.set('reportsTo', store.createRecord('employee', { firstName: "Sidorov", lastName: "Sidor" }));
    });
  
    var reportsToEmployee = model.get('reportsTo');
    assert.ok(reportsToEmployee);
    assert.equal(reportsToEmployee.get('firstName'), "Sidorov");
    assert.equal(reportsToEmployee.get('lastName'), "Sidor");
});

test('it validates', function (assert) {
  var model = this.subject({ lastName: 'asdfgh' });

  Ember.run(function (){
    assert.ok(!model.get('isValid'), 'Empty model is valid. Check validation rules.');
    assert.throws(function () { model.save(); }, Error,
      'Model is invalid but save() works. Check save method and validation rules');

    model.set('firstName', 'Qwerty');
    model.set('lastName', 'Qwerty');
    assert.ok(model.get('isValid'), 'Data was set but model is invalid. Check validation rules.');
  });
});

test('it loads fields', function(assert) {
    var store = App.__container__.lookup('store:main');
    var record = null;
    Ember.run(function(){

        Ember.$.mockjax({
            url: "*Employees(99)",
            responseText: {
                "@odata.context": "http://northwindodata.azurewebsites.net/odata/$metadata#Employees(EmployeeID,FirstName,LastName,BirthDate,ReportsTo)/$entity",
                "EmployeeID": 99,
                "FirstName": "Ivan",
                "LastName": "Ivanov",
                "BirthDate": "1933-10-30T00:00:00Z",
                "ReportsTo": 98
            }
        });

        Ember.$.mockjax({
            url: "*Employees(98)",
            responseText: {
                "@odata.context": "http://northwindodata.azurewebsites.net/odata/$metadata#Employees(EmployeeID,FirstName,LastName,BirthDate,ReportsTo)/$entity",
                "EmployeeID": 98,
                "FirstName": "Sidor",
                "LastName": "Sidorov",
                "BirthDate": "1946-10-30T00:00:00Z",
                "ReportsTo": 97
            }
        });

        store.find('employee', 99).then(function(record) {
            assert.ok(record);
            assert.ok(record instanceof DS.Model);
            assert.equal(record.get('firstName'), "Ivan"); 
            assert.equal(record.get('lastName'), "Ivanov"); 

            record.get('reportsTo').then(function(masterRecord){
                assert.ok(masterRecord);
                assert.ok(masterRecord instanceof DS.Model);
                assert.equal(masterRecord.get('firstName'), "Sidor"); 
                assert.equal(masterRecord.get('lastName'), "Sidorov");
            });
        });

        andThen(function(){});
    });
});

