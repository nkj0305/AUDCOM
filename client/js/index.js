var app = angular.module('MyApp', ['ngMaterial', 'ngRoute','ngMessages', 'material.svgAssetsCache']);

app.controller('refer',function($scope , $route ,$routeParams, $window, $http , $location)
{
    $scope.tab = 1;
    $scope.setTab = function(newTab){
if (newTab ==2)
{   
$window.location.href ="#/profile/";
}   
else if(newTab ==1)
{
$window.location.href ="#/home/";
}
else if (newTab ==3)
{

$window.location.href ="#/about/";
}
$scope.tab = newTab;
};

$scope.isSet = function(tabNum){
      return $scope.tab === tabNum;
};
});

app.controller('expand',function($scope , $route ,$routeParams, $window, $http , $location, $timeout,$sce)
{
  // Fetch the rooms other tahn the expanded room 
  $scope.ExpandedRooms = function(){
  var param = $routeParams.param;
  $scope.roomTitle = $routeParams.title;
  console.log(param);
  $http.get('processcmd/list rooms').success(function(data){
  var json = data;

  buildGridModel({
          background: ""
            });
      function buildGridModel(tileTmpl)
      {
        var it, results = [ ];
        for (var j=0; j<json.length; j++)
        {
          it = angular.extend({},tileTmpl);
          var obj = json[j];

          if (param == obj.id)
          {
            $scope.openedRoom = obj.title;
            continue;
          }
          it.id = obj.id;
          it.title = obj.title;
          it.span  = { row : 1, col : 1 };
          it.stringArray= ["Kaur Gurpreet", "Jha Neeraj ", "Bisht Surender"];
          results.push(it);
        }
        $scope.exptiles = results;
      }
  });
  };
  
  $scope.ExpandedRooms();
  $scope.reload = function(){
    $http.get("dbapi/userLoggedIn").success(function(data){
      $scope.userEmail = data;
      $http.get('processcmd/get messages '+$routeParams.param).success(function(data){

      if (data == "STATUS CODE: 404")
      {
        $scope.messages = [];
        $scope.roomId = $routeParams.param;
        //$scope.roomTitle = $routeParams.title;
      } else {
        $scope.messages = data;
        $scope.roomId = $routeParams.param;
        //$scope.roomTitle = $routeParams.title;
      }
      });
      
    });
  
    var promise = $timeout(function(){
          $scope.reload();
          }, 3000);
  
    $scope.$on('$destroy', function(){
      $timeout.cancel(promise);
    });
  };
  $scope.reload();
  
  $http.get('processcmd/get members ' + $routeParams.param).success(function(data) {
    console.log("members: ",data);
    $scope.memberships = [];
    if (data){
      $scope.memberships=data;
      $scope.membersDetailedInfo = [];
      data.forEach(function(item){
      $http.get('processcmd/person details '+item.personId).success(function(persondata){
          var imageSourceUrl = "img/user-placeholder.png";
              if (persondata[0].avatar !== undefined) {
                imageSourceUrl = persondata[0].avatar;
              }
          $scope.membersDetailedInfo.push({personDisplayName:persondata[0].displayName, 
                avatar:'<img src="' +imageSourceUrl+'" class="thumbnailsize img-circle"></img>', 
                created:item.created});
          $scope.$broadcast("Data_Ready");
        
          });
        });
       console.log($scope.memberships);
     }
  });
  
  $scope.leaveRoom = function(){
    $http.get('processcmd/get members '+$routeParams.param+ ' '+$scope.userEmail[0]).success(function(data) {
       
       console.log(data[0].id);
       $http.get('processcmd/exit room ' + data[0].id).success(function(data) {
           console.log('leave room');
           console.log(data);
           if(data.responseCode == 204){ // 204 is returned when the room is deleted
             $location.url('/');
             
           }
       });
  
       console.log("ANYTHING");
    });
  };
  
  
});


app.controller('ChatController', ['$scope', '$http', '$routeParams', '$rootScope', function($scope, $http, $routeParams,$rootScope) {
    $scope.send = function send() {
      console.log('Sending message:', $scope.text);
      console.log('Sending message to room:', $scope.roomId);
      console.log('Is old controller available:', $scope.messages);
      $scope.messages.unshift({text:$scope.text, personEmail:$scope.userEmail[0]});
      $http.get('processcmd/post message ' + $routeParams.param + ' ' + $scope.text).success(function(data) {
        // body...

        console.log(data);
      });
    
      $scope.text = '';
    };
    
    $scope.addMember = function addMember(roomId, roomTitle){
    console.log("add email, room id: "+roomId);
    console.log("add email, room title: "+roomTitle);
    var memNameLocal = $scope.memName;
    $scope.memName = '';
    $http.get('processcmd/add email ' + memNameLocal + ' ' + roomId)
              .success(function(data){

                if (data){
                  $http.get('processcmd/person details '+data.personId).success(function(persondata){
                    var imageSourceUrl = "img/user-placeholder.png";
                    if (persondata[0].avatar !== undefined) {
                      imageSourceUrl = persondata[0].avatar;
                    }
                  $scope.membersDetailedInfo.push({personDisplayName:persondata[0].displayName, 
                              avatar:'<img src="' +imageSourceUrl+'" class="thumbnailsize img-circle"></img>'});
                     $rootScope.$broadcast("Member_Added");
                  });
                }
      
        console.log($scope.memberships);
        $scope.memberships.push(data);
              
      }); 
      $scope.$parent.addmemberinput = false;
    };
        
}]);

app.controller('CreateRoomController', function($scope , $route ,$routeParams, $window, $http , $location) 
{
  console.log('in CreateRoomController');
  $scope.room = "";
  $scope.showRoom = function()
  {
    $scope.isDisabled = true;
      
      var roomname = angular.element('#roomname').val();/* global angular*/
      console.log(angular.element('#roomname'));
      angular.element('#roomname').val('');
      angular.element('#your-modal-id').modal('hide');
      angular.element('body').removeClass('modal-open');
      angular.element('.modal-backdrop').remove();
      $scope.showModal = false;
      $http.get("processcmd/create room " + roomname).success(function(data){
        if($scope.tiles !== undefined){
          data.item.span = { row : 1, col : 2 };
          $scope.tiles.unshift(data.item);  
        }
        if($scope.exptiles !== undefined){
          data.item.span = { row : 1, col : 1 };
          $scope.exptiles.unshift(data.item);
        }

    });
    
  };
  
   $scope.showModal = false;
   $scope.toggleModal = function(){
       $scope.showModal = !$scope.showModal;
    };

});

app.controller('myconController', function($scope , $route ,$routeParams, $window, $http , $location) 
{
  $scope.param = $routeParams.param;
  $scope.getRooms = function(){
  $http.get('processcmd/list rooms').success(function(data) 
  {
    var json = data;
  
    buildGridModel({
          background: ""
            });
    function buildGridModel(tileTmpl){
        var it, results = [ ];
        for (var j=0; j<json.length; j++) 
        {
          it = angular.extend({},tileTmpl);
          var obj = json[j];
          it.title = obj.title;
          it.id = obj.id;
          it.span  = { row : 1, col : 2 };
     //     it.stringArray= ["Kaur Gurpreet", "Jha Neeraj ", "Bisht Surender"];
          results.push(it);
        }
      $scope.tiles = results;
      }
    });
  };
  $scope.getRooms();
  
  $scope.getMembers = function(roomId)
  {
    $scope.member_list = false;
    $http.get('processcmd/get members ' + roomId).success(function(data) {
    console.log("members: ",data);
    $scope.memberships = [];
    if (data){
      $scope.memberships=data;
      $scope.membersDetailedHomeInfo = [];
      data.forEach(function(item){
      $http.get('processcmd/person details '+item.personId).success(function(persondata){
          $scope.membersDetailedHomeInfo.push({personDisplayName:persondata[0].displayName, 
          avatar:persondata[0].avatar, created:item.created});
          });
        });
       console.log($scope.memberships);
     }
     document.getElementById(roomId).style.visibility='visible';
  });
  };
  
  $scope.hideMembers = function(roomId){
    console.log();
    $scope.membersDetailedHomeInfo = [];
//    $scope.member_list = false;
         document.getElementById(roomId).style.visibility='hidden';

  };

$scope.leaveRoomHome = function(roomId){
  
  $http.get("dbapi/userLoggedIn").success(function(data){
    $scope.userEmail = data;
    $http.get('processcmd/get members '+roomId+ ' '+$scope.userEmail[0]).success(function(data) {
       
       console.log(data[0].id);
       $http.get('processcmd/exit room ' + data[0].id).success(function(data) {
         console.log('leave room');
          $scope.getRooms();
          
       });

    });
  });
  };

});

app.controller('updateCtrl', function($scope, $route, $routeParams, $window, $http, $location) {
  $scope.PostDataResponse = "Update User Info and click on 'Save Changes' button";
  $scope.alertInfo = false;
  console.log("Form Update Controller Reached.");
  // get the current logged in user information (emailid)
  // using api /dbapi/userLoggedIn
  // TODO : Need to handle failure scenario as well in phase 2
  $scope.getUserEmail = function (){
    $http.get("dbapi/userLoggedIn").success(function(data){
    console.log(data);
    $scope.userEmail = data;
    return data;
    });
  };
  $scope.getUserInfo = function (userEmail){
    $http.get("dbapi/userLoggedIn").success(function(data){
      $scope.userEmail = data;
      
      $http.get("dbapi/user/"+data).success(function(result){
        console.log("USER FETCHED:");
        console.log(result);
        if (result !== null)
        {
          $scope.userName = result.name;
          $scope.userCompany = result.company;
          $scope.userWorkPhone = result.workPhone;
          $scope.userMobile = result.mobile;
        }
      });  
    });
  };
  $scope.getUserInfo();
  
  $scope.UpdateUser = function () {
    console.log("Inside Update Function");
    $scope.PostDataResponse = "Updating database .. ";
    var dataObj = {
        name: $scope.userName,
        email: $scope.userEmail,
        company: $scope.userCompany,
        workPhone: $scope.userWorkPhone,
        mobile: $scope.userMobile
    };

    $http.post('/dbapi/updUsr', dataObj)
    .success(function (data, status, headers, config) {
        $scope.alertInfo = true;
        $scope.PostDataResponse = data['message'];
        console.log(data);
    })
    .error(function (data, status, headers, config) {
        console.log(data);
    });
  };
});
app.controller('imageCtrl', function($scope, $route, $routeParams, $window, $http, $location) {

  $scope.getUserImgPth = function (userEmail){
      $http.get("dbapi/userAvatarPath/").success(function(data){
      console.log("PATH:");
      if (data == '')
      {
        data = "img/user-placeholder.png";
      }
      $scope.usrAvPth = data;
      });
  };
  $scope.getUserImgPth();
 
});
// --------------------------------------------------------------------------- //

app.controller('ViewMembersController', function($scope, $route, $routeParams, $window, $http, $location,$timeout) {

 

$scope.memberDetails = function(roomId){
   $http.get('processcmd/get members ' + roomId).success(function(data) {

    //$scope.memberships = [];
    if (data){
      //$scope.memberships=data;
    //  $scope.viewMembersInfo = ["one", "two"];
    $scope.viewMembersInfo = [];
      data.forEach(function(item){
      $http.get('processcmd/person details '+item.personId).
        success(function(persondata){
          $scope.viewMembersInfo.push({personDisplayName:persondata[0].displayName});
        //  avatar:persondata[0].avatar, created:item.created}]);
        
        console.dir($scope.viewMembersInfo);
                  $scope.$broadcast("Data_Ready");
          });
        });
     }
  });

};
});




//----------------------------------- VOICE CONTROLLER -----------------------------------------//
app.controller('VoiceController', function($scope, $route, $routeParams, $window, $http, $location, $rootScope) {
  
  console.log('Voice Controller')
  
  var final_transcript = '';
  var recognizing = false;
  var start_timestamp;
  if (!('webkitSpeechRecognition' in window)) {
    alert("Voice Command not supported in this Browser ");
  }
  else
  {
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function() {
      console.log('onstart');
      recognizing = true;
      start_img.src = '/mic-animate.gif';
    };
  
  recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      start_img.src = '/mic.png';
    }
    if (event.error == 'audio-capture') {
      start_img.src = '/mic.png';
    }
    if (event.error == 'not-allowed') {
      if (event.timeStamp - start_timestamp < 100) {
        alert('blocked');
      } else {
        alert('denied');
      }
    }
  };

  var sendRequestToServer = function(command){
    if(command == '')
    {
      var msg = new SpeechSynthesisUtterance("No input received, pleas try again!");
         window.speechSynthesis.speak(msg);
        
      alert('No input received, pleas try again!');
      //command = "leave room new";
      //command = "create room new";
      //command = "add member surdender bisht to test";
    }
    else if (command.toLowerCase().indexOf('open room') != -1 || command.toLowerCase().indexOf('open rom') != -1){
      
      var commandArr = command.split(' ');
      commandArr.splice(0,2);
      var roomName = commandArr.join(' ');
      console.log(roomName );
      var roomId = '';
      var roomList = ($scope.tiles == undefined) ? $scope.exptiles: $scope.tiles;
      for (var i=0; i<roomList.length; i++) {
        if (roomList[i].title == roomName) {
          roomId = roomList[i].id;
        }
      }
      console.log('ROOM ID: '+ roomId);
      if (roomId != '') {
        $location.url("/expanded/"+roomId +"/"+ roomName);
        $scope.$apply();
         var msg = new SpeechSynthesisUtterance(roomName + " has been opened");
         window.speechSynthesis.speak(msg);
      
      } else {
         var msg = new SpeechSynthesisUtterance("Invalid room name");
         window.speechSynthesis.speak(msg);

      }
      
    }
    else if (command.toLowerCase().indexOf('post message') != -1) {

      if ($routeParams.param == undefined) {
        var msg = new SpeechSynthesisUtterance("Open room before posting message");
         window.speechSynthesis.speak(msg);
        
      } else {
        
        var commandArr = command.split(' ');
        commandArr.splice(0,2);
        var message = commandArr.join(' ');
        console.log(message);
  
        $http.get('processcmd/post message ' + $routeParams.param + ' ' + message).success(function(data) {
        var msg = new SpeechSynthesisUtterance("Message posted successfully");
           window.speechSynthesis.speak(msg);
          console.log(data);
        });
      }
    }
    else{
      command = command.toLowerCase();

      $http.get('processcmd/'+command).success(function(data){
         console.log(data);
         //alert(data.voiceResponse);
         
         var msg = new SpeechSynthesisUtterance(JSON.stringify(data.voiceResponse));
         //alert(msg);
         window.speechSynthesis.speak(msg);
         var voiceMsg = data.voiceResponse.toLowerCase();
         
         if(voiceMsg.indexOf('invalid', 0) == -1){
            if (voiceMsg.indexOf('has been left') != -1 &&  ($routeParams.param != undefined)) {
                  $location.url("/");
            } else {
                if ($scope.exptiles !== undefined){
                    $scope.ExpandedRooms();
                } else {
                    $scope.getRooms();
                }
                if (command.indexOf('add member') != -1) {
                  if ($routeParams.param != undefined) {
                    $route.reload();
                  }
              }
            }
          }
         /*command = command.toLowerCase();
         if(command.indexOf('create room') != -1){
           if($scope.tiles !== undefined){
             data.item.span = { row : 1, col : 2 };
             $scope.tiles.unshift(data.item);  
           }
           if($scope.exptiles !== undefined){
             data.item.span = { row : 1, col : 1 };
             $scope.exptiles.unshift(data.item);
           }
         }else if(command.indexOf('leave room') != -1){
           $scope.getRooms();
         }*/
      });
    }
  };
      
    recognition.onend = function() {
        console.log ("IN recognition.onend");
        recognizing = false;
        start_img.src = '/mic.png';
       // $scope.voice_info = "";

        console.log (final_transcript);
        sendRequestToServer(final_transcript);
      };
    recognition.onresult = function(event) {
              console.log ("IN recognition.onresult: " + event);
        var interim_transcript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final_transcript += event.results[i][0].transcript;
          } else {
            interim_transcript += event.results[i][0].transcript;
          }
        }
        final_transcript = capitalize(final_transcript);
        console.log(final_transcript);
      //  final_span.innerHTML = linebreak(final_transcript);
      //  interim_span.innerHTML = linebreak(interim_transcript);
        
    };
    
    function upgrade() {
      start_button.style.visibility = 'hidden';
    }
    var two_line = /\n\n/g;
    var one_line = /\n/g;
    function linebreak(s) {
      return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
    }
    var first_char = /\S/;
    function capitalize(s) {
      return s.replace(first_char, function(m) { return m.toUpperCase(); });
    }
    
    startButton = function (event) {

      if (recognizing) {

        console.log('in end');
        recognition.stop();
        return;
      }
      final_transcript = '';
      //recognition.lang = select_dialect.value;
      recognition.lang = 'EN-US';
    
      recognition.start();
      start_img.src = '/mic-slash.gif';
      start_timestamp = event.timeStamp;
    }
    
  }
});

/*------------------------------------------------------------------------------------
//----------------------------------- VOICE CONTROLLER -----------------------------------------//
app.controller('VoiceController', function($scope, $route, $routeParams, $window, $http, $location) {
  
  console.log('Voice Controller')
  
  var final_transcript = '';
  var recognizing = false;
  var start_timestamp;
  if (!('webkitSpeechRecognition' in window)) {
    alert("Voice Command not supported in this Browser ");
  }
  else
  {
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function() {
      console.log('onstart');
      recognizing = true;
      start_img.src = '/mic-animate.gif';
    };
  
  recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      start_img.src = '/mic.png';
    }
    if (event.error == 'audio-capture') {
      start_img.src = '/mic.png';
    }
    if (event.error == 'not-allowed') {
      if (event.timeStamp - start_timestamp < 100) {
        alert('blocked');
      } else {
        alert('denied');
      }
    }
  };

  var sendRequestToServer = function(command){
    if(command == '')
    {
      alert('No input received, pleas try again!');
      //command = "leave room new";
      //command = "create room new";
      //command = "add member surdender bisht to test";
    }
    else{
      command = command.toLowerCase();

      $http.get('processcmd/'+command).success(function(data){
         console.log(data);
         //alert(data.voiceResponse);
         
         var msg = new SpeechSynthesisUtterance(JSON.stringify(data.voiceResponse));
         //alert(msg);
         window.speechSynthesis.speak(msg);
         var voiceMsg = data.voiceResponse.toLowerCase();
         
         if(voiceMsg.indexOf('invalid',0) == -1){
          $scope.getRooms();
         }
         
      });
    }
  };
      
    recognition.onend = function() {
        console.log ("IN recognition.onend");
        recognizing = false;
        start_img.src = '/mic.png';
       // $scope.voice_info = "";

        console.log (final_transcript);
        sendRequestToServer(final_transcript);
      };
    recognition.onresult = function(event) {
              console.log ("IN recognition.onresult: " + event);
        var interim_transcript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final_transcript += event.results[i][0].transcript;
          } else {
            interim_transcript += event.results[i][0].transcript;
          }
        }
        final_transcript = capitalize(final_transcript);
        console.log(final_transcript);
      //  final_span.innerHTML = linebreak(final_transcript);
      //  interim_span.innerHTML = linebreak(interim_transcript);
        
    };
    
    function upgrade() {
      start_button.style.visibility = 'hidden';
    }
    var two_line = /\n\n/g;
    var one_line = /\n/g;
    function linebreak(s) {
      return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
    }
    var first_char = /\S/;
    function capitalize(s) {
      return s.replace(first_char, function(m) { return m.toUpperCase(); });
    }
    
    startButton = function (event) {

      if (recognizing) {

        console.log('in end');
        recognition.stop();
        return;
      }
      final_transcript = '';
      //recognition.lang = select_dialect.value;
      recognition.lang = 'EN-US';
    
      recognition.start();
      start_img.src = '/mic-slash.gif';
      start_timestamp = event.timeStamp;
    }
    
  }
  
});

-------------------------------------------------------------------------------*/

app.directive('customPopover', function () {
    return {
        restrict: 'A',
        template: '<span>{{label}}</span>',
        link: function (scope, el, attrs) {
            scope.label = attrs.popoverLabel;
            $(el).popover({
                trigger: 'click',
                html: true,
                content: attrs.popoverHtml,
                placement: attrs.popoverPlacement
            });
        }
    };
});
app.directive('confirmationNeeded', function () {
  return {
    priority: 1,
    terminal: true,
    link: function (scope, element, attr) {
      var msg = attr.confirmationNeeded || "Are you sure?";
      var clickAction = attr.ngClick;
      element.bind('click',function () {
        if ( window.confirm(msg) ) {
          scope.$eval(clickAction)
        }
      });
    }
  };
});

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13 && !event.shiftKey) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

app.directive('scroll', function($timeout) {
  return {
    restrict: 'A',
    link: function(scope, element, attr) {
      scope.$watchCollection(attr.scroll, function(newVal) {
        $timeout(function() {
         element[0].scrollTop = element[0].scrollHeight;
        });
      });
    }
  };
});

app.directive('modal', function () {
    return {
      template: '<div class="modal fade">' + 
          '<div class="modal-dialog">' + 
            '<div class="modal-content">' + 
              '<div class="modal-header">' + 
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
              '</div>' + 
              '<div class="modal-body" ng-transclude></div>' + 
            '</div>' + 
          '</div>' + 
        '</div>',
      restrict: 'E',
      transclude: true,
      replace:true,
      scope:true,
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;

        scope.$watch(attrs.visible, function(value){
          if(value == true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
  });
  
app.directive('homePopover', function($compile, $timeout,$http){
  return {
    restrict: 'A',
    scope: {
      myDirectiveVar: '='
    },
    link:function(scope, el, attrs){
      console.log('in home popover directive');
      var content = attrs.content; //get the template from the attribute
      var elm = angular.element('<div />'); //create a temporary element
      elm.append(attrs.content); //append the content
      $compile(elm)(scope); //compile 
      $http.get('processcmd/get members ' + scope.myDirectiveVar).success(function(data) {
        if (data){
          scope.viewMembersInfo = [];
          data.forEach(function(item){
            $http.get('processcmd/person details '+item.personId).
            success(function(persondata){
              var imageSourceUrl = "img/user-placeholder.png";
              if (persondata[0].avatar !== undefined) {
                imageSourceUrl = persondata[0].avatar;
              }
              scope.viewMembersInfo.push({personDisplayName:persondata[0].displayName,
                                          avatar:'<img src="' +imageSourceUrl+'" class="thumbnailsize img-circle"></img>'});
                  scope.$broadcast("Member_List_Ready");
            });
          });
        }
      });
      scope.$on("Member_List_Ready",function() { //Once That is rendered
        $timeout(function(){el.removeAttr('popover').attr('data-content',elm.html()); //Update the attribute
        el.popover(); //set up popover
        });
       });
    }
  };
});

  
app.directive('popover', function($compile, $timeout,$rootScope){
  return {
    restrict: 'A',
   
    link:function(scope, el, attrs){
      console.log('in directive');
      var content = attrs.content; //get the template from the attribute
      var elm = angular.element('<div />'); //create a temporary element
      elm.append(attrs.content); //append the content
      $compile(elm)(scope); //compile 

   //   scope.$on("Data_Ready",function() { //Once That is rendered
        scope.$watch("scope.membersDetailedInfo", function(){        
          console.log("IN 1");
          
        $timeout(function(){el.removeAttr('popover').attr('data-content',elm.html()); //Update the attribute
        el.popover(); //set up popover
        });
       });
       
       $rootScope.$on('Member_Added', function(){        
        console.log("IN 2");
        $timeout(function(){el.removeAttr('popover').attr('data-content',elm.html()); //Update the attribute
        el.popover(); //set up popover
        });
       });
    }
  };
});


app.directive('popover', function($compile, $timeout){
  return {
    restrict: 'A',
    link:function(scope, el, attrs){
      console.log('in directive')
      var content = attrs.content; //get the template from the attribute
      var elm = angular.element('<div />'); //create a temporary element
      elm.append(attrs.content); //append the content
      $compile(elm)(scope); //compile 
      scope.$on("Data_Ready",function() { //Once That is rendered
        
        $timeout(function(){el.removeAttr('popover').attr('data-content',elm.html()); //Update the attribute
        el.popover(); //set up popover
        });
       });
    }
  };
});


app.config(function($routeProvider) 
{
$routeProvider.when('/expanded/:param/:title', {
        templateUrl: 'first.html',
        controller: 'expand'
      })
.when('/home', {
        templateUrl: 'home.html',
        controller: 'myconController'
      })
.when('/profile', {
        templateUrl: 'profile.html',
        controller: 'myconController'
      })
.when('/about', {
        templateUrl: 'about.html',
        controller: 'myconController'
      })
.otherwise({
        redirectTo: '/home'
      });
  });


app.directive('tooltip', function() {
    return {
      restrict: "A",
      link: function(scope, element) {
        $(element).tooltip({
          html: 'true'
        });
      }
    };
  });

app.filter('reverse', function() {
  return function(items) {
    if (items)
    {
      return items.slice().reverse();
    }
  };
});

app.filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});


// Defining filter below to cut the string in sub string and display only a part
// followed by tail symbol.
// e.g. TestStringLongExample will be converted to Test.. when
// used with filter==>  cut:true:4:' ...'
app.filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                  //Also remove . and , so its gives a cleaner result.
                  if (value.charAt(lastspace-1) == '.' || value.charAt(lastspace-1) == ',') {
                    lastspace = lastspace - 1;
                  }
                  value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    });


