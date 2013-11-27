/**
 * This script is the exclusive work and property of Aran Khanna
 * Any use or reproduction of any part of this document without his express concent is
 * expressly forbidden and punishable by testicular torsion.
**/
// require('/home/ubuntu/jquery-2.0.3.js');

require('C:/Users/Aran/Dropbox/CS Share/flights/jquery-2.0.3.js');

/**
 * Wait until the test condition is true or a timeout occurs. Useful for waiting
 * on a server response or for a ui change (fadeIn, etc.) to occur.
 *
 * @param testFx javascript condition that evaluates to a boolean,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
 * as a callback function.
 * @param onReady what to do when testFx condition is fulfilled,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
 * as a callback function.
 * @param timeOutMillis the max amount of time to wait. If not specified, 3 sec is used.
 */
function waitFor(testFx, onReady, timeOutMillis) {
    console.log('looping');
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 60000, //< Default Max Timout is 60s
    start = new Date().getTime(),
    condition = false,
    interval = setInterval(function() {
        if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
            // If not time-out yet and condition not yet fulfilled
            condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
        } else {
            if(!condition) {
                // If condition still not fulfilled (timeout but condition is 'false')
                console.log("'waitFor()' timeout");
                typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                clearInterval(interval); //< Stop this interval
            } else {
                // Condition fulfilled (timeout and/or condition is 'true')
                console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                clearInterval(interval); //< Stop this interval
            }
        }
    }, 250); //< repeat check every 250ms
};

/**
 * Send a structured email, via the mandrill rest api, and AJAX
 */
function sendMail(leaving_from, arriving_at, lowest_cost, departing, returning, query, owners){

    var all_recipient_objects = [];
    var recipients = owners.split(',');
    recipients.forEach(function (entry){
        recipient_object = { "email": entry };
        all_recipient_objects.push(recipient_object);
    });

    var data = {
        "key": "FCppeY-FJBY6_Mvtq_rMKQ",
        "message": 
{            "html": "The flight from "+leaving_from+" to "+arriving_at+" is currently at $"+lowest_cost+", leaving on "
                    +departing+" and returning on "+returning+" <a href='"+query+"'>BUY IT NOW</a>",
            "text": "The flight from "+leaving_from+" to "+arriving_at+" is currently at $"+lowest_cost+", leaving on "
                    +departing+" and returning on "+returning+" get it at: "+query,
            "subject": "$"+lowest_cost+" to "+arriving_at,
            "from_email": "8guys1block@gmail.com",
            "from_name": "FlightGuru",
            "to": all_recipient_objects
        },
        "async": false
    };


    $.ajax({
        type: "POST",
        url: 'https://mandrillapp.com/api/1.0/messages/send.json',
        data: data
    });

    console.log('mail sent');
}


function updateFlight(id, price){
    var data = {"id":id,
                "price": price}
    $.ajax({
        type: "POST",
        url: 'http://arankhanna.com/updateflight.php',
        data: data
    });  

    console.log('price updated');      
}


function unpack(data){
    data.forEach(function (entry){
        
    });
}

// TODO implement better logging for error
$.ajax({
    type: "GET",
    url: 'http://arankhanna.com/queryjson.php',
    dataType: 'json',
    success: function (data) {

        var trip_queries = unpack(data);

        var completed = 0;

        trip_queries.forEach(function (entry){

            var today = new Date();

            var t = entry.departing.split(/[- :]/);
            
            var date_to_leave = new Date(t[0], t[1]-1, t[2]);

            var p = entry.returning.split(/[- :]/);

            var date_to_return = new Date(p[0], p[1]-1, p[2]);

            if (today < date_to_leave && date_to_leave < date_to_return){
                var departing = t[1]+'/'+t[2]+'/'+t[0];
                var returning = p[1]+'/'+p[2]+'/'+p[0];
                var leaving_from = entry.leaving_from;
                var arriving_at = entry.arriving_at;
                var price_floor = entry.price_floor;
                var owners = entry.owners;
                var query_id = entry.id;

                var query = 'http://www.kayak.com/s/search/air?d1=' +departing+'&depart_flex=3&d2=' +returning+'&return_flex=3&l1='+ leaving_from +'&l2='+ arriving_at;

                console.log('seraching for flights from '+leaving_from+' to '+arriving_at+' from '+departing+' till '+returning+' lower than '+price_floor+' for '+owners);

                // TODO randomize user agent
                var page = require('webpage').create();
                page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; rv:9.0) Gecko/20100101 Firefox/9.0';
                console.log('The default user agent is ' + page.settings.userAgent);

                page.open(query, function (status) {
                    // Check for page load success
                    if (status !== "success") {
                        console.log("Unable to access network");
                    } else {
                        // Wait for 'signin-dropdown' to be visible
                        waitFor(function() {
                            // Check in the page if a specific element is now visible
                            return page.evaluate(function() {
                                if (document.getElementById('progressDiv') == null){
                                    return true;
                                }else{
                                    return false;
                                }
                            });
                        }, function() {
                            console.log("The data has loaded.");
                            var nonstop = page.evaluate(function () {
                                try{
                                    return document.getElementById('fs_stops_0_price').textContent.substring(1);
                                }
                                catch(err){
                                    return Number.MAX_VALUE;
                                }
                            });
                            var one_stop = page.evaluate(function () {
                                try{
                                    return document.getElementById('fs_stops_1_price').textContent.substring(1);
                                }
                                catch(err){
                                    return Number.MAX_VALUE;
                                }
                            });
                            var two_or_more_stop = page.evaluate(function () {
                                try{
                                    return document.getElementById('fs_stops_2_price').textContent.substring(1);
                                }
                                catch(err){
                                    return Number.MAX_VALUE;
                                }
                            });

                            var lowest_cost = Math.min(nonstop, one_stop, two_or_more_stop);

                            if(lowest_cost <= price_floor){
                                console.log('Price floor broken, sending alert');
                                sendMail(leaving_from, arriving_at, lowest_cost, departing, returning, query, owners);
                            }

                            updateFlight(query_id, lowest_cost);

                            completed++;    
                        });        
                    }
                });
            }else{
                completed++;
            }
        });

            
        var interval = setInterval(function (){
            if(completed==trip_queries.length){
                phantom.exit();
            }
        }, 2000);
    }
});


