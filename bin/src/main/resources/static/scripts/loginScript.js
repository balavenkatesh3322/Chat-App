	function toggleProfileDropdown() {
		var profileOpen = document.getElementsByClassName("profile-open");
		var profileClose = document.getElementsByClassName("profile-close");
		var profileElement = document.getElementsByClassName("profile-dropdown")[0];
		
		
		if(profileOpen.length > 0) {
			profileElement.classList.remove("profile-open");
			profileElement.classList.add("profile-close");
		} else {
			profileElement.classList.remove("profile-close");
			profileElement.classList.add("profile-open");
		}
	}
	
	  // Function to check whether the element is not dropdown or its children
	  function checkIsDropDownElem(target)  {
	    let dropdownElem = document.getElementsByClassName('profile-dropdown')[0];
	    if (dropdownElem != undefined) {
	      if (dropdownElem.contains(target)) {
	        return true;
	      }
	    }
	    return false;
	  }
	  
	  
	  // Function to check whether the element is not dropdown or its children
	  function checkIsProfielImage(target)  {
	    let profileElem = document.getElementsByClassName('main-profile-image')[0];
	    if (profileElem != undefined) {
	      if (profileElem.contains(target)) {
	        return true;
	      }
	    }
	    return false;
	  }
	  
	  // Function to check whether the element is not dropdown or its children
	  function checkIsCaretDown(target)  {
	    let caretDownElem = document.getElementsByClassName('open-profile-dropdown')[0];
	    if (caretDownElem != undefined) {
	      if (caretDownElem.contains(target)) {
	        return true;
	      }
	    }
	    return false;
	  }

	document.getElementById("container").addEventListener("click", function(event) {
		var profileElement = document.getElementsByClassName("profile-dropdown")[0];
		var profileOpen = document.getElementsByClassName("profile-open");
	    if (checkIsDropDownElem(event.target) === false &&
	    	checkIsProfielImage(event.target) === false &&
	    	checkIsCaretDown(event.target) === false) {
			
			if(profileOpen.length > 0) {
				profileElement.classList.remove("profile-open");
				profileElement.classList.add("profile-close");
			}
	   }		
	}, false);
