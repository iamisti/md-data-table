(function(){
    'use strict';

    function mdtAddHtmlContentToCellDirective($parse, $compile, $rootScope){
        return {
            restrict: 'A',
            require: '^?mdtTable',
            link: function($scope, element, attr, ctrl){

                $scope.$watch(function(){
                    //this needs to be like that. Passing only `attr.mdtAddHtmlContentToCell` will cause digest to go crazy 10 times.
                    // so we has to say explicitly that we only want to watch the content and nor the attributes, or the additional metadata.
                    var val = $parse(attr.mdtAddHtmlContentToCell)($scope);

                    return val.value;

                }, function(val){
                    element.empty();

                    var originalValue = $parse(attr.mdtAddHtmlContentToCell)($scope);

                    // ctrl doesn't exist on the first row, making html content impossible to show up.
                    // TODO: make it as a global service .... I know but any better idea?
                    if(originalValue.columnKey && ctrl && ctrl.dataStorage.customCells[originalValue.columnKey]){
                        var customCellData = ctrl.dataStorage.customCells[originalValue.columnKey];

                        var clonedHtml = customCellData.htmlContent;

                        //append value to the scope
                        var localScope = $rootScope.$new();

                        localScope.clientScope = customCellData.scope;
                        localScope.value = val;

                        $compile(clonedHtml)(localScope, function(cloned){
                            element.append(cloned);
                        });

                    }else{
                        if( typeof val != 'object' ) val = val.toString();

                        element.append(val);
                    }

                }, false);
                // issue with false value. If fields are editable then it won't reflect the change.
            }
        };
    }

    angular
        .module('mdDataTable')
        .directive('mdtAddHtmlContentToCell', mdtAddHtmlContentToCellDirective);
}());