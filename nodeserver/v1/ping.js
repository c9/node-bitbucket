var express = require('express');
const moment = require('moment-timezone');
const r = require('request')

module.exports = function (opts) {
    var module = {};
    var router = express.Router();
    var app = opts.app;


    function getLogSeneUrl() {
        return ' https://logsene-receiver.sematext.com/'
            + app.get('logsene_token') + '/_search'
    }


    function getElasticSearchToday() {
        var start = parseInt(moment.tz('America/New_York').startOf('day').format('x'));
        var end = parseInt(moment.tz('America/New_York').endOf('day').format('x'));
        var obj = {
            "highlight": {
                "pre_tags": [
                    "@kibana-highlighted-field@"
                ],
                "post_tags": [
                    "@/kibana-highlighted-field@"
                ],
                "fields": {
                    "*": {}
                },
                "require_field_match": false,
                "fragment_size": 2147483647
            },
            "query": {
                "filtered": {
                    "query": {
                        "query_string": {
                            "query": "_type: coderuss",
                            "analyze_wildcard": true,
                            "default_operator": "AND"
                        }
                    },
                    "filter": {
                        "bool": {
                            "must": [
                                {
                                    "range": {
                                        "@timestamp": {
                                            "gte": start,
                                            "lte": end,
                                            "format": "epoch_millis"
                                        }
                                    }
                                }
                            ],
                            "must_not": []
                        }
                    }
                }
            },
            "size": 500,
            "sort": [
                {
                    "@timestamp": {
                        "order": "desc",
                        "unmapped_type": "boolean"
                    }
                }
            ],
            "aggs": {
                "2": {
                    "date_histogram": {
                        "field": "@timestamp",
                        "interval": "30m",
                        "time_zone": "America/New_York",
                        "min_doc_count": 0,
                        "extended_bounds": {
                            "min": start,
                            "max": end
                        }
                    }
                }
            },
            "fields": [
                "*",
                "_source"
            ],
            "script_fields": {},
            "fielddata_fields": [
                "@timestamp"
            ]
        }
        return obj;
    }

    router.get('/authenticated', function (req, res) {
        if (req.isAuthenticated()) {
            res.status(200);
            res.setHeader('content-type', 'application/json; charset=utf-8');
            res.send(JSON.stringify({
                'status': 'success',
                'meta': { 'message': 'Success' }
            }));
        }
        else {
            res.status(401);
            res.setHeader('content-type', 'application/json; charset=utf-8');
            res.send(JSON.stringify({
                'status': 'unauthorized',
                'message': 'This is not an authenticated user'
            }));
        }
    });

    router.get('/isadmin', function (req, res) {
        if (req.isAuthenticated() && req.user.username == process.env.MAIN_ADMIN_USERNAME) {
            res.status(200);
            res.setHeader('content-type', 'application/json; charset=utf-8');
            res.send(JSON.stringify({
                'status': 'success',
                'meta': { 'message': 'Success' }
            }));
        }
        else {
            res.status(401);
            res.setHeader('content-type', 'application/json; charset=utf-8');
            res.send(JSON.stringify({
                'status': 'unauthorized',
                'message': 'This is not an authenticated user'
            }));
        }
    });

    function getStatusResponse() {
        return {
            'status': 'success',
            'server': {
                port: app.get('port'),
                started: app.get('serverstarted')
            },
            'meta': { 'message': 'Success' }
        };
    }

    router.get('/', function (req, res) {
        res.setHeader('content-type', 'application/json; charset=utf-8');
        res.send(JSON.stringify(getStatusResponse()));
    });

    router.get('/detailed', function (req, res) {
        var result = getStatusResponse();
        res.setHeader('content-type', 'application/json; charset=utf-8');

        body = JSON.stringify(getElasticSearchToday());
        console.log(body);
        if (app.get('logsene_token')) {
            r.post({
                headers: {
                    'content-type': 'application/json',

                },
                url: getLogSeneUrl(),
                body: body
            }, function (error, response, body) {
                console.log(body);
                if (error) {
                    console.log(error);
                }
                else if (response.statusCode !== 200) {
                    console.log(response.statusCode);
                }
                else {
                    var data = JSON.parse(body);
                    var hits = data.hits;
                    var totalhits = hits.total;
                    result.logcount = totalhits;
                }
                res.send(JSON.stringify(result));

            });
        }
        else {
            res.send(JSON.stringify(result));
        }

    })

    router.post('/', function (req, res) {
        res.status(201);
        res.setHeader('content-type', 'application/json; charset=utf-8');
        res.send(JSON.stringify(getStatusResponse()));
    });

    module.router = router;

    return module;
};