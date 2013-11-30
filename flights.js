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
        {   "html": "The flight from "+leaving_from+" to "+arriving_at+" is currently at $"+lowest_cost+", leaving on "
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

    console.log('price updated to '+price+' for '+ id);      
}

function getFlexString(flex_string){
    if(flex_string == "0"){
        return '';
    }else if(flex_string =="+-3"){
        return '-flexible';
    }else if(flex_string=="+-2"){
        return '-flexible-2days';
    }else if(flex_string=="+-1"){
        return '-flexible-1day';
    }else if(flex_string=="+1"){
        return '-flexible-1day-after';
    }else if(flex_string=="-1"){
        return '-flexible-1day-before';
    }else{
        return '';
    }
}

function padDate(num){
    if(num < 10){
        return '0'+num;
    }else{
        return num;
    }
}

function padLoc(loc, pad){
    if(pad==1){
        return loc+',nearby';
    }else{
        return loc;
    }
}

function getUserAgent(){
    var items = Array(
        'Mozilla/5.0 (Windows NT 6.1; rv:9.0) Gecko/20100101 Firefox/9.0',
        'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/525.19 (KHTML, like Gecko) Chrome/1.0.154.53 Safari/525.19',
        'Opera/9.80 (X11; Linux i686; U; ru) Presto/2.8.131 Version/11.11',
        'Mozilla/5.0 (X11; Linux i686 on x86_64; rv:12.0) Gecko/20100101 Firefox/12.0');
    return items[Math.floor(Math.random()*items.length)];
}

// TODO figure out if you should have num=20 or not
$.ajax({
    type: "GET",
    url: 'http://arankhanna.com/queryjson.php?num=20',
    dataType: 'json',
    success: function (data) {

        var trip_queries = data;

        var completed = 0;

        trip_queries.forEach(function (entry){

            var today = new Date();

            var p = entry.departing.split(/[- :]/);
            var t = entry.returning.split(/[- :]/);

            var depart_time = new Date(p[0], p[1]-1, p[2]);
            var return_time = new Date(t[0], t[1]-1, t[2]);

            var return_flex = getFlexString(entry.returning_flexible);
            var depart_flex = getFlexString(entry.departing_flexible);

            if (today < depart_time && depart_time < return_time){

                var depart_month = padDate(depart_time.getMonth()+1);
                var depart_day = padDate(depart_time.getDate());
                var return_month = padDate(return_time.getMonth()+1);
                var return_day = padDate(return_time.getDate());

                var arriving_at = padLoc(entry.arriving_at, entry.arriving_nearby);
                var leaving_from = padLoc(entry.leaving_from, entry.leaving_nearby);
                var departing = depart_time.getFullYear()+'-'+depart_month+'-'+depart_day+depart_flex;
                var returning = return_time.getFullYear()+'-'+return_month+'-'+return_day+return_flex;
                var price_floor = entry.price_floor;
                var owners = entry.owners;
                var query_id = entry.id;

                var query = "http://www.kayak.com/flights/"+leaving_from+"-"+arriving_at+"/"+departing+"/"+returning;

                console.log('seraching for flights from '+leaving_from+' to '+arriving_at+' from '+departing+' till '+returning+' lower than '+price_floor+' for '+owners+' with query '+ query);

                var page = require('webpage').create();
                page.settings.userAgent = getUserAgent();
                
                console.log('The user agent is ' + page.settings.userAgent);

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

                            // Log an error sceen shot of the page if no price is found
                            if(lowest_cost == Number.MAX_VALUE){
                                page.render('errors/'+leaving_from+'-'+arriving_at+departing+returning+'.png');
                            }

                            updateFlight(query_id, lowest_cost);

                            completed++;    
                        });        
                    }
                });
            }else{
                console.log('invalid date range');
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


