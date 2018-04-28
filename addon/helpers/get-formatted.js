/**
  @module ember-flexberry
*/

import Helper from '@ember/component/helper';
import { typeOf } from '@ember/utils';
import { get } from '@ember/object';
import { htmlSafe } from '@ember/string';

/**
  Helper for get formatted value.

  @class EnumCaptionHelper
  @extends <a href="http://emberjs.com/api/classes/Ember.Helper.html">Ember.Helper</a>
  @public
*/
export default Helper.extend({
  compute(args, hash) {
    let argFirst = args[0];
    let argSecond = args[1];

    let value = get(argFirst, argSecond);
    let valueType = typeOf(value);

    switch (valueType) {
      case 'date': {

        // Convert date to string.
        // Locale is current 'locale' from i18n, format is current 'moment.defaultFormat' from config/environment).
        let moment = get(hash, 'moment');
        let momentValue = moment.moment(value);
        let dateFormat = get(hash, 'dateFormat');
        return dateFormat ? momentValue.format(dateFormat) : momentValue.format();
      }

      case 'boolean': {
        return htmlSafe(`<div class='ui checkbox disabled'><input type='checkbox' class='hidden' ${value ? 'checked' : ''}><label></label></div>`);
      }

      default: {
        return value;
      }
    }
  }
});
