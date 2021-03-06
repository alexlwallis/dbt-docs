'use strict';

const angular = require('angular');
const $ = require("jquery");

require("./styles.css");

const _ = require('underscore');

angular
.module('dbt')
.controller('SourceCtrl', ['$scope', '$state', 'project', 'code', '$anchorScroll', '$location',
            function($scope, $state, projectService, codeService, $anchorScroll, $location) {

    $scope.model_uid = $state.params.unique_id;
    $scope.project = projectService;

    $scope.sample_sql = "-- sample sql"
    $scope.highlighted = {
        source: '',
    }
    $scope.codeService = codeService;
    $scope.extra_table_fields = [];

    $scope.copied = false;
    $scope.copy_to_clipboard = function(sql) {
        codeService.copy_to_clipboard(sql)
        $scope.copied = true;
        setTimeout(function() {
            $scope.$apply(function() {
                $scope.copied = false;
            })
        }, 1000);
    }

    $scope.model = {};
    projectService.ready(function(project) {
        $scope.model = project.nodes[$scope.model_uid];

        $scope.sample_sql = codeService.generateSourceSQL($scope.model)
        $scope.highlighted.source = codeService.highlightSql($scope.sample_sql);

        $(".source-code").each(function(i, el) {
            hljs.lineNumbersBlock(el);
        });

        $scope.extra_table_fields = [
            {
                name: "Loader",
                value: $scope.model.loader
            },
            {
                name: "Source",
                value: $scope.model.source_name
            },
        ]
    })
}]);
