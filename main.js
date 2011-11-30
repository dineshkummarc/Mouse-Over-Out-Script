var app = {};

/**
 * Following method will reset the specified elements style value (using CSS syntax)
 * 
 * @param element { Element } the HTML element to reset the position for
 * @param setting { Object } the property name is the CSS (CSS syntax) property we need to set and the value is the CSS property value
 * @return undefined {  } no explicitly returned value
 */
app.styleElement = function(element, settings) {
	var normalise = '';
	
	for (var i in settings) {
		// Firefox was the only browser that didn't recognise 'border-bottom' (uses 'borderBottom' instead).
		// But all browsers recognised 'borderBottom' so we convert CSS syntax into camelCase format.
		//normalise += st.utils.toCamelCase(i) + ':' + settings[i] + ';';
		normalise += i + ':' + settings[i] + ';'; // took off toCamelCase as it broke z-index
	}
	
	// CAREFUL! This may be better than constantly touching the DOM and setting individual styles,
	// But it will over-write all previously set styles!
	element.style.cssText = normalise;
};

app.eventsCalendar = function() {
 
	var container = document.body,
		dialog = st.utils.getEl('dialog-event'),
		self = this,
		isOver = false,
		id,
		dates,
		map = {};
		 
	function getDates() {
		var table = document.getElementsByTagName('table')[0],
			tds = table.getElementsByTagName('td'),
			len = tds.length,
			map = [];
		
		while (len--) {
			if (st.css.hasClass(tds[len], 'has-events')) {
				map.push(tds[len]);
			}
		}
		
		return map;
	}
	
	function clearTimers() {
		dates.forEach(function(item, index, array){
 			window.clearInterval(map['item' + index]);
 		});
	}
	
	function setupTimers() {
		// Loops through each <td class="has-events"> once
	 	dates.forEach(function(item, index, array){
	 		// For each tag we set-up an interval to check if it is hovered over
	 		map['item' + index] = window.setInterval(function(){
	 			// Check if we're over a <td class="has-events">
	 			if (imo.check(item)) {
	 				// Keep track of whether we're over a <td class="has-events">
	 				isOver = true;
	 				
	 				// Show the dialog
	 				showDialog(item);
	 				
	 				// We need to clear the interval before setting it again (otherwise the same interval will be set multiple times as we're executing this code within its own interval!)
	 				window.clearInterval(app.eventsCalendar.timer);
	 				
	 				// Set-up new interval to check if we're over the dialog
	 				app.eventsCalendar.timer = window.setInterval(function(){
	 					isOver = imo.check(dialog);
	 					if (!isOver) {
	 						// If we're not over the dialog then hide it
	 						st.css.addClass(dialog, 'hide');
	 					}
	 				}, 300);
	 			} 
	 			// Otherwise hide the dialog (this will likely be executed multiple times as we're executing this code within its own interval!)
	 			else if (!isOver) {
	 				st.css.addClass(dialog, 'hide');
	 			}
	 		}, 100);
	 	});
	}
	
	function showDialog(context) {
		var x, y;
		
		// Get the X and Y co-ordinates
		x = st.utils.getOffset(context).left + 12;
		y = st.utils.getOffset(context).top + 100; // height of 'day' <td> which triggers the event
				
		self.styleElement(dialog, {
			'left': x + 'px',
			'top': y + 'px'
		});
		
		// Show the dialog after it has been positioned
		st.css.removeClass(dialog, 'hide');
	}
 
 	dates = getDates();
 		
 	/*
 	 * Standard mouseover/out event listeners on the <td> didn't work
 	 * The browser would fail to trigger the event if the user moved their mouse too quickly between <td>'s
 	 * So we've had to use a higher-level abstraction to get this to work.
 	 *
 	 * This means having a mouseover event on the document.documentElement 
 	 * which checks the given element to see if the mouse cursor is within the range of the elements x/y co-ordinates
 	 * See: isMouseOver.js
 	 */
 	setupTimers();
	
};

app.eventsCalendar();