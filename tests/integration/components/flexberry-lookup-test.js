import Component from '@ember/component';
import RSVP from 'rsvp';
import $ from 'jquery';
import { inject as service } from '@ember/service';
import { run, later } from '@ember/runloop';
import { assert as emberAssert } from '@ember/debug';
import Builder from 'ember-flexberry-data/query/builder';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import I18nService from 'ember-i18n/services/i18n';
import I18nRuLocale from 'ember-flexberry/locales/ru/translations';
import I18nEnLocale from 'ember-flexberry/locales/en/translations';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import startApp from '../../helpers/start-app';
import destroyApp from '../../helpers/destroy-app';

let app;

moduleForComponent('flexberry-lookup', 'Integration | Component | flexberry lookup', {
  integration: true,

  beforeEach: function () {
    this.register('locale:ru/translations', I18nRuLocale);
    this.register('locale:en/translations', I18nEnLocale);
    this.register('service:i18n', I18nService);

    this.inject.service('i18n', { as: 'i18n' });
    Component.reopen({
      i18n: service('i18n')
    });

    this.set('i18n.locale', 'ru');
    app = startApp();

    // Just take it and turn it off...
    app.__container__.lookup('service:log').set('enabled', false);
  },
  afterEach: function() {
    destroyApp(app);
  }
});

test('component renders properly', function(assert) {
  assert.expect(30);

  this.render(hbs`{{#flexberry-lookup
  placeholder='(тестовое значение)'}}
  {{/flexberry-lookup}}`);

  // Retrieve component, it's inner <input>.
  let $component = this.$().children();
  let $lookupFluid = $component.children('.fluid');
  let $lookupInput = $lookupFluid.children('.lookup-field');
  let $lookupButtonChoose = $lookupFluid.children('.ui-change');
  let $lookupButtonClear = $lookupFluid.children('.ui-clear');
  let $lookupButtonClearIcon = $lookupButtonClear.children('.remove');

  // Check wrapper <flexberry-lookup>.
  assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s title block is a <div>');
  assert.strictEqual($component.hasClass('flexberry-lookup'), true, 'Component\'s container has \'flexberry-lookup\' css-class');
  assert.strictEqual($component.hasClass('ember-view'), true, 'Component\'s wrapper has \'ember-view\' css-class');

  // Check wrapper <fluid>.
  assert.strictEqual($lookupFluid.length === 1, true, 'Component has inner title block');
  assert.strictEqual($lookupFluid.prop('tagName'), 'DIV', 'Component\'s title block is a <div>');
  assert.strictEqual($lookupFluid.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
  assert.strictEqual($lookupFluid.hasClass('fluid'), true, 'Component\'s wrapper has \'fluid\' css-class');
  assert.strictEqual($lookupFluid.hasClass('action'), true, 'Component\'s wrapper has \'action\' css-class');
  assert.strictEqual($lookupFluid.hasClass('input'), true, 'Component\'s container has \'input\' css-class');

  // Check <input>.
  assert.strictEqual($lookupInput.length === 1, true, 'Component has inner title block');
  assert.strictEqual($lookupInput.prop('tagName'), 'INPUT', 'Component\'s wrapper is a <input>');
  assert.strictEqual($lookupInput.hasClass('lookup-field'), true, 'Component\'s title block has \'lookup-field\' css-class');
  assert.strictEqual($lookupInput.hasClass('ember-view'), true, 'Component\'s title block has \'ember-view\' css-class');
  assert.strictEqual($lookupInput.hasClass('ember-text-field'), true, 'Component\'s title block has \'ember-text-field\' css-class');
  assert.equal($lookupInput.attr('placeholder'), '(тестовое значение)', 'Component\'s container has \'input\' css-class');

  // Check <choose button>.
  assert.strictEqual($lookupButtonChoose.length === 1, true, 'Component has inner title block');
  assert.strictEqual($lookupButtonChoose.prop('tagName'), 'BUTTON', 'Component\'s title block is a <button>');
  assert.strictEqual($lookupButtonChoose.hasClass('ui'), true, 'Component\'s container has \'ui\' css-class');
  assert.strictEqual($lookupButtonChoose.hasClass('ui-change'), true, 'Component\'s container has \'ui-change\' css-class');
  assert.strictEqual($lookupButtonChoose.hasClass('button'), true, 'Component\'s container has \'button\' css-class');
  assert.equal($lookupButtonChoose.attr('title'), 'Выбрать');

  // Check <clear button>.
  assert.strictEqual($lookupButtonClear.length === 1, true, 'Component has inner title block');
  assert.strictEqual($lookupButtonClear.prop('tagName'), 'BUTTON', 'Component\'s title block is a <button>');
  assert.strictEqual($lookupButtonClear.hasClass('ui'), true, 'Component\'s container has \'ui\' css-class');
  assert.strictEqual($lookupButtonClear.hasClass('ui-clear'), true, 'Component\'s container has \'ui-clear\' css-class');
  assert.strictEqual($lookupButtonClear.hasClass('button'), true, 'Component\'s container has \'button\' css-class');

  // Check <clear button icon>
  assert.strictEqual($lookupButtonClearIcon.length === 1, true, 'Component has inner title block');
  assert.strictEqual($lookupButtonClearIcon.prop('tagName'), 'I', 'Component\'s title block is a <i>');
  assert.strictEqual($lookupButtonClearIcon.hasClass('remove'), true, 'Component\'s container has \'remove\' css-class');
  assert.strictEqual($lookupButtonClearIcon.hasClass('icon'), true, 'Component\'s container has \'icon\' css-class');
});

test('component with readonly renders properly', function(assert) {
  assert.expect(2);

  this.render(hbs`{{flexberry-lookup
  readonly=true
  }}`);

  // Retrieve component, it's inner <input>.
  let $component = this.$().children();
  let $lookupFluid = $component.children('.fluid');
  let $lookupButtonChoose = $lookupFluid.children('.ui-change');
  let $lookupButtonClear = $lookupFluid.children('.ui-clear');

  // Check <choose button>.
  assert.strictEqual($lookupButtonChoose.hasClass('disabled'), true, 'Component\'s container has \'disabled\' css-class');

  // Check <clear button>.
  assert.strictEqual($lookupButtonClear.hasClass('disabled'), true, 'Component\'s container has \'disabled\' css-class');
});

test('component with choose-text and remove-text properly', function(assert) {
  assert.expect(2);
  this.set('tempTextChoose', 'TempText1');
  this.set('tempTextRemove', 'TempText2');

  this.render(hbs`{{#flexberry-lookup
    chooseText=tempTextChoose
    removeText=tempTextRemove
  }}
  {{/flexberry-lookup}}`);

  let $component = this.$().children();
  let $lookupFluid = $component.children('.fluid');
  let $lookupButtonChoose = $lookupFluid.children('.ui-change');
  let $lookupButtonClear = $lookupFluid.children('.ui-clear');

  // Check <choose button>.
  assert.equal($lookupButtonChoose.text().trim(), 'TempText1');

  // Check <clear button>.
  assert.equal($lookupButtonClear.text().trim(), 'TempText2');
});

test('autocomplete doesn\'t send data-requests in readonly mode', function(assert) {
  assert.expect(1);

  let store = app.__container__.lookup('service:store');

  // Override store.query method.
  let ajaxMethodHasBeenCalled = false;
  let originalAjaxMethod = $.ajax;
  $.ajax = function() {
    ajaxMethodHasBeenCalled = true;

    return originalAjaxMethod.apply(this, arguments);
  };

  // First, load model with existing master.
  let modelName = 'ember-flexberry-dummy-suggestion-type';
  let query = new Builder(store)
    .from(modelName)
    .selectByProjection('SuggestionTypeE')
    .where('parent', FilterOperator.Neq, null)
    .top(1);

  let asyncOperationsCompleted = assert.async();
  store.query(modelName, query.build()).then(suggestionTypes => {
    suggestionTypes = suggestionTypes.toArray();
    emberAssert('One or more \'' + modelName + '\' must exist', suggestionTypes.length > 0);

    // Remember model & render component.
    this.set('model', suggestionTypes[0]);

    this.set('actions.showLookupDialog', () => {});
    this.set('actions.removeLookupValue', () => {});

    this.render(hbs`{{flexberry-lookup
      value=model.parent
      relatedModel=model
      relationName="parent"
      projection="SuggestionTypeL"
      displayAttributeName="name"
      title="Parent"
      choose=(action "showLookupDialog")
      remove=(action "removeLookupValue")
      readonly=true
      autocomplete=true
    }}`);

    // Retrieve component.
    let $component = this.$();
    let $componentInput = $('input', $component);

    /* eslint-disable no-unused-vars */
    return new RSVP.Promise((resolve, reject) => {
      run(() => {
        ajaxMethodHasBeenCalled = false;

        // Imitate focus on component, which can cause async data-requests.
        $componentInput.focusin();

        // Wait for some time which can pass after focus, before possible async data-request will be sent.
        later(() => {
          resolve();
        }, 300);
      });
    });
    /* eslint-enable no-unused-vars */
  }).then(() => {
    // Check that store.query hasn\'t been called after focus.
    assert.strictEqual(ajaxMethodHasBeenCalled, false, '$.ajax hasn\'t been called after click on autocomplete lookup in readonly mode');
  }).catch((e) => {
    // Error output.
    assert.ok(false, e);
  }).finally(() => {
    // Restore original method.
    $.ajax = originalAjaxMethod;

    asyncOperationsCompleted();
  });
});
