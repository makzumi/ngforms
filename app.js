var app = angular.module('app', [])

  .controller('appCtrl', function ($scope, $filter, utils) {
    $scope.data = {};
    $scope.data.inputs = '';
    $scope.data.multiple = [];
    $scope.data.cols = 1;
    $scope.data.base = '';
    $scope.data.inline = false;
    $scope.data.colClass = '';

    $scope.updateCode = function () {
      $scope.data.code = utils.getRaw($scope.data.multiple, $scope.data.cols);
    };

    $scope.setMulti = function () {
      var r = $filter('splits')($scope.data.inputs);
      var arr = [];
      r.forEach(function (item) {
        var tmp = {
          model: $scope.data.base ? $scope.data.base + "." + item : item,
          label: $filter('ucwords')(item),
          id: $filter('ucwords')(item, true),
          type: 'text'
        };
        arr.push(tmp);
      });
      $scope.data.multiple = arr;
      $scope.data.code = utils.getRaw(arr, $scope.data.cols, $scope.data.inline);
    };
  })

  .factory('utils', function ($timeout) {
    return { getRaw: getRaw };
    function getRaw(data, cols, inline) {
      var colClass = ' col-md-12';
      var code = '';
      if (cols > 1) {
        data = _.chunk(data, cols);
        colClass = ' col-md-' + (12 / cols);
      } else {
        data = [data];
      }
      var iclass = '';
      if (inline) {
        iclass = 'class="form-inline"';
        colClass = '';
      }
      code += '<form ' + iclass + '>' + "\n";
      data.forEach(function (rows) {
        if (!inline) code += "\t" + '<div class="row">' + "\n";
        rows.forEach(function (cols) {
          var input = '';
          if (cols.type == 'text' || cols.type == 'password') {
            input += "\t\t" + '<div class="form-group' + colClass + '">' + "\n";
            input += "\t\t\t" + '<label for="' + cols.id + '">' + cols.label + '</label>' + "\n";
            input += "\t\t\t" + '<input class="form-control" type="' + cols.type + '" id="' + cols.id + '" ng-model="' + cols.model + '"/>' + "\n";
            input += "\t\t" + '</div>' + "\n";
          }
          if (cols.type == 'textarea') {
            input += "\t\t" + '<div class="form-group' + colClass + '">' + "\n";
            input += "\t\t\t" + '<label for="' + cols.id + '">' + cols.label + '</label>' + "\n";
            input += "\t\t\t" + '<textarea class="form-control" id="' + cols.id + '" ng-model="' + cols.model + '"/></textarea>' + "\n";
            input += "\t\t" + '</div>' + "\n";
          }

          if (cols.type == 'checkbox' || cols.type == 'radio') {
            input += "\t\t" + '<div class="' + cols.type + ' form-group' + colClass + '">' + "\n";
            input += "\t\t\t" + '<label>' + "\n";
            input += "\t\t\t" + '<input type="' + cols.type + '" ng-model="' + cols.model + '"/>' + "\n";
            input += "\t\t\t" + cols.label + "\n";
            input += "\t\t\t" + '</label>' + "\n";
            input += "\t\t" + '</div>' + "\n";
          }

          code += input;
        });
        if (!inline) code += "\t" + '</div>' + "\n";
      });
      code += '</form>' + "\n";
      return code;
    }
  })

  .filter('splits', function () {
    return function (value) {
      if (!value) return;
      value = value.split(',');
      value = value.map(function (i) {
        i = i.trim();
        if (i) return i;
      });
      value = value.filter(function (val) { return val !== undefined; })
      return value;
    };
  })
  .filter('trust', function ($sce) {
    return function (value) {
      return $sce.trustAsHtml(value);
    };
  })

  .filter('ucwords', function () {
    return function (value, prop) {
      if (!prop) value = value.replace(/_/g, ' ');
      value = value.split('.');
      value = value[value.length - 1];
      if (prop) return value;
      return (value + '')
        .replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function ($1) {
          return $1.toUpperCase()
        })
    };
  });