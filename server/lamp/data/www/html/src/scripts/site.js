function fadeOut(id) {
    try {
        var fadeTarget = document.getElementById(id);
        if (fadeTarget != null) {
            var fadeEffect = setInterval(function () {
                if (!fadeTarget.style.opacity) {
                    fadeTarget.style.opacity = 1;
                }
                if (fadeTarget.style.opacity > 0) {
                    fadeTarget.style.opacity -= 0.01;
                } else {
                    clearInterval(fadeEffect);
                    fadeTarget.remove();
                }
              }, 45);
        }
    } catch(err) {
      //alert("Error in fade out! err: " + err);
    }
}

function toggle(element){
    var i = element.id;
    var one = document.getElementById("subrow_"+i+"-1");
    var four = document.getElementById("subrow_"+i+"-4");
    var five = document.getElementById("subrow_"+i+"-5");
    var yellow = document.getElementById("subrow_"+i+"-15");
    
    if(element.src.search("expand") > -1) {
        one.classList.remove('subrow');
        one.classList.add('subrow-visible');
        four.classList.remove('subrow');
        four.classList.add('subrow-visible');
        five.classList.remove('subrow');
        five.classList.add('subrow-visible');
        if(yellow) {
            yellow.classList.remove('subrow');
            yellow.classList.add('subrow-visible');
        }
        element.src = "src/images/shrink.png";
    } else {
        one.classList.remove('subrow-visible');
        one.classList.add('subrow');
        four.classList.remove('subrow-visible');
        four.classList.add('subrow');
        five.classList.remove('subrow-visible');
        five.classList.add('subrow');
        if(yellow) {
            yellow.classList.remove('subrow-visible');
            yellow.classList.add('subrow'); 
        }
        element.src = "src/images/expand.png";
        
    }
}

function uncheckYellow(element) {
    if(element) {
        var yellow = document.getElementById("yellowflag");
        if(yellow) {
            yellow.disabled = true;
            if(element.checked) {
                yellow.checked = false;
                disabled = true;
            } else {
                yellow.disabled = false;
            }
        }
    }
}

function hoverIn(element){
    element.style.backgroundColor = "#e0e0e0";
}

function hoverOut(element){
    element.style.backgroundColor = "white";
}
