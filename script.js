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


/* MODO DE REVISAO - MOSTEIRO DA SANTA FACE */
(function initReviewMode(){
  const WHATSAPP='551121105473';
  const REVIEW_PARAM='reviewTarget';
  const REVIEW_REF_PARAM='reviewRef';

  function esc(value){
    if(window.CSS&&typeof window.CSS.escape==='function') return window.CSS.escape(value);
    return String(value).replace(/([^a-zA-Z0-9_-])/g,'\\$1');
  }

  function elementSelector(el){
    if(!(el instanceof Element)) return '';
    if(el.id) return '#'+esc(el.id);
    const parts=[];
    let node=el;
    while(node&&node.nodeType===1&&node!==document.body){
      let part=node.tagName.toLowerCase();
      const parent=node.parentElement;
      if(!parent) break;
      const same=[...parent.children].filter(child=>child.tagName===node.tagName);
      if(same.length>1) part+=':nth-of-type('+(same.indexOf(node)+1)+')';
      parts.unshift(part);
      if(parent.id){
        parts.unshift('#'+esc(parent.id));
        break;
      }
      node=parent;
    }
    return parts.join(' > ');
  }

  function describeElement(el){
    if(!el) return 'Elemento selecionado';
    const img=el.matches('img')?el:el.querySelector?.('img');
    if(img?.alt) return 'Imagem: '+img.alt.trim().slice(0,140);
    const aria=el.getAttribute?.('aria-label');
    if(aria) return aria.trim().slice(0,140);
    const text=(el.innerText||el.textContent||'').replace(/\s+/g,' ').trim();
    if(text) return text.slice(0,160)+(text.length>160?'…':'');
    return '<'+el.tagName.toLowerCase()+'>';
  }

  function pageName(){
    const h1=document.querySelector('h1');
    return (h1?.innerText||document.title||location.pathname).replace(/\s+/g,' ').trim();
  }

  function reviewRef(){
    const d=new Date();
    const p=n=>String(n).padStart(2,'0');
    return 'REV-'+d.getFullYear()+p(d.getMonth()+1)+p(d.getDate())+'-'+p(d.getHours())+p(d.getMinutes())+p(d.getSeconds());
  }

  const toolbar=document.createElement('div');
  toolbar.className='review-toolbar';
  toolbar.setAttribute('data-review-ui','');
  toolbar.innerHTML=
    '<div class="review-toolbar-copy"><strong>Site em validação</strong><span>Clique em “Adicionar observação” e depois no item que deseja comentar.</span></div>'+
    '<button type="button" class="review-start">Adicionar observação</button>';
  document.body.appendChild(toolbar);

  const dialog=document.createElement('dialog');
  dialog.className='review-dialog';
  dialog.setAttribute('data-review-ui','');
  dialog.innerHTML=
    '<form method="dialog" class="review-dialog-inner">'+
      '<div class="review-dialog-head"><span>Revisão do site</span><button type="button" class="review-close" aria-label="Fechar">×</button></div>'+
      '<p class="review-selected"></p>'+
      '<label class="review-label">Seu nome<input class="review-author" type="text" autocomplete="name" placeholder="Nome de quem está revisando"></label>'+
      '<label class="review-label">Observação<textarea class="review-note" rows="5" placeholder="Descreva o que precisa ser alterado, corrigido ou verificado."></textarea></label>'+
      '<div class="review-actions"><button type="button" class="review-cancel">Cancelar</button><button type="button" class="review-send">Enviar pelo WhatsApp</button></div>'+
    '</form>';
  document.body.appendChild(dialog);

  const start=toolbar.querySelector('.review-start');
  const close=dialog.querySelector('.review-close');
  const cancel=dialog.querySelector('.review-cancel');
  const send=dialog.querySelector('.review-send');
  const author=dialog.querySelector('.review-author');
  const note=dialog.querySelector('.review-note');
  const selectedText=dialog.querySelector('.review-selected');
  let picking=false;
  let hovered=null;
  let selected=null;

  try{author.value=localStorage.getItem('mosteiroReviewAuthor')||'';}catch(e){}

  function setPicking(on){
    picking=on;
    document.body.classList.toggle('review-picking',on);
    start.textContent=on?'Cancelar seleção':'Adicionar observação';
    if(!on&&hovered){hovered.classList.remove('review-hover');hovered=null;}
  }

  function isReviewUI(el){
    return !!el.closest('[data-review-ui]');
  }

  function validTarget(el){
    if(!el||isReviewUI(el)) return null;
    if(el.closest('script,style,noscript')) return null;
    return el.closest('a,button,img,h1,h2,h3,p,blockquote,li,address,section,article,div,form,label,input,textarea,select')||el;
  }

  start.addEventListener('click',()=>setPicking(!picking));
  close.addEventListener('click',()=>dialog.close());
  cancel.addEventListener('click',()=>dialog.close());

  document.addEventListener('mousemove',event=>{
    if(!picking) return;
    const target=validTarget(event.target);
    if(target===hovered) return;
    if(hovered) hovered.classList.remove('review-hover');
    hovered=target;
    if(hovered) hovered.classList.add('review-hover');
  },true);

  document.addEventListener('click',event=>{
    if(!picking) return;
    const target=validTarget(event.target);
    if(!target) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    selected=target;
    selected.classList.remove('review-hover');
    selected.classList.add('review-selected-target');
    setPicking(false);
    selectedText.textContent='Item selecionado: '+describeElement(selected);
    note.value='';
    if(typeof dialog.showModal==='function') dialog.showModal();
    else dialog.setAttribute('open','');
    setTimeout(()=>note.focus(),50);
  },true);

  dialog.addEventListener('close',()=>{
    if(selected){selected.classList.remove('review-selected-target');selected=null;}
  });

  send.addEventListener('click',()=>{
    const observation=note.value.trim();
    if(!selected||!observation){
      note.focus();
      return;
    }
    const reviewer=author.value.trim()||'Não informado';
    try{if(author.value.trim()) localStorage.setItem('mosteiroReviewAuthor',author.value.trim());}catch(e){}
    const selector=elementSelector(selected);
    const ref=reviewRef();
    const direct=new URL(location.href);
    direct.searchParams.set(REVIEW_PARAM,selector);
    direct.searchParams.set(REVIEW_REF_PARAM,ref);
    direct.hash='';

    const message=[
      '*REVISÃO — SITE MOSTEIRO DA SANTA FACE*',
      '',
      '*Código:* '+ref,
      '*Revisor(a):* '+reviewer,
      '*Página:* '+pageName(),
      '*Item:* '+describeElement(selected),
      '',
      '*Observação:*',
      observation,
      '',
      '*Abrir diretamente no item:*',
      direct.toString()
    ].join('\n');

    const whatsapp='https://wa.me/'+WHATSAPP+'?text='+encodeURIComponent(message);
    window.open(whatsapp,'_blank','noopener');
  });

  const incoming=new URLSearchParams(location.search);
  const incomingSelector=incoming.get(REVIEW_PARAM);
  if(incomingSelector){
    setTimeout(()=>{
      let target=null;
      try{target=document.querySelector(incomingSelector);}catch(e){}
      if(!target) return;
      target.classList.add('review-deep-link-target');
      target.scrollIntoView({behavior:'smooth',block:'center'});
      const ref=incoming.get(REVIEW_REF_PARAM);
      const badge=document.createElement('div');
      badge.className='review-location-badge';
      badge.setAttribute('data-review-ui','');
      badge.textContent=ref?'Item da revisão '+ref:'Item indicado na revisão';
      document.body.appendChild(badge);
      setTimeout(()=>badge.classList.add('show'),100);
    },450);
  }
})();
