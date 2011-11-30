var imo = (function() {
	
	var container = document.documentElement,
		_x = 0,
		_y = 0,
		target;
		
	st.events.add(container, 'mousemove', logmousemove);
	
	function __check(element) {
		var offset = st.utils.getOffset(element),
			position = {
				top: offset.top + element.clientHeight,
				left: offset.left + element.clientWidth
			};
		
		return (_y >= offset.top && _y <= position.top &&_x >= offset.left && _x <=position.left);
	}
	
	function logmousemove(e) {
		_x = e.pageX;
		_y = e.pageY;
	}

	return {
		check: __check
	}
	
}());