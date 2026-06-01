document.addEventListener('click',function(e){
const btn=e.target.closest('button,a');
if(!btn)return;
const t=(btn.textContent||'').toLowerCase();
if(t.includes('buy now')||t.includes('checkout')){
e.preventDefault();
window.location.href='checkout.html';
}
});