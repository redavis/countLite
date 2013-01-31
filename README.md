CountLite
=========

Is a small jQuery plugin for calling actions based on client side page views.

### Features:
* Lightweight (5k)
* Run Multiple Instances
* No Server Side Code Needed

### Possible Use Cases:
* Display Messages
* Registration/Paywall Events
* Limit Ad Views


Usage
-----

### Basic

$(function(){
    $(document).countLite({
    	views: 5, // max views
   	 maxViews: function(data){
    	// do something
   	 }
    });
});

### Advanced

$(function(){
    $('#counter-message').countLite({
    	views: 5, // max views
   	 days: 30, // cookie day length
    	maxViews: function(data){
    		// do something
    	},
    	callBack: function(data){
    		if( data.count == 1 ){
    			// first page view
		} else if( data.remaining == 1 ){
    			// last view before maxViews is called
    		} else {
    			// steps between first and last
    		}
    	}
    });
});

