(function() {

var $ = jQuery; // Handle namespaced jQuery

// The model that holds individual search facets and their categories.
// Held in a collection by `VS.app.searchQuery`.
VS.model.SearchFacet = Backbone.Model.extend({

  category: function() {
    return this.get('category');
  },

  label: function() {
    return this.get('label') || this.value();
  },
  
  value: function() {
    return this.get('value');
  },

  // Extract the category and value and serialize it in preparation for
  // turning the entire searchBox into a search query that can be sent
  // to the server for parsing and searching.
  serialize : function() {
    var category = this.quoteCategory(this.category()),
        value    = VS.utils.inflector.trim(this.value());

    if (!value) return '';

    var label    = VS.utils.inflector.trim(this.label()),
        remainder = this.get("app").options.remainder,
        quoteFunction = (!_.contains(this.get("app").options.unquotable || [], category) && category != remainder) ? _.bind(this.quoteValue, this) : _.identity;

    if (category != remainder) {
      var res = category + ': ' + quoteFunction(label);
      if (label != value) {
        res += '('+ value +')';
      }
      return res;
    } else {
      return value;
    }
  },
  
  // Wrap categories that have spaces or any kind of quote with opposite matching
  // quotes to preserve the complex category during serialization.
  quoteCategory : function(category) {
    var hasDoubleQuote = (/"/).test(category);
    var hasSingleQuote = (/'/).test(category);
    var hasSpace       = (/\s/).test(category);
    
    if (hasDoubleQuote && !hasSingleQuote) {
      return "'" + category + "'";
    } else if (hasSpace || (hasSingleQuote && !hasDoubleQuote)) {
      return '"' + category + '"';
    } else {
      return category;
    }
  },
  
  // Wrap values that have quotes in opposite matching quotes. If a value has
  // both single and double quotes, just use the double quotes.
  quoteValue : function(value) {
    var hasDoubleQuote = (/"/).test(value);
    var hasSingleQuote = (/'/).test(value);
    
    if (hasDoubleQuote && !hasSingleQuote) {
      return "'" + value + "'";
    } else {
      return '"' + value + '"';
    }
  }

});

})();