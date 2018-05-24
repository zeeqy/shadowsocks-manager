const app = angular.module('app');

app
  .controller('HomeController', ['$scope', '$mdMedia', '$mdSidenav', '$state', '$http', '$timeout', '$localStorage', 'configManager',
    ($scope, $mdMedia, $mdSidenav, $state, $http, $timeout, $localStorage, configManager) => {    
      const config = configManager.getConfig();
      console.log(config);
      if(config.status === 'normal') {
        $state.go('user.index');
      } else if (config.status === 'admin') {
        $state.go('admin.index');
      } else {
        $localStorage.admin = {};
        $localStorage.user = {};
        $scope.setMainLoading(false);
      }
      $scope.setConfig(config);
      $scope.home = {};

      $scope.innerSideNav = true;
      $scope.menuButton = function() {
        if ($mdMedia('gt-sm')) {
          $scope.innerSideNav = !$scope.innerSideNav;
        } else {
          $mdSidenav('left').toggle();
        }
      };
      $scope.menus = [{
        name: '首页',
        icon: 'home',
        click: 'home.index'
      }, {
        name: '登录',
        icon: 'cloud',
        click: 'home.login'
      }, {
        name: '注册',
        icon: 'face',
        click: 'home.signup'
      }];
      $scope.menuClick = (index) => {
        $mdSidenav('left').close();
        $state.go($scope.menus[index].click);
      };
    }
  ])
  .controller('HomeIndexController', ['$scope', '$state',
    ($scope, $state) => {
<<<<<<< HEAD
      $scope.icons = [{
        icon: 'headset',
        title: '小圈子主义',
        content: '限制用户数量，仅在社交圈内推广',
      }, {
        icon: 'free_breakfast',
        title: '免费分享',
        content: '个人开发项目，分享多余流量',
      }, {
        icon: 'memory',
        title: '高效稳定',
        content: '多服务器支持，高峰期速度保证',
      }];
=======
>>>>>>> upstream/master
      $scope.login = () => { $state.go('home.login'); };
      $scope.signup = () => { $state.go('home.signup'); };
    }
  ])
  .controller('HomeLoginController', ['$scope', '$state', 'homeApi', 'alertDialog', '$localStorage', 'configManager',
    ($scope, $state, homeApi, alertDialog, $localStorage, configManager) => {
      $scope.user = {};
      $scope.login = () => {
        alertDialog.loading().then(() => {
          return homeApi.userLogin($scope.user.email, $scope.user.password);
        }).then(success => {
          $scope.setId(success.id);
          // $localStorage.home.status = success.type;
          return alertDialog.close().then(() => {
            return success;
          });
        }).then(success => {
          configManager.deleteConfig();
          if (success.type === 'normal') {
            $state.go('user.index');
          } else if (success.type === 'admin') {
            $state.go('admin.index');
          }
        }).catch(err => {
          alertDialog.show(err, '确定');
        });
      };
      $scope.findPassword = () => {
        alertDialog.loading().then(() => {
          return homeApi.findPassword($scope.user.email);
        })
        .then(success => {
          alertDialog.show(success, '确定');
        }).catch(err => {
          alertDialog.show(err, '确定');
        });
      };
      $scope.enterKey = key => {
        if(key.keyCode === 13) {
          $scope.login();
        }
      };
    }
  ])
<<<<<<< HEAD
  .controller('HomeSignupController', ['$scope', '$state', '$interval', '$timeout', 'homeApi', 'alertDialog',
    ($scope, $state, $interval, $timeout, homeApi, alertDialog) => {
=======
  .controller('HomeSignupController', ['$scope', '$state', '$interval', '$timeout', 'homeApi', 'alertDialog', '$localStorage', 'configManager',
    ($scope, $state, $interval, $timeout, homeApi, alertDialog, $localStorage, configManager) => {
>>>>>>> upstream/master
      $scope.user = {};
      $scope.sendCodeTime = 0;
      $scope.sendCode = () => {
        alertDialog.loading().then(() => {
          return homeApi.sendCode($scope.user.email);
        })
        .then(success => {
          alertDialog.show('验证码已发至邮箱', '确定');
          $scope.sendCodeTime = 120;
          const interval = $interval(() => {
            if ($scope.sendCodeTime > 0) {
              $scope.sendCodeTime--;
            } else {
              $interval.cancel(interval);
              $scope.sendCodeTime = 0;
            }
          }, 1000);
        }).catch(err => {
          alertDialog.show(err, '确定');
        });
      };
      $scope.signup = () => {
        alertDialog.loading().then(() => {
          return homeApi.userSignup($scope.user.email, $scope.user.code, $scope.user.password, $scope.home.refId);
        })
<<<<<<< HEAD
        .then(success => {
          alertDialog.show('用户注册成功', '确定').then(success => {
            $state.go('home.login');
=======
        .then(userType => {
          alertDialog.show('用户注册成功', '确定').then(success => {
            configManager.deleteConfig();
            if(userType === 'admin') {
              $state.go('admin.index');
            } else {
              $state.go('user.index');
            }
>>>>>>> upstream/master
          });
        }).catch(err => {
          alertDialog.show(err, '确定');
        });
      };
    }
  ])
  .controller('HomeResetPasswordController', ['$scope', '$http', '$state', '$stateParams', 'alertDialog',
    ($scope, $http, $state, $stateParams, alertDialog) => {
      $scope.user = {};
      const token = $stateParams.token;
      alertDialog.loading().then(() => {
        return $http.get('/api/home/password/reset', {
          params: {
            token
          },
        });
      }).then(() => {
        return alertDialog.close();
      }).catch(() => {
        alertDialog.show('该链接已经失效', '确定').then(() => {
          $state.go('home.index');
        });
      });
      $scope.resetPassword = () => {
        alertDialog.loading();
        $http.post('/api/home/password/reset', {
          token,
          password: $scope.user.password,
        }).then(() => {
          alertDialog.show('修改密码成功', '确定').then(() => {
            $state.go('home.login');
          });
        }).catch(() => {
          alertDialog.show('修改密码失败', '确定');
        });
      };
    }
  ])
  .controller('HomeMacLoginController', ['$scope', '$http', '$state', '$stateParams', '$localStorage', 'configManager',
    ($scope, $http, $state, $stateParams, $localStorage, configManager) => {
      const mac = $stateParams.mac;
      configManager.deleteConfig();
      $http.post('/api/home/macLogin', {
        mac,
      }).then(() => {
        $localStorage.user = {};
        $state.go('user.index');
      }).catch(() => {
        $localStorage.home = {};
        $localStorage.user = {};
        $state.go('home.index');
      });
    }
  ])
  .controller('HomeTelegramLoginController', ['$scope', '$http', '$state', '$stateParams', '$localStorage', 'configManager',
    ($scope, $http, $state, $stateParams, $localStorage, configManager) => {
      const token = $stateParams.token;
      configManager.deleteConfig();
      $http.post('/api/user/telegram/login', {
        token,
      }).then(() => {
        $localStorage.user = {};
        $state.go('user.index');
      }).catch(() => {
        $localStorage.home = {};
        $localStorage.user = {};
        $state.go('home.index');
      });
    }
  ])
  .controller('HomeRefController', ['$scope', '$state', '$stateParams', '$http',
    ($scope, $state, $stateParams, $http) => {
      const refId = $stateParams.refId;
      $scope.home.refId = refId;
      $http.post(`/api/home/ref/${ refId }`);
      $state.go('home.signup');
    }
  ])
;
