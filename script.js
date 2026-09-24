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

const emailForm=document.querySelector('#email-form');
const emailModal=document.querySelector('#email-confirmation-modal');
const emailConfirm=document.querySelector('[data-email-confirm]');
const emailCancel=document.querySelector('[data-email-cancel]');
let pendingMailto='';

if(emailForm&&emailModal){
  emailForm.addEventListener('submit',event=>{
    event.preventDefault();

    const nome=(document.querySelector('#nome')?.value||'').trim();
    const telefone=(document.querySelector('#telefone')?.value||'').trim();
    const email=(document.querySelector('#email')?.value||'').trim();
    const tipoAssunto=(document.querySelector('#tipo-assunto')?.value||'').trim();
    const mensagem=(document.querySelector('#mensagem')?.value||'').trim();

    if(!tipoAssunto){
      document.querySelector('#tipo-assunto')?.focus();
      return;
    }

    const subject='CONTATO SITE - '+tipoAssunto+' - MOSTEIRO DA SANTA FACE';
    const lines=[
      'Contato pelo site do Mosteiro da Santa Face',
      '',
      'Assunto: '+tipoAssunto,
      '',
      nome ? 'Nome: '+nome : '',
      telefone ? 'Telefone: '+telefone : '',
      email ? 'E-mail: '+email : '',
      '',
      mensagem ? 'Mensagem:' : '',
      mensagem
    ].filter(Boolean);

    pendingMailto='mailto:mosteirodasantaface@gmail.com?subject='+
      encodeURIComponent(subject)+'&body='+encodeURIComponent(lines.join('\n'));

    if(typeof emailModal.showModal==='function'){
      emailModal.showModal();
    }else{
      const proceed=window.confirm(
        'A mensagem será preparada e aberta no seu aplicativo de e-mail. Nada será enviado automaticamente. Deseja prosseguir?'
      );
      if(proceed) window.location.href=pendingMailto;
    }
  });
}
if(emailConfirm){
  emailConfirm.addEventListener('click',()=>{
    if(emailModal?.open) emailModal.close();
    if(pendingMailto) window.location.href=pendingMailto;
  });
}
if(emailCancel){
  emailCancel.addEventListener('click',()=>{
    if(emailModal?.open) emailModal.close();
    pendingMailto='';
  });
}
if(emailModal){
  emailModal.addEventListener('cancel',()=>{
    pendingMailto='';
  });
}

const galleryDialog=document.querySelector('#gallery-dialog');
const galleryDialogImage=galleryDialog?.querySelector('img');
const galleryClose=galleryDialog?.querySelector('.gallery-close');

document.querySelectorAll('[data-gallery-src]').forEach(item=>{
  item.addEventListener('click',()=>{
    if(!galleryDialog||!galleryDialogImage) return;
    galleryDialogImage.src=item.getAttribute('data-gallery-src')||'';
    galleryDialogImage.alt=item.getAttribute('data-gallery-alt')||'Fotografia ampliada do Mosteiro da Santa Face';
    if(typeof galleryDialog.showModal==='function') galleryDialog.showModal();
  });
});
if(galleryClose){
  galleryClose.addEventListener('click',()=>galleryDialog?.close());
}
if(galleryDialog){
  galleryDialog.addEventListener('click',event=>{
    if(event.target===galleryDialog) galleryDialog.close();
  });
  galleryDialog.addEventListener('close',()=>{
    if(galleryDialogImage){
      galleryDialogImage.src='';
      galleryDialogImage.alt='';
    }
  });
}


/* Acessibilidade em Libras — VLibras Widget oficial */
(function loadVLibras(){
  if(document.getElementById('vlibras-widget-script')) return;
  const vlibras=document.createElement('script');
  vlibras.id='vlibras-widget-script';
  vlibras.src='https://vlibras.gov.br/app/vlibras-plugin.js';
  vlibras.async=true;
  document.body.appendChild(vlibras);
})();
