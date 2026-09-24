const btn=document.querySelector('.menu-toggle');
const nav=document.querySelector('.main-nav');
if(btn&&nav){
  btn.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');
    btn.setAttribute('aria-expanded',String(open));
  });
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    nav.classList.remove('open');
    btn.setAttribute('aria-expanded','false');
  }));
}
document.querySelectorAll('[data-copy]').forEach(button=>{
  button.addEventListener('click',async()=>{
    const value=button.getAttribute('data-copy');
    try{
      await navigator.clipboard.writeText(value);
      const original=button.textContent;
      button.textContent='Copiado';
      setTimeout(()=>button.textContent=original,1800);
    }catch(e){}
  });
});

document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&nav&&btn){
    nav.classList.remove('open');
    btn.setAttribute('aria-expanded','false');
    btn.focus();
  }
});
