import Ember from 'ember';
import ListFormController from 'ember-flexberry/controllers/list-form';

export default ListFormController.extend({
  filterByAnyWord: false,

  filterByAllWords: false,

  /**
    Cout of list loading.

    @property loadCount
    @type Int
  */
  loadCount: 0,

  customButtons: Ember.computed('filterByAnyWord', 'filterByAllWords', function() {
    return [{
      buttonName: 'filterByAnyWord',
      buttonAction: 'toggleFilterByAnyWord',
      buttonClasses: this.get('filterByAnyWord') ? 'positive' : '',
    }, {
      buttonName: 'filterByAllWords',
      buttonAction: 'toggleFilterByAllWords',
      buttonClasses: this.get('filterByAllWords') ? 'positive' : '',
    }];
  }),

  actions: {
    toggleFilterByAnyWord() {
      this.toggleProperty('filterByAnyWord');
      if (this.get('filterByAnyWord')) {
        this.set('filterByAllWords', false);
      }
    },

    toggleFilterByAllWords() {
      this.toggleProperty('filterByAllWords');
      if (this.get('filterByAllWords')) {
        this.set('filterByAnyWord', false);
      }
    },

    componentForFilter(type, relation) {
      switch (type) {
        case 'date': return { name: 'flexberry-datepicker' };
        case 'decimal': return { name: 'flexberry-textbox', properties: { class: 'compact fluid' } };
        default: return {};
      }
    },

    conditionsByType(type) {
      switch (type) {
        case 'file':
          return null;

        case 'date':
        case 'number':
          return ['eq', 'neq', 'le', 'ge'];

        case 'string':
          return ['eq', 'neq', 'like', 'empty'];

        case 'boolean':
          return ['eq'];

        default:
          return ['eq', 'neq'];
      }
    },
  }
});
