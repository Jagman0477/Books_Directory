$(document).ready(function () {

    $(".full-hamburger").click(function () {
        $(".full-hamburger").toggleClass("change");
        if ($('.side-nav').hasClass("side-nav-slidein")) {
            $('.side-nav').addClass("side-nav-slideout");
            $('.side-nav').removeClass("side-nav-slidein");
            $('.side-nav').removeClass("side-nav-slideout");
        }
        else { $('.side-nav').addClass("side-nav-slidein"); }
    });

    $('.catalogitem').mouseenter(function(){
            $(".short-des", this).css('opacity', '1');
        });

       $('.catalogitem').mouseleave(function(){
        $(".short-des", this).css('opacity', '0');;})
});