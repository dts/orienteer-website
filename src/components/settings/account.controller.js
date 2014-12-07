'use strict';
angular.module('orienteerio')
.controller(
  'AccountSettingsCtrl',
  function(API,$state,People,Emails,$scope) {
    People.one(API.personId()).get().then(
      function(person) {
        $scope.person = person;
      });
    Emails.getList({ 'person_id' : API.personId() }).then(
      function(emails) {
        $scope.emails = emails;
      }
    );

    $scope.save = function() {
      var that = this;
      if(this.saving) {
        return;
      }
      
      this.error = null;
      this.show_error = false;
      
      this.saving = true;
      this.person.save().then(
        function() {
          that.saving = false;
        },
        function(err) {
          that.saving = false;
          if(err.status == 0) {
            that.error = 'An error occurred when talking to the server.';
          } else {
            that.error = err;
          }
          that.show_error = true;
        }
      );
    }

    $scope.changePassword = function() {
      $scope.changePasswordStatus = "";
      if(this.$parent.newPassword != this.newPasswordConfirmation) {
        $scope.changePasswordStatus = "New passwords do not match";
        return;
      }
      if($scope.newPassword.length == 0) {
        $scope.changePasswordStatus = "No password specified?"
        return;
      }
      debugger;
      API.changePassword(this.existingPassword,$scope.newPassword);
    }

    $scope.clearError = function() {
      this.$parent.show_error = false;
    }
    
    $scope.logout = function() {
      API.logout().then(function() { $state.go('login'); });
    }
  }
  
);
