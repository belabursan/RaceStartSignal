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
    
    if(element.src.search("expand") > -1) {
        one.classList.remove('subrow');
        one.classList.add('subrow-visible');
        four.classList.remove('subrow');
        four.classList.add('subrow-visible');
        five.classList.remove('subrow');
        five.classList.add('subrow-visible');
        element.src = "src/images/shrink.png";
    } else {
        one.classList.remove('subrow-visible');
        one.classList.add('subrow');
        four.classList.remove('subrow-visible');
        four.classList.add('subrow');
        five.classList.remove('subrow-visible');
        five.classList.add('subrow');
        element.src = "src/images/expand.png";
        
    }
}

function hoverIn(element){
    element.style.backgroundColor = "#e0e0e0";
}

function hoverOut(element){
    element.style.backgroundColor = "white";
}
