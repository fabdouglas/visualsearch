(function() {

var $ = jQuery; // Handle namespaced jQuery

VS.app.SearchParser = {

  // Called to parse a query into a collection of `SearchFacet` models.
  parse : function(instance, query) {
    var parsedQuery = VS.app.GrammarParser.parse(query),
        facets = $.map(parsedQuery, function(fparams) {
      return new VS.model.SearchFacet({
          category  : fparams.category,
          label     : VS.utils.inflector.trim(fparams.label || fparams.value),
          value     : fparams.value,
          app       : instance
        })
    })
    instance.searchQuery.reset(facets);
    return facets;
  }

};

})();
