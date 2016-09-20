exports.handleReq=function(req,res)
{
 //   console.log("Request param: " + "");
 //   console.log(" Access Token in session " + req.session.AccessToken);
 //   console.log(" User email in session " + req.session.userEmails);
    //var authToken = req.session.AccessToken;
    var authToken = req.session.AccessToken || process.env.AT;
    var userEmail = req.session.userEmails || process.env.Email;
    if (authToken == undefined)
    {
        console.log ("Authorization Failed");
        res.send("AUTH_FAILED_ERROR");
        return;
    }
    var spell = require("spell");
    // instantiate a new dictionary
    var dict = spell();
    // load text into dictionary so we can train the dictionary to know
    // which words exists and which ones are more frequent than others
    dict.load("create room list rooms add member get messages create webhook post message get members person details add email leave exit delete");

    // parse the input
    var input = req.params.id;//.toLowerCase();
    var parts = input.split(' ');
    var dictout1 = dict.suggest(parts[0]);
    if (dictout1 == '')
    {
        console.log ("Invalid Command");
        //res.send({data:"INVALID COMMAND"}, {voiceResponse:"Invalid Command"});
        res.status(200).send({data:"INVALID COMMAND", voiceResponse:"Invalid Command"});
        return;
    }
    var command1=dictout1[0].word;

    var dictout2 = dict.suggest(parts[1]);
    if (dictout2 == '')
    {
        console.log ("Invalid Command");
        res.status(200).send({data:"INVALID COMMAND", voiceResponse:"Invalid Command"});
        return;
    }
    var command2=dictout2[0].word;
    var command = command1 + ' ' + command2;
  //  console.log('command:' + command);

    var getMemberDetails = function(memInput, fn){
        var Members = require('../models/members');
        Members.findOne(memInput, function(err, memDetails){
        if(err) throw err;
        fn(null, memDetails);
        });
    };

    var getSparkRooms = function(fn){
        var options = {
                       url: 'https://api.ciscospark.com/v1/rooms/',
                       auth: {
                            bearer: authToken
                        }};
        var request = require('request');
        request(options, function(error, response, body){
            if(error)throw error;
            if (!error && response.statusCode == 200) {
                fn(null, JSON.parse(body));
            }/* else {
                res.send("STATUS CODE: " + response.statusCode);
            }*/
        });
    };


    var getRoomMessages = function(roomId, fn){
        var options = {
                        url: 'https://api.ciscospark.com/v1/messages/',
                        auth: {
                           bearer: authToken
                        },
                        qs : {
                            roomId: roomId
                        }
                    };
        var request = require('request');
        request(options, function(error, response, body){
            if(error)throw error;
            if (!error && response.statusCode == 200) {
                fn(null, JSON.parse(body));
            } else {
                res.send("STATUS CODE: " + response.statusCode);
            }
        });
    };
    
    var getRoomMembers = function(roomId, memberEmail, fn){

        var options = {
                        url: 'https://api.ciscospark.com/v1/memberships/',
                        auth: {
                           bearer: authToken
                        },
                        qs : {
                            roomId: roomId
                        }
                    };
        if(memberEmail != '')
        {
            options.qs.personEmail = memberEmail;
        }
        var request = require('request');
        request(options, function(error, response, body){
            if(error)throw error;
            if (!error && response.statusCode == 200) {
                fn(null, JSON.parse(body));
            }/* else {
                console.log(body);
                res.send("STATUS CODE: " + response.statusCode);
            }*/
        });
    };
    
    var getPersonDetails = function(personId, fn){
        var options = {
                        url: 'https://api.ciscospark.com/v1/people/'+personId,
                        auth: {
                           bearer: authToken
                        }
                        
                    };
        var request = require('request');
        request(options, function(error, response, body){
            if(error)throw error;
            if (!error && response.statusCode == 200) {
                fn(null, JSON.parse(body));
            } else {
                res.send("STATUS CODE: " + response.statusCode);
            }
        });
    };
    
    /*
    var createMsgWebook = function(roomId, fn){
        console.log("In createMsgWebook: room id " + roomId);
       var request = require('request');
            var options = {
                url: 'https://api.ciscospark.com/v1/webhooks', 
                method: 'POST',
                auth: {
                        bearer: authToken

                      },
                form: {
                        name: "Webhook for messages",
                        targetUrl: "https://audcom-nkj0305.c9users.io/",
                        resource: "messages",
                        event: "created",
                        filter: "roomid="+roomId
                      }
                };
            
            request(options, function(error, response, body){
                if(error)throw error;
                if (!error && response.statusCode == 200){
                    fn(null, JSON.parse(body));
                } else {
                    console.log(body);
                    console.log(response.statusCode);
                    res.send("STATUS CODE: " + response.statusCode);
                }
            });
    };
    
    var getWebhookMsgs = function(resourceId, fn){
        var request = require('request');
        var options = {
            url: 'https://api.ciscospark.com/v1/messages/'+resourceId, 
            method: 'GET',
            auth: {
                bearer: authToken

                  }
        };
        request(options, function(error, response, body){
            if(error)throw error;
            if (!error && response.statusCode == 200){
                fn(null, JSON.parse(body));
            } else {
                console.log(body);
                console.log(response.statusCode);
                res.send("STATUS CODE: " + response.statusCode);
            }
        });
    };
    */
    var addMemberHandler = function(error, response, body) {
        if (error)throw error;
        if (!error) {
            if (response.statusCode == 200) {
                var obj = JSON.parse(body);
                var offset = obj.personDisplayName.indexOf('-X');
                if (offset != -1) {
                    res.send({voiceResponse: obj.personDisplayName.substr(0, offset) + ' has been added'});
                } else {
                    res.send({voiceResponse:obj.personDisplayName + ' has been added'});  
                }
                /*
                getMemberDetails({email:obj.personEmail}, function(err, memDetails){
                    if(err)throw err;
                    res.send(memDetails.name + ' has been added');    
                });*/
                
            } else if (response.statusCode == 409) {
                res.send ({voiceResponse: "Member already exists"});
            } else {
                res.send({voiceResponse: 'Response Code: ' + response.statusCode});
            }
        }
    };
    
    var postMessageInRoom = function(roomId, text, fn){
   //     console.log("In post message: room id " + roomId);
       var request = require('request');
            var options = {
                url: 'https://api.ciscospark.com/v1/messages', 
                method: 'POST',
                auth: {
                        bearer: authToken

                      },
                form: {
                        roomId: roomId,
                        text: text,
                      }
                };
            
            request(options, function(error, response, body){
                if(error)throw error;
                if (!error && response.statusCode == 200){
                    fn(null, JSON.parse(body));
                } else {
            //        console.log(body);
              //      console.log(response.statusCode);
                    res.send("STATUS CODE: " + response.statusCode);
                }
            });
    };
    var deleteRoomById = function(roomId, fn){
        var request = require('request');
        var options = {
            url: 'https://api.ciscospark.com/v1/rooms/'+roomId, 
                method: 'DELETE',
                auth: {
                        bearer: authToken
                      }
            };
        request(options, function(error, response, body){
                if(error)throw error;
                if (!error){
                    fn(null, JSON.parse(body));
                } else {
                //    console.log(body);
                //    console.log(response.statusCode);
                    res.send("STATUS CODE: " + response.statusCode);
                }
        });
    };
    var addMemberByEmail = function(emailId, roomId, fn){
    //    console.log("email id: " + emailId + ', room Id: ' + roomId );
        
        var request = require('request');
        var options = {
            url: 'https://api.ciscospark.com/v1/memberships', 
                method: 'POST',
                auth: {
                        bearer: authToken
                      },
                form: {
                        roomId: roomId,
                        personEmail: emailId,
                        isModerator: false
                      }
                
                };
            request(options, function(error, response, body){
                if(error)throw error;
                if (!error){
                    fn(null, JSON.parse(body));
                } else {
                //    console.log(body);
                //    console.log(response.statusCode);
                    res.send("STATUS CODE: " + response.statusCode);
                }
        });
    };
    
    var deleteMembership = function(membershipId, fn){
    //    console.log("membership id: " + membershipId );
        var request = require('request');
        var options = {
            url: 'https://api.ciscospark.com/v1/memberships/'+membershipId, 
                method: 'DELETE',
                auth: {
                        bearer: authToken
                      }
                };
            request(options, function(error, response, body){
                if(error)throw error;
        //        console.log(response.statusCode);
                if (!error && response.statusCode == 200 || response.statusCode == 204){
                    fn(null, response.statusCode);
                }
            });
    };

    switch(command)
    {
        case "add member":
        {
            // COMMAND SYNTAX: "add memebr <Member Name of n word> to <Room name of n words"
            // Remove the first two elements from the array
            parts.splice(0,2);
            var cmd_input = '';
            if(parts.indexOf('2') != -1){
                cmd_input = parts.join(' ').split('2');
            } else {
                cmd_input = parts.join(' ').split('to');
            }
            
        //    console.log(cmd_input);
            if (cmd_input.length > 1 && cmd_input[0] != '' && cmd_input[1] != '') {
                var memName = cmd_input[0].trim();
                var roomName = cmd_input[1].trim();
            //    console.log('member name: ' + memName + ', room name: '+ roomName);
                var async = require('async');
                async.parallel({
                    RoomsInfo: getSparkRooms,
                    MemInfo: getMemberDetails.bind(null, {name:{$regex : new RegExp(memName, "i")}})
                },
                function (err, results){
                    if (err)throw err;
                    if (results.MemInfo == null) {
                        res.send({voiceResponse:"INVALID MEMBER NAME"});
                        return;
                    }
                    if (results.RoomsInfo == null) {
                        res.send({voiceResponse: "NO ROOMS PRESENT"});
                        return;
		            }   
		            var emailId = results.MemInfo.email;
		            var roomId = '';
                    results.RoomsInfo.items.forEach(function(item) {
                    if (item.title.toLowerCase() == roomName) {
                        roomId = item.id;
                    }
                    });
                    if (roomId == '') {
                        res.send({voiceResponse:"INVALID ROOM NAME"});
			            return;
		            }
                //    console.log("ROOM ID: " + roomId +", EMAIL ID: "+emailId);
                    var request = require('request');
                    var options = {
                    url: 'https://api.ciscospark.com/v1/memberships', 
                    method: 'POST',
                    auth: {
                            bearer: authToken
                          },
                    form: {
                            roomId: roomId,
                            personEmail: emailId,
                            isModerator: false
                          }
                    };
                    addMemberHandler.bind(null, memName);
                    request(options, addMemberHandler);
		        });
            } else {
               res.send("INVALID COMMAND ARGUMENTS");
               return;
            }
            return;
        }
        case "create room":
        {
            parts.splice(0,2);
            var title = parts.join(' ');
        //    console.log ('title: ' + title);
            var request = require('request');
            var options = {
            url: 'https://api.ciscospark.com/v1/rooms/', 
            method: 'POST',
            auth: {
                    bearer: authToken
                  },
            form: {
                    title: title
                  }
            };
            request(options, createRoomHandler);
            return;
        }
    
        case "list rooms":
        {
            getSparkRooms(function(err, rooms){
                if(err) throw err;
                if(rooms){
                    var roomDetails = [];
                    rooms.items.forEach(function(item){
                        roomDetails.push(item);
                    });
                    res.send(roomDetails);
                    return;
                } else {
                res.send('No rooms exist');
                }
           });
           break;
        }
        case "exit room":
        {
            parts.splice(0,2);
            var membershipId = parts[0];
        //    console.log ('membership id: ' + membershipId);
            
            deleteMembership(membershipId, function(err, responseCode){
                if(err)throw err;
                if(responseCode){
                    
                    res.send({responseCode:responseCode});
                }
            });
            break;
        }
        case "leave room":
        {
            parts.splice(0,2);
            var roomName = parts.join(' ');
        //    console.log ('room id: ' + roomName);
            
            getSparkRooms(function(err, rooms) {
                if(err)throw err;
                if(rooms){
                    var roomId = '';
                    
                    rooms.items.forEach(function(item) {
                    if (item.title.toLowerCase() == roomName) {
                        roomId = item.id;
                        
                    }
                    });
                    if (roomId == '') {
                        res.send({voiceResponse:"INVALID ROOM NAME"});
			            return;
		            }
		            else{
		                getRoomMembers(roomId, userEmail, function(err, members){
                            if(err)throw err;
                            if(members){
                                var deleteMemId = '';
                                for (var i=0; i<members.items.length; i ++){
                                    if (members.items[i].personEmail == userEmail){
                                        deleteMemId = members.items[i].id;
                                    }
                                }
                                if (deleteMemId != '') {
                                    deleteMembership(deleteMemId, function(err, responseCode){
                                        if(err)throw err
                                        if(responseCode){
                                            res.send({voiceResponse:roomName +' has been left'}
                                            );
                                        }
                                    });
                                }
                                else {
                                    res.send({voiceResponse: "Member already exited"});
                                }
		                    }
                        });
		            }
                }
            });
            break;
        }
        case "get messages":
        {
            parts.splice(0,2);
            var roomId = parts.join(' ');
            var messageList = [];
            getRoomMessages(roomId, function(err, messages){
                if(err)throw err;
                if(messages){
                    messages.items.forEach(function(item){
                        if (item)
                        messageList.push(item);
                    });
                }
                res.send(messageList);
            });
            break;
        }
        case "person details":
        {
            parts.splice(0,2);
            var personId = parts.join(' ');
            var personDetails = [];
            getPersonDetails(personId, function(err, details){
                if(err)throw err;
                if(details){
                        if (details)
                        personDetails.push(details);
                
                }
                res.send(personDetails);
            });
            break;
        }
        case "post message":
        {
            parts.splice(0,2);
            roomId = parts[0];
            parts.splice(0,1);
            var msg = parts.join(' ');
            postMessageInRoom(roomId, msg, function(err, response){
                if(err)throw err;
                res.send(response);
            });
            break;
        }
        /*
        case "create webhook":
        {
            parts.splice(0,2);
            roomId = parts.join(' ');
            console.log ('roomId: ' + roomId);
            createMsgWebook(roomId, function(err, response){
                if(err)throw err;
                res.send(response);
            });
            break;
        }
        case "webhook messages":
        {
            parts.splice(0,2);
            var resourceId = parts.join(' ');
            console.log ('resource id: ' + resourceId);
            getWebhookMsgs(resourceId, function(err, response){
            if(err)throw err;
                res.send(response);
            });
            break;
        }
        */
        case "get members":
        {
            parts.splice(0,2);
            roomId = parts[0];
            var memberEmail = ''
            if (parts[1] != undefined)
            {
                memberEmail = parts[1];
            }
            var membersList = [];
            getRoomMembers(roomId, memberEmail, function(err, members){
                if(err)throw err;
                if(members){
                    members.items.forEach(function(item){
                        if (item)
                        membersList.push(item);
                    });
                }
                res.send(membersList);
            });
            break;
        }
        case "delete room":
        {
            parts.splice(0,2);
            roomId = parts[0];
            deleteRoomById(roomId, function(err, response){
                if(err)throw err;
                res.send(response);
            })
            break;
        }
        case "add email":
        {
            parts.splice(0,2);
            var emailId = parts[0];
        //    console.log ('email id: ' + emailId);
            roomId = parts[1];
        //    console.log ('room id: ' + roomId);
            addMemberByEmail(emailId, roomId, function(err, response){
                if(err)throw err;
                res.send(response);
            });
            break;
        }
        default:{
            res.send({data:'COMMAND NOT FOUND', voiceResponse:'COMMAND NOT FOUND'});
            return;
        }
    }
  
    function createRoomHandler (error, response, body) {
        if (!error && response.statusCode == 200) {
            var obj = JSON.parse(body);
            //res.send(obj.title + ' created');
            res.send({item:obj, voiceResponse:obj.title+' created'});
        } else {
            res.send({voiceResponse: 'Response Code: ' + response.statusCode});
        }
    }

};
