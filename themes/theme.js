// Picks the site theme chosen in Pages CMS "Site Theme" (content/site.yml).
// It remembers the last theme in this browser so pages don't flash on later visits.
(function(){
  var root=document.documentElement,key='cc-theme',known=null,fontsAdded=false;
  function addFonts(){
    // Cyber Aero fonts, loaded only when that theme is on.
    if(fontsAdded)return;fontsAdded=true;
    var link=document.createElement('link');link.rel='stylesheet';
    link.href='https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600&family=Inter:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
  }
  function use(theme){
    if(theme==='steel')theme='cyber'; // Steel Aero was replaced by Cyber Aero
    if(theme==='cyber'){root.setAttribute('data-theme','cyber');addFonts();}
    else root.removeAttribute('data-theme');
  }
  try{known=localStorage.getItem(key);}catch(e){}
  if(known)use(known);
  else{root.style.visibility='hidden';setTimeout(function(){root.style.visibility='';},800);} // first visit: wait a moment for the theme
  fetch('/content/site.yml',{cache:'no-cache'}).then(function(r){return r.ok?r.text():'';}).then(function(text){
    var m=text.match(/^theme:[ \t]*["']?([A-Za-z-]+)/m),theme=m?m[1].toLowerCase():'dark';
    use(theme);try{localStorage.setItem(key,theme);}catch(e){}
  }).catch(function(){}).then(function(){root.style.visibility='';});
})();
