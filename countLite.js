/*
 *****************************************************
 * Count Lite Plugin
 *
 * @author    Ryan Davis <ryan@mediaflydesign.com>
 * @version   Release: 1.0.1
 * @modified  5/16/12
 *
 * Licences: MIT, GPL
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 ******************************************************
*/
;(function ( $, window, document, undefined ){
	/**
	 * Settings
	*/
	var pluginName = 'countLite',
        /* Default params and functions */
		defaults = {
            /* Max Views */
			views: 10,
			/* Cookie Days */
			days: 7,
			/* Plugin Instance */
			instance: 'cl_',
			/* Track Unique Paths? */
			uniquePathViews: false,
			/* Max View Callback */
			maxViews: function(){},
			/* On Load Callback */
			callBack: function(){}
        };
	
	/**
     * Constructor
    */
    function Plugin( element, options ){
        /* Constants */
		this.element = element;
        this.options = $.extend( {}, defaults, options) ;
        this._defaults = defaults;
        this._name = pluginName;
		
		/* Cookie Data */
		this._cookieName = this.options.instance+'count';
		this._cookieDate = this.options.instance+'date';
		this._cookiePage = this.options.instance+'page';
		
		/* Initialize Plugin */
        this._init();
    }
	
	/**
     * Plugin Object
    */
    Plugin.prototype = {
		/**
		 * Initialize
		*/
		_init: function(){
			/* check cookies */
			var cookiesEnabled = ( navigator.cookieEnabled ) ? true : false;
			if( !cookiesEnabled ) return false;
			
			/* Make sure values are not strings */
			this.options.days = parseInt(this.options.days);
			this.options.views = parseInt(this.options.views);
			
			/* Current Data Count */
			var currentCount = this._getViews();
			var remaining = (this.options.views-currentCount);
			
			/* Call Back Vars */
			var callBackData = {'count': currentCount, 'views':this.options.views, 'remaining':remaining, 'days':this.options.days };
			
			/* Onload Event */
			this.options.callBack( callBackData );
			
			/* Max Views Fire Load Event */
			if( currentCount >= this.options.views ){
				this.options.maxViews( callBackData );
			
			} else {
				/* Track page as viewed */
				if( this.options.uniquePathViews ) this._pageTracked();
				/* Increment Counter */
				if( !this.options.uniquePathViews || this.options.uniquePathViews && !this._pageWasTracked() ) this._addView( currentCount );
			}	
		},
		
		/**
		 * Current Views
		*/
		_getViews: function(){
			/* Set first instance cookies */
			if( !this._readCookie(this._cookieName) ) this._setCookie( this._cookieName, 1, this.options.days );
			if( !this._readCookie(this._cookieDate) ) this._setCookie( this._cookieDate, this._expireDate(), this.options.days );
			
			/* Int val */
			return parseInt( this._readCookie(this._cookieName) );
		},
		
		/**
		 * Add View
		*/
		_addView: function( count ){
			var count = ( count + 1 );
			this._setCookie( this._cookieName, count, null, this._expireDate( true ) );
		},
		
		/**
		 * Cookie Page
		 *
		*/
		_pageTracked: function(){
			this._setCookie( this._cookiePage, 1, null, this._expireDate( true ), 1 );
		},
		
		/**
		 * Read Page Cookie
		*/
		_pageWasTracked: function(){
			return this._readCookie( this._cookiePage );
		},
		
		/**
		 * Set Cookies
		 *
		*/
		_setCookie: function( name, value, days, date, path ){
			if(days){
				var expires = "; expires="+this._expireString(this.options.days);
			} else if(date){
				var expires = "; expires="+date;
			} else {
				var expires = "; expires="+this._expireString(-2);
			}
			path = ( !path ? '/' : null );
			document.cookie = name+"="+value+expires+"; path="+path;
		},
		
		/**
		 * Get Cookies
		*/
		_readCookie: function( name ){
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for( var i=0; i < ca.length; i++ ){
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1,c.length);
				if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
			}
			return null;
		},
		
		/**
		 * Delete Cookies
		*/
		_deleteCookie: function( name ){
			this._setCookie( name, '', null);
		},
		
		/**
		 * Expire String
		*/
		_expireString: function( days ){
			if( !days ) return null;
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			return date.toGMTString();
		},
		
		/**
		 * Expire Date
		*/
		_expireDate: function( fromCookie ){
			/* Return Stored Cookie Date */
			if( fromCookie ) return this._readCookie(this._cookieDate);
			
			/* Fresh Date */
			return this._expireString(this.options.days);
		},
		
		/**
		 * Destroy Counts
		*/
		destroy: function(){
			this._deleteCookie(this._cookieName);
			this._deleteCookie(this._cookieDate);
			this._deleteCookie(this._cookiePage);
		}
    };
	
	/**
	 * Plugin Wrapper
	*/
    $.fn[pluginName] = function( options ){
		return this.each(function(){
            if(!$.data(this, pluginName)){
                $.data(this, pluginName, new Plugin( this, options ));
            }
        });
    }
	
})( jQuery, window, document );