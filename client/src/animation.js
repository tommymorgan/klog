setTimeout(function() {
    $('.pour') 
        .delay(2000)
        .animate({
            height: '340px'
        }, 1500)
        .delay(1600)
        .slideUp(500);

    $('.liquid') 
        .delay(3400)
        .animate({
            height: '80%'
        }, 2500);

    $('.beer-foam')
        .delay(3400)
        .animate({
            height: '100%',
        }, 2500);
  
  $('.beer-volume').delay(3500).show()
}, 1000);
