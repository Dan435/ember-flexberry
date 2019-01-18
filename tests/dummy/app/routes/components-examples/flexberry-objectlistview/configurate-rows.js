import RSVP from 'rsvp';
import Builder from 'ember-flexberry-data/query/builder';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import ListFormRoute from 'ember-flexberry/routes/list-form';
import { computed } from '@ember/object';
export default ListFormRoute.extend({
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'SuggestionL'
   */
  modelProjection: 'SuggestionL',

  /**
  developerUserSettings.
  {
  <componentName>: {
    <settingName>: {
        colsOrder: [ { propName :<colName>, hide: true|false }, ... ],
        sorting: [{ propName: <colName>, direction: "asc"|"desc" }, ... ],
        colsWidths: [ <colName>:<colWidth>, ... ],
      },
      ...
    },
    ...
  }
  For default userSetting use empty name ('').
  <componentName> may contain any of properties: colsOrder, sorting, colsWidth or being empty.

  @property developerUserSettings
  @type Object
  */
  developerUserSettings: computed(function() {
    return {
      FOLVSettingExampleObjectListView: { }
    }
  }),

  /**
    Name of model to be used as list's records types.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-suggestion'
  */
  modelName: 'ember-flexberry-dummy-suggestion',

  /**
    Name of first existing address in ember-flexberry-dummy-suggestion records.

    @property firstExistingAddress
    @type String
    @default null
  */
  firstExistingAddress: null,

  /**
    Performs loading of some existing address before model will be loaded.
  */
  /* eslint-disable no-unused-vars */
  beforeModel(params) {
    if (this.get('controller.configurateRowByAddress')) {
      return;
    }

    return new RSVP.Promise((resolve, reject) => {
      let store = this.get('store');

      let query = new Builder(store)
        .from('ember-flexberry-dummy-suggestion')
        .select('address')
        .where('address', FilterOperator.Neq, null)
        .top(1);

      store.query('ember-flexberry-dummy-suggestion', query.build()).then((suggestion) => {
        let suggestionArr = suggestion.toArray();
        this.set('firstExistingAddress', suggestionArr.objectAt(0).get('address'));
        resolve();
      }).catch((reason) => {
        reject(reason);
      });
    });
  },
  /* eslint-enable no-unused-vars */

  /**
    Setups controller properties.
   */
  setupController() {
    this._super(...arguments);

    if (!this.get('controller.configurateRowByAddress')) {
      this.set('controller.configurateRowByAddress', this.get('firstExistingAddress'));
    }
  }
});
