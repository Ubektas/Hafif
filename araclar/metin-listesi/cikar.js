const fs=require('fs');const acorn=require('/opt/node-tools/node_modules/acorn');const walk=require('/opt/node-tools/node_modules/acorn-walk');
const html=fs.readFileSync('/home/user/Hafif/www/index.html','utf8');const lines=html.split('\n');
const sStart=html.indexOf('<script>')+8,sEnd=html.indexOf('</script>',sStart);
const src=html.slice(sStart,sEnd);const lineOff=html.slice(0,sStart).split('\n').length-1;
const ast=acorn.parse(src,{ecmaVersion:'latest',locations:true});
const out=[];
const TR=/[çğıöşüÇĞİÖŞÜ]/;
function natural(t){t=t.trim();if(!t)return false;if(!/[A-Za-zçğıöşüÇĞİÖŞÜ]{2}/.test(t))return false;
 if(/^[#.]?[a-z0-9_-]+$/i.test(t)&&!TR.test(t)&&!/^[A-ZÇĞİÖŞÜ][a-zçğıöşü]+$/.test(t))return false; // identifiers
 if(/^(https?:|data:|M[\d.-]|[\d.\s,-]+$)/.test(t))return false;
 if(/[{};]\s*$/.test(t)&&/:/.test(t)&&!TR.test(t))return false;
 if(/^[a-z-]+:[^ ]/.test(t)&&!TR.test(t))return false;
 if(/^(var\(|rgba?\(|#[0-9a-f]{3,8}|translate|scale|rotate|cubic|linear-gradient|radial)/i.test(t))return false;
 if(/^[a-z]+(\s[a-z-]+)*$/.test(t)&&!TR.test(t)&&t.split(' ').length<4&&!/\b(ve|bir|ile|için|gün|kg|bu)\b/.test(t))return false; // class lists
 if(/=>|\(\)|\$\(|document\.|\.getItem|function/.test(t))return false;
 return true}
// text segments from a string that may contain HTML
function segs(s){const res=[];const attrs=[];
 s.replace(/\b(placeholder|title|aria-label|alt)="([^"]*)"/g,(m,a,v)=>{attrs.push([a,v])});
 if(/<[a-z\/!]/i.test(s)){
  const noTags=s.replace(/<style[\s\S]*?<\/style>/g,'').replace(/<svg[\s\S]*?<\/svg>/g,' ');
  const toks=noTags.split(/(<[^>]*>)/);let tag='';
  for(const p of toks){if(p.startsWith('<')){const m=p.match(/^<\/?\s*([a-z0-9]+)/i);if(m&&!p.startsWith('</'))tag=m[1].toLowerCase();else if(m)tag='';continue}
   const t=p.replace(/\s+/g,' ').trim();if(natural(t))res.push([tag||'metin',t])}
 } else if(natural(s)) res.push(['metin',s.replace(/\s+/g,' ').trim()]);
 for(const [a,v] of attrs)if(natural(v))res.push([a,v]);
 return res}
function tplText(n){let s='';n.quasis.forEach((q,i)=>{s+=q.value.cooked??q.value.raw;if(i<n.expressions.length){const e=n.expressions[i];const code=src.slice(e.start,e.end);s+=(e.type==='TemplateLiteral'||/`/.test(code))?'\u0002':'«'+label(code)+'»'}});return s}
function label(code){code=code.replace(/\s+/g,' ');return code.length>28?code.slice(0,26)+'…':code}
// enclosing function names
const funcs=[];
walk.fullAncestor(ast,(node,anc)=>{
 if(node.type==='Literal'&&typeof node.value==='string'||node.type==='TemplateLiteral'){
  const p=anc[anc.length-2];
  if(p&&p.type==='MemberExpression'&&p.property===node&&p.computed)return;
  if(p&&p.type==='CallExpression'&&p.callee.type==='MemberExpression'&&['getItem','setItem','removeItem','querySelector','querySelectorAll','getElementById','addEventListener','closest','matches','toLocaleDateString','toLocaleTimeString','toLocaleString','add','remove','toggle','contains','setAttribute','getAttribute','removeAttribute','setProperty','startsWith','endsWith','includes','split','join','replace','padStart','indexOf','createElement','insertAdjacentHTML','dispatchEvent','postMessage','toString','fill','getPropertyValue'].includes(p.callee.property.name)&&p.arguments[0]===node)return;
  if(p&&p.type==='CallExpression'&&p.callee.type==='Identifier'&&['$','$$'].includes(p.callee.name))return;
  if(p&&p.type==='Property'&&p.key===node)return;
  if(p&&p.type==='BinaryExpression'&&/[=!]==?/.test(p.operator))return;
  if(p&&p.type==='SwitchCase')return;
  let ctx='';for(let i=anc.length-2;i>=0;i--){const a=anc[i];if(a.type==='CallExpression'&&a.callee.type==='Identifier'){const n=a.callee.name;if(n==='toast'){ctx='toast';break}if(n==='confirm'||n==='alert'){ctx='onay';break}}if(a.type==='CallExpression'&&a.callee.type==='MemberExpression'&&/schedule|notify/i.test(a.callee.property.name||'')){ctx='bildirim';break}}
  let text=node.type==='Literal'?node.value:tplText(node);
  let fn='(genel)';for(let i=anc.length-1;i>=0;i--){const a=anc[i];
   if(a.type==='FunctionDeclaration'&&a.id){fn=a.id.name;break}
   if((a.type==='ArrowFunctionExpression'||a.type==='FunctionExpression')){const q=anc[i-1];if(q&&q.type==='VariableDeclarator'&&q.id.name){fn=q.id.name;break}if(q&&q.type==='Property'&&q.key){fn=(q.key.name||q.key.value);/* keep looking for outer named */ const outer=anc.slice(0,i-1).reverse().find(b=>b.type==='FunctionDeclaration'||b.type==='VariableDeclarator');if(outer){fn=(outer.id&&outer.id.name||'?')+'.'+fn}break}}
   if(a.type==='VariableDeclarator'&&a.id&&a.id.name&&i<anc.length-1){fn=a.id.name;break}}
  for(const t of text.split('\u0002'))for(const [k,v] of segs(t))out.push({line:node.loc.start.line+lineOff,fn,kind:k,text:v,ctx});
 }});
// static HTML (outside script)
const before=html.slice(0,sStart);
before.split('\n').forEach((l,i)=>{if(i<lineOff-1&&/<(style|meta|link)/.test(l))return;});
const body=before.slice(before.indexOf('<body'));const bLine=before.slice(0,before.indexOf('<body')).split('\n').length;
const bodyNoStyle=body.replace(/<style[\s\S]*?<\/style>/g,m=>m.replace(/[^\n]/g,' '));
bodyNoStyle.split('\n').forEach((l,i)=>{for(const [k,v] of segs(l))out.push({line:bLine+i,fn:'(sayfa iskeleti)',kind:k,text:v})});
fs.writeFileSync('ham.json',JSON.stringify(out,null,0));
console.log(out.length);
const byFn={};for(const o of out)byFn[o.fn]=(byFn[o.fn]||0)+1;console.log(Object.entries(byFn).sort((a,b)=>b[1]-a[1]).map(x=>x.join(':')).join(' '));
