import Ember from 'ember';
import { executeTest } from './execute-folv-test';
import { openEditFormByFunction } from 'dummy/tests/acceptance/components/flexberry-objectlistview/folv-tests-functions';

// Need to add sort by multiple columns.
executeTest('check edit button in row', (store, assert, app) => {
  assert.expect(3);
  let path = 'components-acceptance-tests/flexberry-objectlistview/folv-paging';
  visit(path);
  andThen(() => {

    // Check page path.
    assert.equal(currentPath(), path);

    let $editButtonInRow = Ember.$('.object-list-view-row-edit-button');

    assert.equal($editButtonInRow.length, 5, 'All row have editButton');

    // Apply filter function.
    let openEditFormFunction =  function() {
      let editButtonInRow = Ember.$('.object-list-view-row-edit-button')[0];
      editButtonInRow.click();
    };

    // Open editform.
    let done1 = assert.async();
    openEditFormByFunction(openEditFormFunction).then(() => {
      assert.ok(true, 'edit form open');
      done1();
    });
  });
});
