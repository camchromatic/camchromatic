// Makes saving the artwork a little harder: no right-click menu (except in
// text boxes, so pasting still works), no long-press menu on phone images,
// and no dragging images out of the page.
(function(){
  var style=document.createElement('style');
  style.textContent='img{-webkit-touch-callout:none;-webkit-user-drag:none;user-select:none}';
  document.head.appendChild(style);
  document.addEventListener('contextmenu',function(event){
    if(!event.target.closest('input,textarea,[contenteditable]'))event.preventDefault();
  });
  document.addEventListener('dragstart',function(event){
    if(event.target.closest('img'))event.preventDefault();
  });
})();
