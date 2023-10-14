(function($) {
  $(function() {
    $('#nav-toggle').click(function() {
      $('nav ul').slideToggle();
      $('#nav-toggle').toggleClass('active');
      $('.nav-mobile').toggleClass('active');
      $('.slide-container').toggleClass('active'); 
    });
  });
})(jQuery);
