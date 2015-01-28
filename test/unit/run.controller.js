'use strict';
describe('controllers',function() 
{           
  var TOKEN = "asdfadsf";
  var COURSES = {
    3 : { name : "New Course" }
  };

  var trackJs = {
    track : function(a) { console.log("Tracking: ",a); }
  };

  var CHECKPOINTS = {
    3 : [
      { id : 8 , name : "CP3" , visited : false , latitude : 8 , longitude : 7 },
      { id : 9 , name : "CP4", visited : false  , latitude : 9 , longitude : 7 }
    ]
  };

  var scope,course,checkpoints,httpBackend,Q,rootScope,timeout,geolocation,currentSetup,apiUri;
  beforeEach(module('orienteerio'));

  function getLocalStorage() {
    return JSON.parse(localStorage.getItem('data_cache'));
  }
  function setLocalStorage(blah) {
    var stack;
    try { throw new Error("FUck."); }
    catch(x) { stack = x.stack; }

    localStorage.setItem('data_cache',JSON.stringify(blah));
  }

  // returns a version of func that is called outside of the context
  // of any $digest calls.
  function outside_digest(func) {
    return function() {
      var deferred = Q.defer();

      setTimeout(function() { deferred.resolve(func()); rootScope.$digest(); },0);

      return deferred.promise;
    };
  }
  
  function setupLocalStorageOn() {
    setLocalStorage(
      { token : TOKEN ,
        d : {
          run_checkpoints : CHECKPOINTS,
          courses : COURSES
        }
      }
    );
  }
  
  function setupLocalStorageOff() {
    localStorage.removeItem('data_cache');
  }

  function setup(hash) {
    // hash.network: true/false (is the network connected?)
    // hash.localStorage: true/false (is there a valid localStorage bit?)

    currentSetup = hash;
    if(hash.localStorage) setupLocalStorageOn();
    else setupLocalStorageOff();
    
    rootScope.apiData = { token : TOKEN , memberId : 123456 , api_uri : apiUri };

    if(hash.network) {
      httpBackend.expect('GET','http://api.orienteer.io/api/courses/3')
        .respond(200,COURSES[3]);

      httpBackend.expect('GET','http://api.orienteer.io/api/run_checkpoints?course_id=3&limit=1000&run=true')
        .respond(200,CHECKPOINTS[3]);
    } else {
      httpBackend.expect('GET','http://api.orienteer.io/api/courses/3')
        .respond(0,null,null,null);
      httpBackend.expect('GET','http://api.orienteer.io/api/run_checkpoints?course_id=3&limit=1000&run=true')
        .respond(0,null,null,null);
    }
    
    httpBackend.expect('GET','app/main/main.html').respond(200,'');
    
    var d = Q.defer();
    d.resolve(true);
    return d.promise;
  }

  function wait_for(/* keys to watch for */) {
    var args = arguments;
    var deferred = Q.defer();
    var done_with = [];
    var done = false;
    if(arguments.length == 0) throw "must provide one key to watch.";
    
    function maybe_done() {
      if(done) return;
      
      if(done_with.length == 0) return true;

      if(done_with.reduce(function(a,b) { return a && b; })) {
        done = true;
        deferred.resolve(true);
      } else {
      }
    }
    
    function wait(index,key) {
      scope.$watch(key,function() {
        if(!(key in scope)) return;
        
        done_with[index] = true;
        maybe_done();
      });
    }
    
    for(var i = 0 ; i < arguments.length ; i++) {
      done_with.push(false);
      wait(i,arguments[i]);
    }
    
    return deferred.promise;
  }

  function spoof_check_in(latlng) {
    if(!geolocation.getAccuratePosition) {
      geolocation.getAccuratePosition = function () { };
    }

    if(!geolocation.getAccuratePosition.and)
      spyOn(geolocation,'getAccuratePosition');

    geolocation.getAccuratePosition.and.callFake(function() {
      var deferred = Q.defer();

      deferred.resolve( latlng );
      
      return deferred.promise;
    });

    httpBackend.when('POST','http://api.orienteer.io/api/run_checkpoints?course_id=3').
      respond(
        function(method,url,data,headers) {
          var parsed = JSON.parse(data);
          if(latlng.id) {
            // check in with the intended CP.
            var returned = _.find(parsed,function(d) { return d.id == latlng.id; });

            expect(returned).toBeDefined();
//            console.log("RETURNED: ",returned);
            if(returned) expect(returned.visited).toBe(true);
          }
          
          if(currentSetup.network) {
            return [200,data];
          } else {
            return [0,null,null];
          }
        }
      );
    
    scope.check_in();

    expect(geolocation.getAccuratePosition).toHaveBeenCalled();

    return wait_for('message').then(outside_digest(function() { httpBackend.flush(); }));
  }
  
  function controller() {
    var deferred = Q.defer();
    var got_cps = false;
    var got_course = false;
    var isDone = false;
    function maybe_done() {
      if(isDone) return;
      
      if(got_cps && got_course) {
        isDone = true;
        setTimeout(function() {
          deferred.resolve(scope);
          rootScope.$apply();
        },1);
      }
    }
    inject(function($controller,Courses,ApiUri) {
      scope.$watch('checkpoints',function() {
        if(!('checkpoints' in scope)) return;

        got_cps = true;
        maybe_done();
      })
      scope.$watch('course',function() {
        if(!('course' in scope)) return;

        got_course = true;
        maybe_done();
      });

      apiUri = ApiUri;

      $controller('CourseRunCtrl',{ $scope : scope , $stateParams : { id : 3 } , course : course, Geolocation : geolocation , trackJs : trackJs });
      
      httpBackend.flush();
    });

    return wait_for('course','checkpoints');
  }

  function afterChecks() {
    expect(scope.checkpoints && scope.checkpoints.invalidate).toBeDefined();
  }

  function freshScope() {
    scope = rootScope.$new();
  }

  beforeEach(inject(function($rootScope,$httpBackend,$q,Flash,$timeout,Geolocation) 
                    {
                      timeout = $timeout;
                      window.Flash = Flash;
                      rootScope = $rootScope;
                      Q = $q;
                      geolocation = Geolocation || {};
    httpBackend = $httpBackend;
                      freshScope();
  }));
  
  // 
  // the behavior of the course run controller should be:
  // 
  // LOADING: 
  // Conditions: no or invalid localstorage cache, no network
  // Result: error message indicating that network connectivity is
  // required
  // 
  // 

  it('should display an error message if neither localStorage nor network is available',
     function(done) {
       setup({network : false, localStorage : false });
       controller()
         .then(
           function() {
             expect(scope.message).toBe("Error loading checkpoints");
             expect(scope.course).toBe(null);
             expect(scope.checkpoints).toBe(null);
           }
         )
         .then(afterChecks)
         .then(done);
     }
    );

  // Conditions: no localStorage cache, network
  // Result: display the checkpoints with their status, cache results
  // in localStorage.

  it('should load from the network in the case of no localStorage, and save the result to localStorage',
     function(done) {
       setup({ network : true, localStorage : false });
       controller()
         .then(
           function() {
             expect(scope.course.name).toBe("New Course");
             expect(scope.checkpoints.length).toBe(2);
             expect(scope.checkpoints[0].name).toBe("CP3");

             var ls = getLocalStorage();

             expect(ls.token).toBe(TOKEN);
             expect(ls.d.courses[3].name).toBe(COURSES[3].name);
             expect(ls.d.run_checkpoints[3].length).toBe(CHECKPOINTS[3].length);
           }
         )
         .then(afterChecks)
         .then(done);
     }
    );

  // Conditions: localStorage cache, no network
  // Result: indicate -offline- status, display the checkpoints with
  // their status.

  it('should load from the localStorage if there is no network',
     function(done) {
       setup({ network : false, localStorage : true});
       controller().
         then(function() {
           expect(scope.course.name).toBe(COURSES[3].name);
           expect(scope.checkpoints.length).toBe(CHECKPOINTS[3].length);
           expect(scope.checkpoints[0].name).toBe(CHECKPOINTS[3][0].name);
         }
             ).then(afterChecks).then(done);
     }
    );
  
  // Conditions: localStorage cache & network both available
  // Result: display the checkpoints with their status, resolving
  // conflicts between both, to have "visible" migrate from
  // localStorage to network-fetched one.

  it('should load from the localStorage cache and network, resolving conflicts in favor of localStorage',
     function(done) {
       setup({network:true,localStorage:true});

       // make up an updated value in localStorage:
       var ls = getLocalStorage();
       ls.d.run_checkpoints['3'][1].visited = true;
       setLocalStorage(ls);

       controller()
         .then(
           function() {
             expect(scope.course.name).toBe(COURSES[3].name);
             expect(scope.checkpoints[1].visited).toBe(true);
             expect(scope.checkpoints[0].visited).toBe(false);
           }
         )
         .then(afterChecks).then(done);
     }
    );
  
  //  
  // SAVING:
  // 
  // Conditions: network available
  // Result: save values to network & localStorage

  it('should save values to the network & localStorage',
     function(done) {
       setup({network:true,localStorage:false});

       controller()
         .then(
           function() {
             // expect an HTTP call here.
             
             return spoof_check_in(CHECKPOINTS[3][1]);
           }
         )
         .then(
           function() {
             expect(scope.checkpoints[1].visited).toBe(true);
             var ls = getLocalStorage();
             expect(ls.d.run_checkpoints[3][1].visited).toBe(true);
           }
         ).then(afterChecks).then(done);
     }
    );
       
  // Conditions: network unavailable
  // Result: save values to localStorage now, and upload to network as
  // soon as possible

  it('should save to localStorage if net is unavailable',
     function(done) {
       setup({network:false,localStorage:true});
       controller()
         .then(
           function() {
             return spoof_check_in(CHECKPOINTS[3][1]);
           }
         )
         .then(
           function() {
             expect(scope.checkpoints[1].visited).toBe(true);
             var ls = getLocalStorage();
             expect(ls.d.run_checkpoints[3][1].visited).toBe(true);
           }
         ).then(afterChecks).then(done);
     }
    );

/*
  it('should load checkpoints from localStorage',
     function(done) {
       var courseId = 8;
       var course = undefined;

       Courses.one(courseId).get().then(
         function(c) {
           course = c;
         },
         function(error) {
           course = { error : error };
         }
       ).then(inject(function($controller,Courses) {
         expect(scope.course).toBeUndefined();
         expect(scope.checkpoints).toBeUndefined();
         
         $controller('CourseRunCtrl',{
           $scope : scope,
           $stateParams : { id : courseId },
           course : course
         });
       }));
     } 
    ); */

});
