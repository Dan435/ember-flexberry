import Ember from 'ember';
import { executeTest } from './execute-folv-test';
import { loadingList, checkSortingList, loadingLocales } from './folv-tests-functions';

import I18nRuLocale from 'ember-flexberry/locales/ru/translations';

var olvContainerClass = '.object-list-view-container';
var trTableClass = 'table.object-list-view tbody tr';

// Need to add sort by multiple columns.
executeTest('check sorting clear', (store, assert, app) => {
  assert.expect(9);
  let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(() => {

    // Check page path.
    assert.equal(currentPath(), path);
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let projectionName = Ember.get(controller, 'modelProjection');

    let $olv = Ember.$('.object-list-view ');
    let $thead = Ember.$('th.dt-head-left', $olv)[0];

    Ember.run(() => {
      let done = assert.async();

      // Check sortihg in the first column. Sorting is not append.
      loadingLocales('ru', app).then(() => {
        checkSortingList(store, projectionName, $olv, null).then((isTrue) => {
          assert.ok(isTrue, 'sorting is not applied');

          // Check sortihg icon in the first column. Sorting icon is not added.
          assert.equal($thead.children[0].children.length, 1, 'no sorting icon in the first column');
          let done1 = assert.async();
          loadingList($thead, olvContainerClass, trTableClass).then(($list) => {
            let $thead = Ember.$('th.dt-head-left', $olv)[0];
            let $ord = Ember.$('.object-list-view-order-icon', $thead);
            let $divOrd = Ember.$('div', $ord);

            assert.ok($list);
            assert.equal($divOrd.attr('title'), Ember.get(I18nRuLocale, 'components.object-list-view.sort-ascending'), 'title is Order ascending');
            assert.equal(Ember.$.trim($divOrd.text()), String.fromCharCode('9650') + '1', 'sorting symbol added');

            let done2 = assert.async();
            checkSortingList(store, projectionName, $olv, 'address asc').then((isTrue) => {
              assert.ok(isTrue, 'sorting applied');

              let $clearButton = Ember.$('.clear-sorting-button');
              $clearButton.click();

              let done3 = assert.async();

              window.setTimeout(() => {
                let $thead = Ember.$('th.dt-head-left', $olv)[0];
                let $ord = Ember.$('.object-list-view-order-icon', $thead);
                let $divOrd = Ember.$('div', $ord);

                assert.equal($divOrd.attr('title'), undefined, 'sorting are clear');
                assert.equal(Ember.$.trim($divOrd.text()), '', 'sorting symbol delete');

                done3();
              }, 3000);
              done2();
            });
            done1();
          });
          done();
        });
      });
    });
  });
});
