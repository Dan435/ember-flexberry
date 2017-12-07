import Ember from 'ember';
import { executeTest } from './execute-folv-test';
import { loadingList, loadingLocales } from './folv-tests-functions';

import I18nRuLocale from 'ember-flexberry/locales/ru/translations';

executeTest('date format moment L', (store, assert, app) => {
  assert.expect(7);
  let done = assert.async();
  let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(() => {
    assert.equal(currentPath(), path);
    loadingLocales('ru', app).then(() => {

      let olvContainerClass = '.object-list-view-container';
      let trTableClass = 'table.object-list-view tbody tr';

      let $toolBar = Ember.$('.ui.secondary.menu')[0];
      let $toolBarButtons = $toolBar.children;
      let $refreshButton = $toolBarButtons[0];
      assert.equal($refreshButton.innerText.trim(), Ember.get(I18nRuLocale, 'components.olv-toolbar.refresh-button-text'), 'button refresh exist');

      loadingList($refreshButton, olvContainerClass, trTableClass).then(($list) => {
        assert.ok($list, 'list loaded');

        let moment = app.__container__.lookup('service:moment');
        let momentValue = Ember.get(moment, 'defaultFormat');

        assert.equal(momentValue, 'L', 'moment value is \'L\' ');

        let $folvContainer = Ember.$(olvContainerClass);
        let $table = Ember.$('table.object-list-view', $folvContainer);
        let $headRow = Ember.$('thead tr', $table)[0].children;

        let indexDate = () => {
          let toReturn;
          Object.keys($headRow).forEach((element, index, array) => {
            if (Ember.$.trim($headRow[element].innerText) === 'Date') {
              toReturn = index;
              return false;
            }
          });

          return toReturn;
        };

        let $dateCell = () => { return Ember.$.trim(Ember.$('tbody tr', $table)[0].children[indexDate()].innerText); };

        // Date format most be DD.MM.YYYY
        let dateFormatRuRe = /(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19|20)\d\d/;
        let findDateRu = dateFormatRuRe.exec($dateCell());

        assert.ok(findDateRu, 'date format is \'DD.MM.YYYY\' ');

        let done2 = assert.async();
        loadingLocales('en', app).then(() => {

          let done1 = assert.async();
          loadingList($refreshButton, olvContainerClass, trTableClass).then(($list) => {
            assert.ok($list, 'list loaded');

            // Date format most be MM/DD/YYYY:
            let dateFormatEnRe = /(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d/;
            let dataCellStr = $dateCell();

            let findDateEn = dateFormatEnRe.exec(dataCellStr);

            assert.ok(findDateEn, 'date format is \'MM/DD/YYYY\' ');

          }).catch((reason) => {
            throw new Error(reason);
          }).finally(() => {
            done1();
          });
          done2();
        });
        done();
      });
    });
  });
});
