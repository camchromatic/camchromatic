// Picks the site theme chosen in Pages CMS "Site Theme" (content/site.yml).
// It remembers the last theme in this browser so pages don't flash on later visits.
(function(){
  var root=document.documentElement,key='cc-theme',known=null;
  function use(theme){if(theme==='steel')root.setAttribute('data-theme','steel');else root.removeAttribute('data-theme');}
  try{known=localStorage.getItem(key);}catch(e){}
  if(known)use(known);
  else{root.style.visibility='hidden';setTimeout(function(){root.style.visibility='';},800);} // first visit: wait a moment for the theme
  fetch('/content/site.yml',{cache:'no-cache'}).then(function(r){return r.ok?r.text():'';}).then(function(text){
    var m=text.match(/^theme:[ \t]*["']?([A-Za-z-]+)/m),theme=m?m[1].toLowerCase():'dark';
    use(theme);try{localStorage.setItem(key,theme);}catch(e){}
  }).catch(function(){}).then(function(){root.style.visibility='';});
})();
