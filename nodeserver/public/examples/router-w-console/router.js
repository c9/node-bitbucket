    var WorkspaceRouter = Backbone.Router.extend({
        routes: {
            "help": "help", // #help
            "search/:query": "search", // #search/kiwis
            "search/:query/p:page": "search" // #search/kiwis/p7
        },

        help : function () { },

        search : function () { }
    });

    var App = {
        help: function() { console.log("help"); },

        search: function(query, page) { console.log("search", query, page); }
    };

    $(document).ready(
            function () {
                var router = new WorkspaceRouter();
                Backbone.history.start();

                router.on("route:help", App.help);
                router.on("route:search", App.search);
            }
    );