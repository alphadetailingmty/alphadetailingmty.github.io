const { useState, useEffect, useCallback, useRef } = React;
const MONTHS       = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const MONTHS_SHORT = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const DAY_NAMES    = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
const DAY_SHORT    = ["DOM","LUN","MAR","MIÉ","JUE","VIE","SÁB"];
const SERVICE_STATUSES = [
  { id:"confirmed",  label:"Confirmado",  color:"#3b82f6", emoji:"✓" },
  { id:"inprogress", label:"En proceso",  color:"#f59e0b", emoji:"⚙" },
  { id:"delivered",  label:"Entregado",   color:"#8b5cf6", emoji:"✅" },
  { id:"paid",       label:"Cobrado",     color:"#22c55e", emoji:"💰" },
];
const ORIGINS = [
  { id:"recomendacion", label:"Recomendación",  emoji:"🤝", color:"#22c55e" },
  { id:"antiguo",       label:"Cliente antiguo", emoji:"⭐", color:"#c9a84c" },
  { id:"redes",         label:"Redes sociales",  emoji:"📱", color:"#3b82f6" },
  { id:"marketing",     label:"Marketing",       emoji:"📣", color:"#8b5cf6" },
  { id:"otro",          label:"Otro",            emoji:"❓", color:"#606060" },
];

// ── DEFAULT SERVICES CATALOG ──
const DEFAULT_CATALOG = [
  { id:"pulido-1p",    name:"Pulido — 1 Paso",             group:"Pulidos",    sizes:[{label:"Chico",price:3000},{label:"Mediano",price:3500},{label:"Grande",price:4000}], includes:["Lavado a detalle","Descontaminación profesional","Pulido 1 paso","Sellador de pintura"] },
  { id:"pulido-2p",    name:"Pulido — 2 Pasos",            group:"Pulidos",    sizes:[{label:"Chico",price:4500},{label:"Mediano",price:5500},{label:"Grande",price:6500}], includes:["Lavado a detalle","Descontaminación profesional","Corrección de pintura 2 pasos","Mayor brillo y claridad"] },
  { id:"linea-1",      name:"Línea Base — 1 Año",          group:"Línea Base", sizes:[{label:"Chico",price:5500},{label:"Mediano",price:6000},{label:"Grande",price:6999}], includes:["Lavado a detalle","Descontaminación profesional","Cerámico Artdeshine — 1 año","Hidrofobicidad básica"] },
  { id:"linea-2",      name:"Línea Base — 2 Años",         group:"Línea Base", sizes:[{label:"Chico",price:5999},{label:"Mediano",price:6999},{label:"Grande",price:7999}], includes:["Lavado a detalle","Descontaminación profesional","Cerámico Artdeshine — 2 años","Protección UV y química básica"] },
  { id:"ads-2",        name:"Artdeshine Premium — 2 Años", group:"Artdeshine", sizes:[{label:"Chico",price:8999},{label:"Mediano",price:9999},{label:"Grande",price:11499}], includes:["Lavado a detalle","Descontaminación profesional","Corrección de pintura 1 paso","Cerámico premium Artdeshine en pintura","Recubrimiento en cristales — 1 año (GRATIS)","Alto performance"] },
  { id:"ads-3",        name:"Artdeshine Premium — 3 Años", group:"Artdeshine", sizes:[{label:"Chico",price:11499},{label:"Mediano",price:12899},{label:"Grande",price:14499}], includes:["Lavado a detalle","Descontaminación profesional","Corrección de pintura 1 paso","Cerámico premium Artdeshine en pintura","Recubrimiento en cristales — 2 años (GRATIS)","Pulido de cristales"] },
  { id:"ads-5",        name:"Artdeshine Premium — 5 Años", group:"Artdeshine", sizes:[{label:"Chico",price:12999},{label:"Mediano",price:14499},{label:"Grande",price:16499}], includes:["Lavado a detalle","Descontaminación profesional","Corrección de pintura hasta 2 pasos","Cerámico premium Artdeshine en pintura","Recubrimiento en cristales — 2 años (GRATIS)","Pulido de cristales"] },
  { id:"ads-lifetime", name:"Artdeshine Lifetime",          group:"Artdeshine", sizes:[{label:"Chico",price:15999},{label:"Mediano",price:17499},{label:"Grande",price:19999}], includes:["Lavado a detalle","Descontaminación profesional","Corrección de pintura hasta 2 pasos","Cerámico premium Artdeshine lifetime","Recubrimiento en cristales — 5 años (GRATIS)","Garantía de por vida"] },
  { id:"ppf-interior", name:"PPF Interior",                group:"Extras",     sizes:[{label:"Estándar",price:3000}], includes:["Film en superficies interiores de alto contacto","Protección UV en tablero y plásticos"] },
  { id:"ppf-exterior", name:"PPF Exterior (parcial)",       group:"Extras",     sizes:[{label:"Estándar",price:5000}], includes:["Film protector en zonas de impacto","Resistencia a piedras y rayones"] },
  { id:"mantenimiento",name:"Mantenimiento Cerámico",       group:"Extras",     sizes:[{label:"Estándar",price:1500}], includes:["Lavado a detalle","Inspección del cerámico","Topcoat de mantenimiento Artdeshine","Brillo renovado"] },
  { id:"correccion",   name:"Corrección de Pintura",        group:"Extras",     sizes:[{label:"Chico",price:5500},{label:"Mediano",price:7000},{label:"Grande",price:9000}], includes:["Evaluación con medidor de pintura","Pulido de corrección profesional","Eliminación de rayones, oxidación y remolinos","Acabado espejo"] },
];

const CATALOG_KEY  = "alpha-catalog-v1";
const CAL_KEY      = "alpha-cal-v4";
const QUOTE_KEY    = "alpha-quotes-v2";
const QNUM_KEY     = "alpha-quote-num";
const CLIENTS_KEY  = "alpha-clients-v1";
const NOTIF_KEY    = "alpha-notif-v1";
const MAINT_KEY    = "alpha-maint-reminders";

// Bump cal key so seed reloads
try{if(localStorage.getItem("alpha-cal-v3")&&!localStorage.getItem("alpha-cal-v4"))localStorage.removeItem("alpha-cal-v3");}catch(e){}

const ULTRADETAILING_LINK = "https://bit.ly/ALPHADETAILINGUD";
const ALPHA_PHONE = "518134846656";
const ALPHA_CLABE = "058597000026158967";
const ALPHA_BANK  = "Banregio";
const ALPHA_OWNER = "Josué Vázquez";

const fmt    = n => "$" + Number(n).toLocaleString("es-MX",{minimumFractionDigits:0,maximumFractionDigits:0});
const padNum = n => String(n).padStart(4,"0");

// ── CATALOG HELPERS ──
function loadCatalog(){try{const r=localStorage.getItem(CATALOG_KEY);return r?JSON.parse(r):DEFAULT_CATALOG;}catch(e){return DEFAULT_CATALOG;}}
function saveCatalog(c){try{localStorage.setItem(CATALOG_KEY,JSON.stringify(c));}catch(e){}}

// ── SERVICE NAME NORMALIZER ──
// Maps free-text service names to catalog categories for display grouping in Ventas
const SERVICE_MAP = [
  { patterns:["ARTDESHINE LIFETIME","LIFETIME"],                          category:"Artdeshine Lifetime" },
  { patterns:["ARTDESHINE 7","7 AÑOS","7 YEAR"],                         category:"Artdeshine Premium — 7 Años" },
  { patterns:["ARTDESHINE 5","5 AÑOS","5 YEAR","ADS 5"],                 category:"Artdeshine Premium — 5 Años" },
  { patterns:["ARTDESHINE 3","3 AÑOS","3 YEAR","ADS 3"],                 category:"Artdeshine Premium — 3 Años" },
  { patterns:["ARTDESHINE 2","2 AÑOS","2 YEAR","ADS 2"],                 category:"Artdeshine Premium — 2 Años" },
  { patterns:["LÍNEA BASE 2","LINEA BASE 2","BASE 2"],                   category:"Línea Base — 2 Años" },
  { patterns:["LÍNEA BASE 1","LINEA BASE 1","BASE 1"],                   category:"Línea Base — 1 Año" },
  { patterns:["PULIDO 2","PULIDO DOS","2 PASOS"],                        category:"Pulido — 2 Pasos" },
  { patterns:["PULIDO 1","PULIDO UN","1 PASO","PULIDO"],                 category:"Pulido — 1 Paso" },
  { patterns:["CORRECCIÓN","CORRECCION","CORREC"],                       category:"Corrección de Pintura" },
  { patterns:["PPF INTERIOR","PPF INT"],                                 category:"PPF Interior" },
  { patterns:["PPF EXTERIOR","PPF EXT","PPF"],                           category:"PPF Exterior" },
  { patterns:["MANTENIMIENTO","MANTENIMIENTOS","MANT.","MANT "],         category:"Mantenimiento Cerámico" },
];

function normalizeServiceName(raw) {
  if (!raw) return raw;
  const up = raw.toUpperCase();
  for (const rule of SERVICE_MAP) {
    if (rule.patterns.some(p => up.includes(p))) return rule.category;
  }
  return raw; // return as-is if no match
}

// ── QUOTE NUMBER ──
function getNextQuoteNum(){try{const last=parseInt(localStorage.getItem(QNUM_KEY)||"100");const next=last+1;localStorage.setItem(QNUM_KEY,String(next));return padNum(next);}catch(e){return padNum(101);}}

// ── CLIENTS ──
function loadClients(){try{const r=localStorage.getItem(CLIENTS_KEY);return r?JSON.parse(r):[];}catch(e){return[];}}
function saveClient(d){try{const cl=loadClients();const idx=cl.findIndex(c=>c.nombre&&d.nombre&&c.nombre.toLowerCase()===d.nombre.toLowerCase());const e={nombre:d.nombre,tel:d.tel,dir:d.dir,modelo:d.modelo,color:d.color,updatedAt:Date.now()};if(idx>=0)cl[idx]={...cl[idx],...e};else cl.unshift(e);localStorage.setItem(CLIENTS_KEY,JSON.stringify(cl.slice(0,100)));}catch(e){}}

// ── CAL STORAGE ──
const SEED_CAL = {
  "2026-4-3":{"type":"worked","service":"MANTENIMIENTOS","vehicle":"Raptor Cheyenne","client":"JRP","notes":"Cliente Antiguo","price":"","status":"paid"},
  "2026-4-4":{"type":"worked","service":"LÍNEA BASE 2 AÑOS + MANTENIMIENTO","vehicle":"Equinox y Mercedes C200","client":"","notes":"Cliente Antiguo","price":"8499","status":"paid"},
  "2026-4-5":{"type":"worked","service":"ARTDESHINE 3 AÑOS","vehicle":"Mazda 3","client":"ADS","notes":"","price":"9999","status":"paid"},
  "2026-4-6":{"type":"worked","service":"ARTDESHINE 5 AÑOS + PPF INTERIOR","vehicle":"Sealion7 BYD","client":"ADS","notes":"","price":"17499","status":"paid"},
  "2026-4-7":{"type":"worked","service":"ARTDESHINE 3 AÑOS","vehicle":"GLC 53","client":"","notes":"Cliente Antiguo","price":"12899","status":"paid"},
  "2026-4-8":{"type":"worked","service":"ARTDESHINE 3 AÑOS","vehicle":"RAM 1500","client":"","notes":"","price":"13499","status":"paid"},
  "2026-4-9":{"type":"worked","service":"ARTDESHINE 5 AÑOS","vehicle":"Lexus NX350","client":"","notes":"Recomendación","price":"14499","status":"paid"},
  "2026-4-10":{"type":"worked","service":"ARTDESHINE 5 AÑOS","vehicle":"4Runner","client":"","notes":"Recomendación","price":"17499","status":"paid"},
  "2026-4-11":{"type":"worked","service":"MANTENIMIENTO","vehicle":"Mercedes GLC30","client":"","notes":"Recomendación","price":"11499","status":"paid"},
  "2026-4-12":{"type":"worked","service":"ARTDESHINE 2 AÑOS","vehicle":"Audi Q5","client":"OMAR","notes":"","price":"9999","status":"paid"},
  "2026-4-13":{"type":"worked","service":"LÍNEA BASE 1 AÑO","vehicle":"Pick Up","client":"JOAQUIRRIS","notes":"Cliente VIP","price":"6000","status":"paid"},
  "2026-4-14":{"type":"worked","service":"MANTENIMIENTOS","vehicle":"Raptor Cheyenne","client":"JRP","notes":"","price":"1500","status":"paid"},
  "2026-4-15":{"type":"worked","service":"LÍNEA BASE 2 AÑOS","vehicle":"Audi Q5","client":"GURMENSINDO","notes":"Cliente Antiguo","price":"6999","status":"paid"},
  "2026-4-16":{"type":"free","service":"","vehicle":"","client":"","notes":"","price":""},
  "2026-4-17":{"type":"worked","service":"CORRECCIÓN DE PINTURA","vehicle":"Audi Q5","client":"LA NUBE","notes":"","price":"7000","status":"paid"},
  "2026-4-18":{"type":"worked","service":"ARTDESHINE 5 AÑOS","vehicle":"CRV Hybrida","client":"","notes":"Cliente Antiguo","price":"14499","status":"paid"},
  "2026-4-19":{"type":"free","service":"","vehicle":"","client":"","notes":"","price":""},
  "2026-4-20":{"type":"worked","service":"ARTDESHINE 2 AÑOS","vehicle":"Angel Vazquez","client":"","notes":"","price":"9000","status":"paid"},
  "2026-4-21":{"type":"free","service":"","vehicle":"","client":"","notes":"","price":""},
  "2026-4-25":{"type":"worked","service":"ARTDESHINE 3 AÑOS","vehicle":"Tacoma TRD 2026","client":"","notes":"","price":"13499","status":"paid"},
};
function loadCalLocal(){try{const r=localStorage.getItem(CAL_KEY);if(r)return JSON.parse(r);}catch(e){}const s={...SEED_CAL};try{localStorage.setItem(CAL_KEY,JSON.stringify(s));}catch(e){}return s;}
function saveCalLocal(d){try{localStorage.setItem(CAL_KEY,JSON.stringify(d));}catch(e){}}
function loadQuotes(){try{const r=localStorage.getItem(QUOTE_KEY);return r?JSON.parse(r):[];}catch(e){return[];}}
function saveQuotes(d){try{localStorage.setItem(QUOTE_KEY,JSON.stringify(d));}catch(e){}}

// ── FIREBASE ──
function isFirebaseReady(){return!!(window.__firebase&&window.__firebase.saveCalendar);}
async function saveCalRemote(data){saveCalLocal(data);if(isFirebaseReady()){try{await window.__firebase.saveCalendar(data);}catch(e){}}}
async function loadCalRemote(){
  if(isFirebaseReady()){try{const r=await window.__firebase.getCalendar();if(r){const m={...r};Object.entries(SEED_CAL).forEach(([k,v])=>{if(m[k]){if(!m[k].price&&v.price)m[k]={...m[k],price:v.price,status:m[k].status||v.status};}else m[k]=v;});saveCalLocal(m);try{await window.__firebase.saveCalendar(m);}catch(e){}return m;}}catch(e){}}
  return loadCalLocal();
}
function subscribeCalRemote(cb){if(isFirebaseReady()){try{return window.__firebase.onCalendarChange(cb);}catch(e){}}return()=>{};}

// ── DATE HELPERS ──
function getFirstDayOffset(year,month){return new Date(year,month-1,1).getDay();}
function getDaysInMonth(year,month){return new Date(year,month,0).getDate();}
function todayISO(){const t=new Date();return`${t.getFullYear()}-${t.getMonth()+1}-${t.getDate()}`;}
function fmtDateNice(k){if(!k)return"";const[y,m,d]=k.split("-");return`${d} de ${MONTHS[parseInt(m)-1].toLowerCase()} de ${y}`;}

// ── NOTIFICATIONS ──
async function requestNotifPermission(){if(!("Notification"in window))return false;if(Notification.permission==="granted")return true;return(await Notification.requestPermission())==="granted";}
function scheduleNotificationsForCal(cal){try{const up=[];Object.entries(cal).forEach(([key,data])=>{if(data?.type!=="worked")return;const[y,m,d]=key.split("-").map(Number);const nd=new Date(y,m-1,d-1,12,0,0);if(nd>new Date())up.push({key,notifDate:nd.getTime(),service:data.service,vehicle:data.vehicle,client:data.client});});localStorage.setItem(NOTIF_KEY,JSON.stringify(up));}catch(e){}}
function checkPendingNotifications(){try{if(Notification.permission!=="granted")return;const p=JSON.parse(localStorage.getItem(NOTIF_KEY)||"[]");const now=Date.now();const s=[];p.forEach(n=>{if(n.notifDate<=now&&n.notifDate>now-86400000){new Notification("🚗 Alpha Detailing — Recordatorio",{body:`Mañana: ${n.service}${n.vehicle?" — "+n.vehicle:""}${n.client?" ("+n.client+")":""}`,icon:"/icon.png"});}else if(n.notifDate>now)s.push(n);});localStorage.setItem(NOTIF_KEY,JSON.stringify(s));}catch(e){}}

// ── 6-MONTH MAINTENANCE REMINDERS ──
function saveMaintReminder(clientName, clientTel, vehicle, serviceDate){
  try{
    const reminders=JSON.parse(localStorage.getItem(MAINT_KEY)||"[]");
    const sixMonths=new Date(serviceDate);sixMonths.setMonth(sixMonths.getMonth()+6);
    reminders.push({clientName,clientTel,vehicle,serviceDate,remindAt:sixMonths.toISOString(),sent:false});
    localStorage.setItem(MAINT_KEY,JSON.stringify(reminders));
  }catch(e){}
}
function loadMaintReminders(){try{return JSON.parse(localStorage.getItem(MAINT_KEY)||"[]");}catch(e){return[];}}
function checkMaintReminders(){
  try{
    const reminders=loadMaintReminders();
    const now=new Date();
    const due=reminders.filter(r=>!r.sent&&new Date(r.remindAt)<=now);
    return due;
  }catch(e){return[];}
}

function Toast({toast}){if(!toast)return null;return React.createElement("div",{className:"toast",style:{background:toast.color||"#22c55e"}},toast.msg);}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ══════════════════════════════════════════════════════════════════════════════
function App(){
  const[tab,setTab]=useState("calendar");
  const[toast,setToast]=useState(null);
  const[cal,setCal]=useState(()=>loadCalLocal());
  const[prefillDate,setPrefillDate]=useState(null);
  const[maintDue,setMaintDue]=useState([]);
  useEffect(()=>{
    checkPendingNotifications();
    setMaintDue(checkMaintReminders());
  },[]);
  const showToast=useCallback((msg,color="#22c55e")=>{setToast({msg,color});setTimeout(()=>setToast(null),2500);},[]);
  const goToQuoterWithDate=useCallback(dateKey=>{setPrefillDate(dateKey);setTab("quoter");},[]);

  // Today's summary data
  const today=new Date();
  const todayKey=`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
  const todayData=cal[todayKey];

  return React.createElement("div",null,
    React.createElement(Toast,{toast}),
    React.createElement("header",{className:"app-header"},
      React.createElement("div",{className:"brand-name"},"ALPHA"),
      React.createElement("div",{className:"brand-sub",style:{fontSize:"12px",letterSpacing:"6px",fontWeight:700}},"D E T A I L I N G"),

      // TODAY BANNER
      todayData?.type==="worked"&&React.createElement("div",{
        onClick:()=>setTab("calendar"),
        style:{margin:"10px auto 0",maxWidth:440,background:"linear-gradient(135deg,rgba(201,168,76,.15),rgba(201,168,76,.05))",border:"1px solid rgba(201,168,76,.3)",borderRadius:12,padding:"10px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12}
      },
        React.createElement("span",{style:{fontSize:22}},"🚗"),
        React.createElement("div",{style:{flex:1,textAlign:"left"}},
          React.createElement("div",{style:{fontSize:10,color:"#c9a84c",fontWeight:700,letterSpacing:2,textTransform:"uppercase"}},`Hoy · ${DAY_NAMES[today.getDay()]}`),
          React.createElement("div",{style:{fontSize:13,fontWeight:600,color:"#fff",marginTop:2}},todayData.service||"Servicio agendado"),
          todayData.vehicle&&React.createElement("div",{style:{fontSize:11,color:"#7dd3fc"}},todayData.vehicle)
        ),
        React.createElement("span",{style:{color:"#c9a84c",fontSize:18}},"›")
      ),

      // MAINTENANCE DUE BANNER
      maintDue.length>0&&React.createElement("div",{
        style:{margin:"8px auto 0",maxWidth:440,background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.3)",borderRadius:12,padding:"10px 16px",display:"flex",alignItems:"center",gap:12}
      },
        React.createElement("span",{style:{fontSize:20}},"🔔"),
        React.createElement("div",{style:{flex:1,textAlign:"left"}},
          React.createElement("div",{style:{fontSize:10,color:"#ef4444",fontWeight:700,letterSpacing:2,textTransform:"uppercase"}},"Recordatorio de mantenimiento"),
          React.createElement("div",{style:{fontSize:12,color:"#d0d0d0",marginTop:2}},`${maintDue[0].clientName} — ${maintDue[0].vehicle} · 6 meses`)
        )
      ),


    ),
    React.createElement("div",{className:"page",style:{paddingBottom:70}},
      tab==="calendar" ? React.createElement(CalendarModule,{showToast,cal,setCal,goToQuoterWithDate})
      :tab==="quoter"  ? React.createElement(QuoterModule,{showToast,cal,prefillDate,onPrefillUsed:()=>setPrefillDate(null)})
      :tab==="ventas"  ? React.createElement(VentasModule,{cal})
      :React.createElement(CatalogModule,{showToast})
    ),

    // ── BOTTOM NAV BAR (Facebook style) ──
    React.createElement("nav",{style:{
      position:"fixed",bottom:0,left:0,right:0,
      background:"#111",
      borderTop:"1px solid #222",
      display:"flex",alignItems:"center",justifyContent:"space-around",
      padding:`10px 8px calc(env(safe-area-inset-bottom,0px) + 10px)`,
      zIndex:200
    }},
      [
        {id:"calendar", icon:"📅", label:"Agenda"},
        {id:"quoter",   icon:"💰", label:"Cotizador"},
        {id:"ventas",   icon:"📊", label:"Ventas"},
      ].map(({id,icon,label})=>{
        const active=tab===id;
        return React.createElement("button",{
          key:id,
          onClick:()=>{setTab(id);if(id!=="quoter")setPrefillDate(null);},
          style:{
            flex:1,background:"none",border:"none",cursor:"pointer",
            display:"flex",flexDirection:"column",alignItems:"center",gap:3,
            padding:"4px 0",
            color:active?"#c9a84c":"#555",
            transition:"color .15s"
          }
        },
          React.createElement("span",{style:{fontSize:20,lineHeight:1}},icon),
          React.createElement("span",{style:{fontSize:9,fontWeight:active?700:500,letterSpacing:.3,fontFamily:"'Barlow',sans-serif",textTransform:"uppercase"}},label)
        );
      }),
      // Hamburger / settings
      React.createElement("button",{
        onClick:()=>setTab(tab==="catalog"?"calendar":"catalog"),
        style:{
          flex:1,background:"none",border:"none",cursor:"pointer",
          display:"flex",flexDirection:"column",alignItems:"center",gap:3,
          padding:"4px 0",
          color:tab==="catalog"?"#c9a84c":"#555",
          transition:"color .15s"
        }
      },
        React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:3.5,width:20,height:20,justifyContent:"center"}},
          React.createElement("div",{style:{height:2,background:tab==="catalog"?"#c9a84c":"#555",borderRadius:1,transition:"background .15s"}}),
          React.createElement("div",{style:{height:2,background:tab==="catalog"?"#c9a84c":"#555",borderRadius:1,transition:"background .15s"}}),
          React.createElement("div",{style:{height:2,background:tab==="catalog"?"#c9a84c":"#555",borderRadius:1,transition:"background .15s"}})
        ),
        React.createElement("span",{style:{fontSize:9,fontWeight:tab==="catalog"?700:500,letterSpacing:.3,fontFamily:"'Barlow',sans-serif",textTransform:"uppercase",color:tab==="catalog"?"#c9a84c":"#555"}},"Servicios")
      )
    )
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CATALOG MODULE — edit services, prices, sizes
// ══════════════════════════════════════════════════════════════════════════════
function CatalogModule({showToast}){
  const[catalog,setCatalog]=useState(()=>loadCatalog());
  const[editing,setEditing]=useState(null); // index
  const[form,setForm]=useState({});

  const startEdit=i=>{setEditing(i);setForm({...catalog[i],sizes:[...catalog[i].sizes.map(s=>({...s}))],includes:[...catalog[i].includes]});};
  const moveUp=i=>{if(i===0)return;const next=[...catalog];[next[i-1],next[i]]=[next[i],next[i-1]];setCatalog(next);saveCatalog(next);};
  const moveDown=i=>{if(i===catalog.length-1)return;const next=[...catalog];[next[i],next[i+1]]=[next[i+1],next[i]];setCatalog(next);saveCatalog(next);};
  const save=()=>{
    const next=[...catalog];
    next[editing]={...form};
    setCatalog(next);saveCatalog(next);setEditing(null);
    showToast("✓ Servicio actualizado");
  };
  const addSize=()=>setForm(f=>({...f,sizes:[...f.sizes,{label:"",price:0}]}));
  const removeSize=i=>setForm(f=>({...f,sizes:f.sizes.filter((_,idx)=>idx!==i)}));
  const updateSize=(i,k,v)=>setForm(f=>({...f,sizes:f.sizes.map((s,idx)=>idx===i?{...s,[k]:v}:s)}));
  const addService=()=>{
    const next=[...catalog,{id:`custom-${Date.now()}`,name:"Nuevo servicio",group:"Extras",sizes:[{label:"Estándar",price:0}],includes:[]}];
    setCatalog(next);saveCatalog(next);setEditing(next.length-1);setForm({...next[next.length-1]});
  };
  const deleteService=i=>{
    if(!confirm("¿Eliminar este servicio?"))return;
    const next=catalog.filter((_,idx)=>idx!==i);
    setCatalog(next);saveCatalog(next);showToast("Servicio eliminado","#ef4444");
  };

  const groups={};catalog.forEach((s,i)=>{if(!groups[s.group])groups[s.group]=[];groups[s.group].push({...s,_i:i});});

  if(editing!==null)return React.createElement("div",{style:{padding:"16px 14px 60px",maxWidth:520,margin:"0 auto"}},
    React.createElement("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:18}},
      React.createElement("button",{onClick:()=>setEditing(null),style:{background:"none",border:"1px solid #2a2a2a",borderRadius:8,color:"#d0d0d0",padding:"7px 14px",cursor:"pointer",fontSize:13}},"← Volver"),
      React.createElement("div",{style:{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,letterSpacing:2,color:"#c9a84c"}},"EDITAR SERVICIO")
    ),
    React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:10}},
      React.createElement("div",null,React.createElement("label",{className:"field-label"},"Nombre"),React.createElement("input",{className:"inp",value:form.name||"",onChange:e=>setForm(f=>({...f,name:e.target.value}))})),
      React.createElement("div",null,
        React.createElement("label",{className:"field-label"},"Categoría"),
        React.createElement("input",{className:"inp",value:form.group||"",onChange:e=>setForm(f=>({...f,group:e.target.value})),placeholder:"Artdeshine, Pulidos, Extras..."})
      )
    ),
    React.createElement("div",{className:"sec-label",style:{marginTop:18}},"Tallas y Precios"),
    (form.sizes||[]).map((s,i)=>
      React.createElement("div",{key:i,style:{display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:8,marginBottom:8,alignItems:"center"}},
        React.createElement("input",{className:"inp",value:s.label,placeholder:"Chico / Med / XL",onChange:e=>updateSize(i,"label",e.target.value)}),
        React.createElement("input",{className:"inp",type:"number",value:s.price,placeholder:"Precio",onChange:e=>updateSize(i,"price",parseFloat(e.target.value)||0)}),
        React.createElement("button",{onClick:()=>removeSize(i),style:{background:"none",border:"1px solid #2a2a2a",borderRadius:6,color:"#ef4444",padding:"8px 10px",cursor:"pointer",fontSize:14}},"×")
      )
    ),
    React.createElement("button",{onClick:addSize,style:{width:"100%",padding:"9px",background:"transparent",border:"1px dashed #c9a84c",borderRadius:8,color:"#c9a84c",fontSize:12,fontWeight:600,cursor:"pointer",marginBottom:6}},"+ Agregar talla"),
    React.createElement("div",{className:"sec-label"},"Qué incluye"),
    React.createElement("textarea",{className:"inp",style:{minHeight:100},value:(form.includes||[]).join("\n"),onChange:e=>setForm(f=>({...f,includes:e.target.value.split("\n")})),placeholder:"Un ítem por línea..."}),
    React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:18}},
      React.createElement("button",{onClick:()=>setEditing(null),style:{padding:"13px",background:"transparent",border:"1px solid #2a2a2a",borderRadius:10,color:"#d0d0d0",cursor:"pointer",fontSize:14}},"Cancelar"),
      React.createElement("button",{onClick:save,style:{padding:"13px",background:"#c9a84c",border:"none",borderRadius:10,color:"#000",fontWeight:700,fontSize:14,cursor:"pointer"}},"✓ Guardar")
    )
  );

  return React.createElement("div",{style:{padding:"16px 14px 60px",maxWidth:520,margin:"0 auto"}},
    React.createElement("div",{style:{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,letterSpacing:4,textTransform:"uppercase",color:"#909090",textAlign:"center",marginBottom:18}},"Catálogo de Servicios"),
    Object.entries(groups).map(([group,items])=>
      React.createElement("div",{key:group,style:{marginBottom:20}},
        React.createElement("div",{className:"sec-label",style:{marginTop:0}},group),
        items.map(s=>
          React.createElement("div",{key:s.id,style:{background:"#1c1c1c",border:"1px solid #2a2a2a",borderRadius:10,padding:"12px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}},React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:2,flexShrink:0}},React.createElement("button",{onClick:()=>moveUp(s._i),style:{background:"none",border:"1px solid #2a2a2a",borderRadius:4,color:"#909090",padding:"2px 6px",cursor:"pointer",fontSize:10,lineHeight:1}},"▲"),React.createElement("button",{onClick:()=>moveDown(s._i),style:{background:"none",border:"1px solid #2a2a2a",borderRadius:4,color:"#909090",padding:"2px 6px",cursor:"pointer",fontSize:10,lineHeight:1}},"▼")),
            React.createElement("div",{style:{flex:1,minWidth:0}},React.createElement("div",{style:{fontSize:13,fontWeight:600,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}},s.name),React.createElement("div",{style:{fontSize:10,color:"#909090",marginTop:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}},s.sizes.map(sz=>`${sz.label}: ${fmt(sz.price)}`).join(" · "))),
            React.createElement("div",{style:{display:"flex",gap:6}},
              React.createElement("button",{onClick:()=>startEdit(s._i),style:{background:"rgba(201,168,76,.12)",border:"1px solid rgba(201,168,76,.3)",borderRadius:7,color:"#c9a84c",padding:"6px 10px",cursor:"pointer",fontSize:13}},"✏️"),
              React.createElement("button",{onClick:()=>deleteService(s._i),style:{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.2)",borderRadius:7,color:"#ef4444",padding:"6px 10px",cursor:"pointer",fontSize:12}},"×")
            )
          )
        )
      )
    ),
    React.createElement("button",{onClick:addService,style:{width:"100%",padding:"13px",background:"transparent",border:"1px dashed #c9a84c",borderRadius:10,color:"#c9a84c",fontFamily:"'Barlow',sans-serif",fontSize:13,fontWeight:600,cursor:"pointer"}},"+ Nuevo servicio")
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CALENDAR MODULE
// ══════════════════════════════════════════════════════════════════════════════
function CalendarModule({showToast,cal,setCal,goToQuoterWithDate}){
  const today=new Date();
  const[year,setYear]=useState(today.getFullYear());
  const[month,setMonth]=useState(today.getMonth()+1);
  const[syncStatus,setSyncStatus]=useState("synced");
  const[modal,setModal]=useState(null);
  const[sel,setSel]=useState("available");
  const[form,setForm]=useState({});
  const[exportView,setExportView]=useState(false);
  const[notifEnabled,setNotifEnabled]=useState(typeof Notification!=="undefined"&&Notification.permission==="granted");
  const[showSvcPicker,setShowSvcPicker]=useState(false);
  const exportRef=useRef(null);
  const unsubRef=useRef(null);
  const catalog=loadCatalog();

  useEffect(()=>{
    let mounted=true;
    const init=async()=>{
      await new Promise(r=>setTimeout(r,800));
      const remote=await loadCalRemote();
      if(mounted&&remote)setCal(remote);
      unsubRef.current=subscribeCalRemote(data=>{if(mounted){setCal(data);saveCalLocal(data);}});
    };
    init();
    return()=>{mounted=false;if(unsubRef.current)unsubRef.current();};
  },[]);

  const calKey=d=>`${year}-${month}-${d}`;
  const updateDay=async(day,data)=>{
    const next={...cal};
    if(data===null)delete next[calKey(day)];else next[calKey(day)]=data;
    setCal(next);setSyncStatus("saving");
    await saveCalRemote(next);
    scheduleNotificationsForCal(next);
    setSyncStatus(isFirebaseReady()?"synced":"offline");
  };

  const stats=(()=>{let srv=0,disp=0,noDisp=0;for(let d=1;d<=getDaysInMonth(year,month);d++){const t=cal[calKey(d)]?.type||"available";if(t==="worked")srv++;else if(t==="available")disp++;else noDisp++;}return{srv,disp,noDisp};})();
  const prevMonth=()=>{if(month===1){setMonth(12);setYear(y=>y-1);}else setMonth(m=>m-1);};
  const nextMonth=()=>{if(month===12){setMonth(1);setYear(y=>y+1);}else setMonth(m=>m+1);};

  const openModal=d=>{
    const data=cal[calKey(d)]||{};
    setSel(data.type||"available");
    setForm({service:data.service||"",vehicle:data.vehicle||"",client:data.client||"",tel:data.tel||"",notes:data.notes||"",price:data.price||"",status:data.status||"confirmed",origin:data.origin||""});
    setModal(d);setShowSvcPicker(false);
  };

  const saveDay=()=>{
    if(sel==="available")updateDay(modal,null);
    else updateDay(modal,{type:sel,...form});
    setModal(null);
    showToast(isFirebaseReady()?"☁ Sincronizado":"✓ Guardado");
  };

  const sendReminder=()=>{
    const tel=(form.tel||"").replace(/\D/g,"");
    const dayName=DAY_NAMES[(modal+getFirstDayOffset(year,month)-1)%7]||"";
    const dateStr=`${dayName} ${modal} de ${MONTHS[month-1].toLowerCase()}`;
    const msg=`Hola${form.client?" "+form.client:""}! 👋 Te recordamos que tienes agendado con *Alpha Detailing* el *${dateStr}*:\n\n🚗 ${form.service||"tu servicio"}${form.vehicle?" — "+form.vehicle:""}\n⏰ Tiempo estimado: 5-8 hrs\n\n¡Te esperamos! ✨`;
    const phone=tel||ALPHA_PHONE;
    window.open(`https://wa.me/52${phone}?text=${encodeURIComponent(msg)}`,"_blank");
  };

  const sendPostService=()=>{
    const tel=(form.tel||"").replace(/\D/g,"");
    const isCeramic=form.service&&(form.service.toUpperCase().includes("ARTDESHINE")||form.service.toUpperCase().includes("CERÁMICO")||form.service.toUpperCase().includes("CERAMICO")||form.service.toUpperCase().includes("LÍNEA BASE")||form.service.toUpperCase().includes("LINEA BASE"));
    const msg=`¡Gracias${form.client?" "+form.client:""}! 🙌✨\n\nFue un placer trabajar en tu *${form.vehicle||"vehículo"}*. Tu auto ha quedado en perfectas condiciones.\n\n${isCeramic?`📋 *Guía de Mantenimiento Cerámico*\nPara mantener tu cerámico en óptimas condiciones, te compartimos nuestra guía:\n${ULTRADETAILING_LINK}\n\n🛒 También puedes adquirir el *Kit de Mantenimiento Alpha Detailing* con 20% de descuento usando el link anterior.\n\n`:""}¡Recuerda que estamos aquí para cualquier duda! 💛\n\n*Alpha Detailing Monterrey*\nWA: +52 ${ALPHA_PHONE}`;
    const phone=tel||ALPHA_PHONE;
    window.open(`https://wa.me/52${phone}?text=${encodeURIComponent(msg)}`,"_blank");
    // Save 6-month maintenance reminder if ceramic service
    if(isCeramic&&form.client){
      const serviceDate=new Date(year,month-1,modal);
      saveMaintReminder(form.client,form.tel||"",form.vehicle||"",serviceDate);
      showToast("✓ Recordatorio de mantenimiento guardado a 6 meses");
    }
  };

  const enableNotifications=async()=>{const ok=await requestNotifPermission();if(ok){setNotifEnabled(true);scheduleNotificationsForCal(cal);showToast("🔔 Notificaciones activadas");}else showToast("No se pudo activar","#ef4444");};
  const handleExport=async()=>{if(!exportRef.current)return;const btn=document.getElementById("dl-btn");if(btn){btn.disabled=true;btn.textContent="Generando…";}try{const canvas=await html2canvas(exportRef.current,{backgroundColor:"#111111",scale:2,useCORS:true,logging:false});const link=document.createElement("a");link.download=`Alpha-${MONTHS[month-1]}-${year}.png`;link.href=canvas.toDataURL("image/png");link.click();showToast("✓ Imagen lista");}catch(e){showToast("Error","#ef4444");}if(btn){btn.disabled=false;btn.textContent="⬇ Descargar imagen";}};

  const offset=getFirstDayOffset(year,month);
  const daysInMonth=getDaysInMonth(year,month);
  const stColor=syncStatus==="synced"?"#22c55e":syncStatus==="saving"?"#c9a84c":"#ef4444";

  const cells=[];
  for(let i=0;i<offset;i++)cells.push(React.createElement("div",{key:`e${i}`,style:{aspectRatio:".72"}}));
  for(let d=1;d<=daysInMonth;d++){
    const data=cal[calKey(d)];const type=data?.type||"available";
    const stObj=SERVICE_STATUSES.find(s=>s.id===data?.status);
    const bc=type==="worked"?(stObj?.color||"#c9a84c"):type==="available"?"#22c55e":"#ef4444";
    const bg=type==="worked"?"#1a1500":type==="available"?"#0b1f12":"#1a0d0d";
    const isToday=d===today.getDate()&&month===today.getMonth()+1&&year===today.getFullYear();
    cells.push(React.createElement("div",{key:d,className:"day-cell",style:{borderColor:bc,background:bg,outline:isToday?`2px solid ${bc}`:"none",outlineOffset:"2px"},onClick:()=>openModal(d)},
      React.createElement("div",{className:"day-num",style:{color:bc}},d),
      React.createElement("div",{className:"day-dot",style:{background:bc,animation:type==="available"?"pulse 2s infinite":"none"}}),
      React.createElement("div",{className:"day-content"},
        type==="worked"&&data?[
          data.service&&React.createElement("div",{key:"s",className:"tag-svc"},data.service.replace(/\s*\([^)]*\)\s*/g," ").trim()),
          data.vehicle&&React.createElement("div",{key:"v",className:"tag-veh"},data.vehicle),
          stObj&&React.createElement("div",{key:"st",style:{fontSize:"clamp(5px,1.1vw,7px)",color:stObj.color,fontWeight:700,marginTop:1}},stObj.emoji+" "+stObj.label),
        ]:type==="available"?React.createElement("div",{className:"tag-libre"},"✦ Libre"):React.createElement("div",{className:"tag-nod"},"✕ No disp.")
      )
    ));
  }

  const exportCells=[];
  for(let i=0;i<offset;i++)exportCells.push(React.createElement("div",{key:`ee${i}`}));
  for(let d=1;d<=daysInMonth;d++){
    const data=cal[calKey(d)];const type=data?.type||"available";
    const bc=type==="worked"?"#c9a84c":type==="available"?"#22c55e":"#ef4444";
    const bg=type==="worked"?"#1a1500":type==="available"?"#0b1f12":"#1a0d0d";
    exportCells.push(React.createElement("div",{key:d,className:"export-day-cell",style:{borderColor:bc,background:bg}},
      React.createElement("div",{className:"export-day-num",style:{color:bc}},d),
      React.createElement("div",{className:"export-day-lbl",style:{color:bc}},type==="worked"?"Ocupado":type==="available"?"Libre":"No disp.")
    ));
  }

  // Service picker groups
  const svcGroups={};catalog.forEach(s=>{if(!svcGroups[s.group])svcGroups[s.group]=[];svcGroups[s.group].push(s);});

  return React.createElement("div",{className:"cal-wrap"},
    React.createElement("div",{className:"cal-header"},
      React.createElement("div",{className:"month-nav"},
        React.createElement("button",{className:"nav-btn",onClick:prevMonth},"‹"),
        React.createElement("div",{className:"month-title"},`${MONTHS[month-1]} ${year}`),
        React.createElement("button",{className:"nav-btn",onClick:nextMonth},"›")
      ),
      React.createElement("p",{style:{fontSize:9,letterSpacing:3,color:"#909090",textTransform:"uppercase",marginTop:4}},"Toca un día para editarlo"),
      React.createElement("div",{style:{display:"flex",gap:8,justifyContent:"center",alignItems:"center",marginTop:8,flexWrap:"wrap"}},
        React.createElement("div",{style:{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 12px",borderRadius:20,fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",background:`${stColor}18`,color:stColor,border:`1px solid ${stColor}44`}},
          React.createElement("div",{style:{width:6,height:6,borderRadius:"50%",background:stColor,animation:syncStatus==="saving"?"pulse .7s infinite":"none"}}),
          syncStatus==="synced"?(isFirebaseReady()?"☁ Sincronizado":"💾 Local"):syncStatus==="saving"?"Guardando…":"Sin conexión"
        ),
        !notifEnabled&&React.createElement("button",{onClick:enableNotifications,style:{padding:"3px 12px",borderRadius:20,fontSize:10,fontWeight:700,letterSpacing:1,background:"rgba(201,168,76,.12)",color:"#c9a84c",border:"1px solid rgba(201,168,76,.3)",cursor:"pointer"}},"🔔 Activar avisos")
      )
    ),
    React.createElement("div",{className:"stats-grid"},
      [{v:stats.srv,l:"Servicios",c:"#c9a84c"},{v:stats.disp,l:"Días Libres",c:"#22c55e"},{v:stats.noDisp,l:"No Disponible",c:"#ef4444"}].map(({v,l,c})=>
        React.createElement("div",{key:l,className:"stat-card"},React.createElement("div",{className:"stat-num",style:{color:c}},v),React.createElement("div",{className:"stat-lbl"},l))
      )
    ),
    React.createElement("div",{className:"legend"},
      [["#c9a84c","Servicio agendado"],["#22c55e","Disponible"],["#ef4444","No disponible"]].map(([c,l])=>
        React.createElement("div",{key:l,className:"legend-item"},React.createElement("div",{className:"legend-dot",style:{borderColor:c,background:`${c}25`}}),l)
      )
    ),
    React.createElement("div",{className:"cal-grid-wrap"},
      React.createElement("div",{className:"day-headers"},DAY_SHORT.map(d=>React.createElement("div",{key:d,className:"day-head"},d))),
      React.createElement("div",{className:"days-grid"},cells)
    ),
    React.createElement("button",{className:"export-btn",onClick:()=>setExportView(true)},"📤 Exportar imagen para clientes"),

    // ── DAY MODAL ──
    modal&&React.createElement("div",{className:"modal-overlay",onClick:e=>e.target===e.currentTarget&&setModal(null)},
      React.createElement("div",{className:"modal-sheet"},
        React.createElement("div",{className:"modal-handle"}),
        React.createElement("div",{className:"modal-title"},`${MONTHS[month-1]} ${modal}`),
        React.createElement("div",{className:"modal-sub"},DAY_NAMES[new Date(year,month-1,modal).getDay()]),
        React.createElement("div",{className:"type-grid"},
          [{t:"worked",e:"🟡",l:"Servicio\nAgendado"},{t:"available",e:"🟢",l:"Disponible"},{t:"free",e:"🔴",l:"No\nDisponible"}].map(({t,e,l})=>{
            const active=sel===t;const ac=t==="worked"?"#c9a84c":t==="available"?"#22c55e":"#ef4444";
            return React.createElement("div",{key:t,className:"type-card",style:{borderColor:active?ac:"#2a2a2a",background:active?`${ac}18`:"#161616"},onClick:()=>setSel(t)},
              React.createElement("span",{className:"type-emoji"},e),React.createElement("span",{className:"type-lbl",style:{color:active?ac:"#909090"}},l)
            );
          })
        ),
        sel==="worked"&&React.createElement("div",null,
          // SERVICE PICKER
          React.createElement("label",{className:"field-label",style:{marginTop:12,display:"block"}},"Servicio"),
          React.createElement("div",{style:{display:"flex",gap:6,marginBottom:6}},
            React.createElement("input",{className:"inp",style:{flex:1},value:form.service,placeholder:"Escribe o selecciona…",onChange:e=>setForm(f=>({...f,service:e.target.value}))}),
            React.createElement("button",{onClick:()=>setShowSvcPicker(p=>!p),style:{padding:"0 12px",background:showSvcPicker?"#c9a84c":"rgba(201,168,76,.12)",border:"1px solid rgba(201,168,76,.3)",borderRadius:8,color:showSvcPicker?"#000":"#c9a84c",cursor:"pointer",fontSize:16,flexShrink:0}},"☰")
          ),
          showSvcPicker&&React.createElement("div",{style:{background:"#1c1c1c",border:"1px solid #2a2a2a",borderRadius:10,padding:"10px",marginBottom:10,maxHeight:240,overflowY:"auto"}},
            React.createElement("div",{style:{fontSize:9,color:"#909090",letterSpacing:1,textTransform:"uppercase",marginBottom:8,textAlign:"center",fontFamily:"'Barlow',sans-serif"}},
              form.service?"Toca para agregar al servicio actual ✚":"Selecciona un servicio"
            ),
            Object.entries(svcGroups).map(([group,items])=>
              React.createElement("div",{key:group,style:{marginBottom:10}},
                React.createElement("div",{style:{fontSize:9,letterSpacing:2,color:"#c9a84c",textTransform:"uppercase",marginBottom:5,fontWeight:700}},group),
                items.map(s=>
                  React.createElement("div",{key:s.id,style:{marginBottom:4}},
                    s.sizes.length===1
                      ? React.createElement("button",{onClick:()=>{
                            const cur=form.service||"";
                            const curP=parseFloat(form.price)||0;
                            setForm(f=>({...f,service:cur?`${cur} + ${s.name}`:s.name,price:String(curP+s.sizes[0].price)}));
                            setShowSvcPicker(false);
                          },style:{width:"100%",textAlign:"left",padding:"7px 10px",background:"rgba(201,168,76,.06)",border:"1px solid #2a2a2a",borderRadius:7,color:"#d0d0d0",cursor:"pointer",fontSize:12,display:"flex",justifyContent:"space-between"}},
                        React.createElement("span",null,s.name),React.createElement("span",{style:{color:"#c9a84c",fontWeight:700}},fmt(s.sizes[0].price))
                      )
                      : React.createElement("div",null,
                          React.createElement("div",{style:{fontSize:11,color:"#d0d0d0",padding:"4px 8px 3px",fontWeight:600}},s.name),
                          React.createElement("div",{style:{display:"flex",gap:4,flexWrap:"wrap",padding:"0 4px 4px"}},
                            s.sizes.map(sz=>
                              React.createElement("button",{key:sz.label,onClick:()=>{
                                    const cur=form.service||"";
                                    const curP=parseFloat(form.price)||0;
                                    setForm(f=>({...f,service:cur?`${cur} + ${s.name} (${sz.label})`:`${s.name} (${sz.label})`,price:String(curP+sz.price)}));
                                    setShowSvcPicker(false);
                                  },style:{padding:"4px 10px",background:"rgba(201,168,76,.08)",border:"1px solid rgba(201,168,76,.2)",borderRadius:6,color:"#c9a84c",cursor:"pointer",fontSize:11,fontWeight:600}},
                                `${sz.label} — ${fmt(sz.price)}`
                              )
                            )
                          )
                        )
                  )
                )
              )
            )
          ),
          // Compact 2-col grid for client + vehicle info
          React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:10}},
            React.createElement("div",null,React.createElement("label",{className:"field-label"},"Cliente"),React.createElement("input",{className:"inp",value:form.client,placeholder:"Nombre",onChange:e=>setForm(f=>({...f,client:e.target.value}))})),
            React.createElement("div",null,React.createElement("label",{className:"field-label"},"Teléfono"),React.createElement("input",{className:"inp",type:"tel",value:form.tel||"",placeholder:"81...",onChange:e=>setForm(f=>({...f,tel:e.target.value}))})),
            React.createElement("div",{style:{gridColumn:"1/-1"}},React.createElement("label",{className:"field-label"},"Vehículo"),React.createElement("input",{className:"inp",value:form.vehicle,placeholder:"Ej. CRV 2026 Blanca",onChange:e=>setForm(f=>({...f,vehicle:e.target.value}))})),
            React.createElement("div",null,React.createElement("label",{className:"field-label"},"Precio"),React.createElement("input",{className:"inp",type:"number",value:form.price,placeholder:"14499",onChange:e=>setForm(f=>({...f,price:e.target.value}))})),
            React.createElement("div",null,React.createElement("label",{className:"field-label"},"Origen"),React.createElement("select",{className:"inp",value:form.origin,onChange:e=>setForm(f=>({...f,origin:e.target.value})),style:{cursor:"pointer"}},
              React.createElement("option",{value:""},"— Origen"),
              [{id:"recomendacion",label:"Recomendación"},{id:"antiguo",label:"Cliente antiguo"},{id:"redes",label:"Redes sociales"},{id:"marketing",label:"Marketing"},{id:"otro",label:"Otro"}].map(o=>React.createElement("option",{key:o.id,value:o.id},o.label))
            ))
          ),
          // Status compact
          React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:5,marginTop:10}},
            SERVICE_STATUSES.map(st=>{
              const active=form.status===st.id;
              return React.createElement("button",{key:st.id,onClick:()=>setForm(f=>({...f,status:st.id})),style:{padding:"7px 2px",borderRadius:7,border:`1.5px solid ${active?st.color:"#2a2a2a"}`,background:active?`${st.color}18`:"transparent",color:active?st.color:"#909090",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"'Barlow',sans-serif",lineHeight:1.3,textAlign:"center"}},`${st.emoji}\n${st.label}`);
            })
          ),
          React.createElement("div",{style:{marginTop:8}},
            React.createElement("label",{className:"field-label"},"Notas internas"),
            React.createElement("input",{className:"inp",value:form.notes,placeholder:"Notas internas (no aparecen en cotización)…",onChange:e=>setForm(f=>({...f,notes:e.target.value}))})
          )
        ),
        React.createElement("div",{className:"btn-row"},
          React.createElement("button",{className:"btn-cancel",onClick:()=>setModal(null)},"Cancelar"),
          React.createElement("button",{className:"btn-save",onClick:saveDay},"Guardar")
        ),
        sel==="worked"&&React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:8,marginTop:10}},
          React.createElement("button",{onClick:()=>{saveDay();goToQuoterWithDate(`${year}-${month}-${modal}`);},style:{width:"100%",padding:"11px",background:"transparent",border:"1px dashed #c9a84c",borderRadius:10,color:"#c9a84c",fontFamily:"'Barlow',sans-serif",fontWeight:600,fontSize:13,cursor:"pointer"}},"💰 Guardar y crear cotización"),
          React.createElement("button",{onClick:sendReminder,style:{width:"100%",padding:"11px",background:"transparent",border:"1px dashed #25d366",borderRadius:10,color:"#25d366",fontFamily:"'Barlow',sans-serif",fontWeight:600,fontSize:13,cursor:"pointer"}},"💬 Enviar recordatorio al cliente"),
          React.createElement("button",{onClick:sendPostService,style:{width:"100%",padding:"11px",background:"transparent",border:"1px dashed #8b5cf6",borderRadius:10,color:"#8b5cf6",fontFamily:"'Barlow',sans-serif",fontWeight:600,fontSize:13,cursor:"pointer"}},"✨ Mensaje post-servicio + guía")
        )
      )
    ),

    // ── EXPORT ──
    exportView&&React.createElement("div",{className:"export-overlay"},
      React.createElement("div",{className:"export-inner"},
        React.createElement("div",{className:"export-bar"},
          React.createElement("span",{style:{fontSize:11,letterSpacing:3,color:"#909090",textTransform:"uppercase"}},"Vista para clientes"),
          React.createElement("button",{className:"close-btn",onClick:()=>setExportView(false)},"✕ Cerrar")
        ),
        React.createElement("div",{ref:exportRef,id:"cal-export-canvas"},
          React.createElement("div",{className:"export-cal-title"},`${MONTHS[month-1].toUpperCase()} ${year}`),
          React.createElement("div",{className:"export-cal-sub"},"A L P H A   D E T A I L I N G  —  Disponibilidad"),
          React.createElement("div",{className:"export-cal-grid"},DAY_SHORT.map(d=>React.createElement("div",{key:d,className:"export-day-head"},d)),exportCells),
          React.createElement("div",{className:"export-legend"},[["#22c55e","Disponible"],["#c9a84c","Ocupado"],["#ef4444","No disponible"]].map(([c,l])=>React.createElement("div",{key:l,className:"export-legend-item"},React.createElement("div",{className:"export-legend-dot",style:{borderColor:c,background:`${c}20`}}),l))),
          React.createElement("div",{className:"export-footer"},"ALPHA ",React.createElement("span",null,"DETAILING"))
        ),
        React.createElement("button",{id:"dl-btn",className:"dl-btn",onClick:handleExport},"⬇ Descargar imagen")
      )
    )
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// DATE PICKER
// ══════════════════════════════════════════════════════════════════════════════
function DatePicker({value,onChange}){
  const today=new Date();
  const initYear=value?parseInt(value.split("-")[0]):today.getFullYear();
  const initMonth=value?parseInt(value.split("-")[1]):today.getMonth()+1;
  const[py,setPy]=useState(initYear);
  const[pm,setPm]=useState(initMonth);
  const[open,setOpen]=useState(false);
  const offset=getFirstDayOffset(py,pm);
  const days=getDaysInMonth(py,pm);
  const selDay=value&&parseInt(value.split("-")[0])===py&&parseInt(value.split("-")[1])===pm?parseInt(value.split("-")[2]):null;
  return React.createElement("div",{style:{position:"relative"}},
    React.createElement("button",{onClick:()=>setOpen(o=>!o),style:{width:"100%",background:"#161616",border:"1px solid #2a2a2a",borderRadius:8,color:value?"#d0d0d0":"#909090",padding:"11px 12px",fontFamily:"'Barlow',sans-serif",fontSize:14,textAlign:"left",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}},value?fmtDateNice(value):"Seleccionar fecha",React.createElement("span",{style:{color:"#c9a84c"}},"📅")),
    open&&React.createElement("div",{style:{position:"absolute",top:"calc(100% + 6px)",left:0,right:0,zIndex:200,background:"#1c1c1c",border:"1px solid #2a2a2a",borderRadius:12,padding:14,boxShadow:"0 12px 40px rgba(0,0,0,.6)"}},
      React.createElement("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}},
        React.createElement("button",{onClick:()=>{if(pm===1){setPm(12);setPy(y=>y-1);}else setPm(m=>m-1);},style:{background:"none",border:"none",color:"#c9a84c",fontSize:20,cursor:"pointer",padding:"0 6px"}},"‹"),
        React.createElement("span",{style:{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,letterSpacing:2,color:"#fff"}},`${MONTHS_SHORT[pm-1]} ${py}`),
        React.createElement("button",{onClick:()=>{if(pm===12){setPm(1);setPy(y=>y+1);}else setPm(m=>m+1);},style:{background:"none",border:"none",color:"#c9a84c",fontSize:20,cursor:"pointer",padding:"0 6px"}},"›")
      ),
      React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:4}},DAY_SHORT.map(d=>React.createElement("div",{key:d,style:{textAlign:"center",fontSize:8,color:"#909090",fontWeight:700,padding:"2px 0"}},d))),
      React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}},
        [...Array(offset)].map((_,i)=>React.createElement("div",{key:`e${i}`})),
        [...Array(days)].map((_,i)=>{const d=i+1;const isSel=selDay===d;const isT=d===today.getDate()&&pm===today.getMonth()+1&&py===today.getFullYear();return React.createElement("button",{key:d,onClick:()=>{onChange(`${py}-${pm}-${d}`);setOpen(false);},style:{padding:"6px 2px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:isSel?700:400,background:isSel?"#c9a84c":isT?"rgba(201,168,76,.15)":"transparent",color:isSel?"#000":isT?"#c9a84c":"#d0d0d0"}},d);})
      ),
      React.createElement("button",{onClick:()=>{onChange("");setOpen(false);},style:{width:"100%",marginTop:10,padding:"7px",background:"transparent",border:"1px solid #2a2a2a",borderRadius:6,color:"#909090",fontSize:11,cursor:"pointer",fontFamily:"'Barlow',sans-serif"}},"Limpiar fecha")
    )
  );
}

// ── CLIENT AUTOCOMPLETE ──
function ClientAutocomplete({value,onChange,onSelect,placeholder}){
  const[open,setOpen]=useState(false);
  const clients=loadClients();
  const filtered=value.length>0?clients.filter(c=>c.nombre&&c.nombre.toLowerCase().includes(value.toLowerCase())):clients.slice(0,5);
  return React.createElement("div",{style:{position:"relative"}},
    React.createElement("input",{className:"inp",value,placeholder,onChange:e=>{onChange(e.target.value);setOpen(true);},onFocus:()=>setOpen(true),onBlur:()=>setTimeout(()=>setOpen(false),200)}),
    open&&filtered.length>0&&React.createElement("div",{style:{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,zIndex:300,background:"#1c1c1c",border:"1px solid #2a2a2a",borderRadius:10,overflow:"hidden",boxShadow:"0 8px 30px rgba(0,0,0,.5)"}},
      filtered.map((c,i)=>React.createElement("div",{key:i,onMouseDown:()=>{onSelect(c);setOpen(false);},style:{padding:"10px 14px",cursor:"pointer",borderBottom:i<filtered.length-1?"1px solid #2a2a2a":"none",display:"flex",justifyContent:"space-between",alignItems:"center"}},
        React.createElement("div",null,React.createElement("div",{style:{fontSize:13,fontWeight:600,color:"#d0d0d0"}},c.nombre),c.modelo&&React.createElement("div",{style:{fontSize:11,color:"#7dd3fc"}},c.modelo)),
        c.tel&&React.createElement("div",{style:{fontSize:11,color:"#909090"}},c.tel)
      ))
    )
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// QUOTER MODULE
// ══════════════════════════════════════════════════════════════════════════════
function QuoterModule({showToast,cal,prefillDate,onPrefillUsed}){
  const catalog=loadCatalog();
  const blankForm=num=>({num:num||getNextQuoteNum(),dateKey:todayISO(),nombre:"",tel:"",dir:"",modelo:"",año:"",color:"",notas:"Tiempo de entrega de 5-8 horas aproximadamente.",pago:"Efectivo, Transferencia, Tarjeta…"});
  const[fields,setFields]=useState(()=>blankForm());
  const[services,setServices]=useState([{catalogId:"",name:"",size:"",price:"",includes:[],customName:"",isCustom:false}]);
  const[anticipo,setAnticipo]=useState("");
  const[descuento,setDescuento]=useState("");
  const[descLabel,setDescLabel]=useState("Descuento referido");
  const[preview,setPreview]=useState(false);
  const[showSvcPicker,setShowSvcPicker]=useState(null); // index

  useEffect(()=>{
    if(!prefillDate||!cal)return;
    const data=cal[prefillDate];if(!data)return;
    // Strip internal notes (not for client)
    const INTERNAL_NOTES=["referido","cliente antiguo","cliente vip","recomendación","recomendacion","ads","jrp","cliente nuevo"];
    const cleanNotes=data.notes?data.notes.split(/[.,;]/).map(n=>n.trim()).filter(n=>n&&!INTERNAL_NOTES.some(k=>n.toLowerCase().includes(k))).join(". "):"";
    setFields(f=>({...f,dateKey:prefillDate,modelo:data.vehicle||f.modelo,nombre:data.client||f.nombre,tel:data.tel||f.tel,notas:"Tiempo de entrega de 5-8 horas aproximadamente."}));
    if(data.service){
      const up=data.service.toUpperCase();
      const matched=catalog.find(s=>up.includes(s.name.toUpperCase().split("—")[0].trim().split("(")[0].trim())||s.name.toUpperCase().split("—")[0].trim().includes(up.split(" ")[0]));
      if(matched){
        const sz=matched.sizes.length===1?matched.sizes[0]:matched.sizes.find(s=>s.label==="Mediano")||matched.sizes[0];
        setServices([{catalogId:matched.id,name:matched.name,size:sz.label,price:data.price||String(sz.price),includes:matched.includes,customName:"",isCustom:false}]);
      }
    }
    // Smart vehicle parser: "CRV 2026 Blanca" → modelo=CRV, año=2026, color=Blanca
    if(data.vehicle){
      const COLORS=["blanco","blanca","negro","negra","gris","plateado","plateada","rojo","roja","azul","verde","amarillo","amarilla","naranja","café","beige","morado","morada","rosa","dorado","dorada","blanco perla","gris oscuro","gris claro","plata","silver","white","black","gray","red","blue"];
      const parts=data.vehicle.split(/\s+/);
      const yearMatch=parts.find(p=>/^(19|20)\d{2}$/.test(p));
      const colorMatch=parts.find(p=>COLORS.some(c=>c===p.toLowerCase()));
      const modelParts=parts.filter(p=>p!==yearMatch&&p!==colorMatch);
      const modelo=modelParts.join(" ")||data.vehicle;
      setFields(f=>({...f,
        modelo:modelo||f.modelo,
        año:yearMatch||f.año,
        color:colorMatch?colorMatch.charAt(0).toUpperCase()+colorMatch.slice(1).toLowerCase():f.color
      }));
    }
    onPrefillUsed&&onPrefillUsed();showToast("✓ Datos importados del calendario");
  },[prefillDate]);

  const f=(k,v)=>setFields(p=>({...p,[k]:v}));
  const addService=()=>setServices(s=>[...s,{catalogId:"",name:"",size:"",price:"",includes:[],customName:"",isCustom:false}]);
  const removeService=i=>setServices(s=>s.filter((_,idx)=>idx!==i));
  const updateService=(i,k,v)=>setServices(s=>s.map((x,idx)=>idx===i?{...x,[k]:v}:x));

  const selectCatalogItem=(i,item,sz)=>{
    // Fix: single atomic update to avoid race condition with multiple setServices calls
    setServices(s=>s.map((x,idx)=>idx===i?{...x,catalogId:item.id,name:item.name,size:sz.label,price:String(sz.price),includes:item.includes,isCustom:false}:x));
    setShowSvcPicker(null);
  };

  const subtotal=services.reduce((acc,s)=>acc+(parseFloat(s.price)||0),0);
  const total=Math.max(0,subtotal-(parseFloat(anticipo)||0)-(parseFloat(descuento)||0));

  const svcGroups={};catalog.forEach(s=>{if(!svcGroups[s.group])svcGroups[s.group]=[];svcGroups[s.group].push(s);});

  const saveAndNew=()=>{
    const quotes=loadQuotes();
    const svcForSave=services.map(s=>({name:s.isCustom?(s.customName||"Servicio"):s.name+(s.size?` (${s.size})`:""),price:s.price,includes:s.includes}));
    quotes.push({...fields,fecha:fmtDateNice(fields.dateKey),services:svcForSave,anticipo:parseFloat(anticipo)||0,descuento:parseFloat(descuento)||0,descLabel,total,savedAt:Date.now()});
    saveQuotes(quotes);
    saveClient({nombre:fields.nombre,tel:fields.tel,dir:fields.dir,modelo:fields.modelo,color:fields.color});
    const newNum=getNextQuoteNum();setFields(blankForm(newNum));
    setServices([{catalogId:"",name:"",size:"",price:"",includes:[],customName:"",isCustom:false}]);
    setAnticipo("");setDescuento("");setDescLabel("Descuento referido");setPreview(false);
    showToast("✓ Cotización guardada");
  };

  const sendWhatsApp=()=>{
    if(!fields.tel){showToast("Agrega el teléfono primero","#f59e0b");return;}
    const phone=fields.tel.replace(/\D/g,"");
    const svcLine=services.map(s=>{const name=s.isCustom?(s.customName||"Servicio"):s.name+(s.size?` (${s.size})`:"");return`• ${name}: ${fmt(parseFloat(s.price)||0)}`;}).join("\n");
    const msg=`Hola ${fields.nombre||""}! 👋\n\nTe comparto tu cotización de *Alpha Detailing*:\n\n*Cotización #${fields.num}*\n📅 ${fmtDateNice(fields.dateKey)}\n🚗 ${fields.modelo||"Tu vehículo"}\n\n${svcLine}\n\n*Total: ${fmt(total)}*\n\n⏰ Tiempo estimado: 5-8 hrs\n💳 Pago: ${fields.pago}\n\n¿Tienes alguna pregunta? ¡Con gusto te ayudamos! 🙌`;
    window.open(`https://wa.me/52${phone}?text=${encodeURIComponent(msg)}`,"_blank");
  };

  const inp={className:"inp"};

  return React.createElement("div",{className:"quoter-wrap"},
    React.createElement("div",{style:{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,letterSpacing:4,textTransform:"uppercase",color:"#909090",textAlign:"center",marginBottom:18}},"Nueva Cotización"),

    React.createElement("div",{className:"sec-label"},"Número & Fecha"),
    React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}},
      React.createElement("div",null,React.createElement("label",{className:"field-label"},"No."),React.createElement("input",{...inp,value:fields.num,onChange:e=>f("num",e.target.value)})),
      React.createElement("div",null,React.createElement("label",{className:"field-label"},"Fecha"),React.createElement("div",{style:{fontSize:12,color:"#888",marginBottom:4,marginTop:5}},fmtDateNice(fields.dateKey)||"Sin fecha"))
    ),
    React.createElement(DatePicker,{value:fields.dateKey,onChange:v=>f("dateKey",v)}),

    React.createElement("div",{className:"sec-label"},"Cliente"),
    React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:10}},
      React.createElement("div",null,React.createElement("label",{className:"field-label"},"Nombre"),React.createElement(ClientAutocomplete,{value:fields.nombre,placeholder:"Nombre completo",onChange:v=>f("nombre",v),onSelect:c=>{setFields(p=>({...p,nombre:c.nombre||p.nombre,tel:c.tel||p.tel,dir:c.dir||p.dir,modelo:c.modelo||p.modelo,color:c.color||p.color}));showToast("✓ Cliente cargado");}})),
      React.createElement("div",null,React.createElement("label",{className:"field-label"},"Teléfono"),React.createElement("input",{...inp,value:fields.tel,placeholder:"Teléfono",type:"tel",onChange:e=>f("tel",e.target.value)})),
      React.createElement("div",null,React.createElement("label",{className:"field-label"},"Dirección"),React.createElement("input",{...inp,value:fields.dir,placeholder:"Calle, Col., Ciudad",onChange:e=>f("dir",e.target.value)}))
    ),

    React.createElement("div",{className:"sec-label"},"Vehículo"),
    React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:10}},
      React.createElement("div",null,React.createElement("label",{className:"field-label"},"Modelo"),React.createElement("input",{...inp,value:fields.modelo,placeholder:"Modelo del vehículo",onChange:e=>f("modelo",e.target.value)})),
      React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}},
        React.createElement("div",null,React.createElement("label",{className:"field-label"},"Año"),React.createElement("input",{...inp,value:fields.año,placeholder:"Año",onChange:e=>f("año",e.target.value)})),
        React.createElement("div",null,React.createElement("label",{className:"field-label"},"Color"),React.createElement("input",{...inp,value:fields.color,placeholder:"Color",onChange:e=>f("color",e.target.value)}))
      )
    ),

    React.createElement("div",{className:"sec-label"},"Servicios"),
    ...services.map((s,i)=>React.createElement("div",{key:i,className:"pkg-card"},
      services.length>1&&React.createElement("button",{className:"remove-svc-btn",onClick:()=>removeService(i)},"×"),
      s.isCustom
        ? React.createElement("div",null,
            React.createElement("label",{className:"field-label"},"Nombre del servicio"),
            React.createElement("input",{...inp,style:{marginBottom:8},value:s.customName,placeholder:"Nombre del servicio",onChange:e=>updateService(i,"customName",e.target.value)}),
            React.createElement("label",{className:"field-label"},"Precio"),
            React.createElement("input",{...inp,style:{marginBottom:8},type:"number",value:s.price,placeholder:"0",onChange:e=>updateService(i,"price",e.target.value)}),
            React.createElement("label",{className:"field-label"},"Incluye (una por línea)"),
            React.createElement("textarea",{...inp,style:{height:70},value:(s.includes||[]).join("\n"),onChange:e=>updateService(i,"includes",e.target.value.split("\n"))}),
            React.createElement("button",{onClick:()=>updateService(i,"isCustom",false),style:{marginTop:6,fontSize:11,color:"#909090",background:"none",border:"none",cursor:"pointer",padding:0}},"← Seleccionar del catálogo")
          )
        : React.createElement("div",null,
            React.createElement("div",{style:{display:"flex",gap:6,marginBottom:8}},
              React.createElement("div",{style:{flex:1,background:"#2a2a2a",borderRadius:8,padding:"10px 12px",minHeight:40,display:"flex",alignItems:"center"}},
                s.name?React.createElement("div",null,
                  React.createElement("div",{style:{fontSize:13,color:"#fff",fontWeight:600}},s.name+(s.size?` · ${s.size}`:"")),
                  s.price&&React.createElement("div",{style:{fontSize:12,color:"#c9a84c",fontWeight:700}},fmt(parseFloat(s.price)))
                ):React.createElement("div",{style:{fontSize:13,color:"#909090"}},"Selecciona un servicio…")
              ),
              React.createElement("button",{onClick:()=>setShowSvcPicker(showSvcPicker===i?null:i),style:{padding:"0 12px",background:showSvcPicker===i?"#c9a84c":"rgba(201,168,76,.12)",border:"1px solid rgba(201,168,76,.3)",borderRadius:8,color:showSvcPicker===i?"#000":"#c9a84c",cursor:"pointer",fontSize:16,flexShrink:0}},"☰")
            ),
            showSvcPicker===i&&React.createElement("div",{style:{background:"#161616",border:"1px solid #2a2a2a",borderRadius:10,padding:"10px",marginBottom:8,maxHeight:240,overflowY:"auto"}},
              Object.entries(svcGroups).map(([group,items])=>
                React.createElement("div",{key:group,style:{marginBottom:10}},
                  React.createElement("div",{style:{fontSize:9,letterSpacing:2,color:"#c9a84c",textTransform:"uppercase",marginBottom:6,fontWeight:700}},group),
                  items.map(item=>
                    item.sizes.length===1
                      ?React.createElement("button",{key:item.id,onClick:()=>selectCatalogItem(i,item,item.sizes[0]),style:{width:"100%",textAlign:"left",padding:"8px 10px",marginBottom:4,background:"rgba(201,168,76,.06)",border:"1px solid #2a2a2a",borderRadius:7,color:"#d0d0d0",cursor:"pointer",fontSize:12,display:"flex",justifyContent:"space-between"}},
                        React.createElement("span",null,item.name),React.createElement("span",{style:{color:"#c9a84c",fontWeight:700}},fmt(item.sizes[0].price))
                      )
                      :React.createElement("div",{key:item.id,style:{marginBottom:6}},
                          React.createElement("div",{style:{fontSize:11,color:"#d0d0d0",padding:"3px 8px",fontWeight:600}},item.name),
                          React.createElement("div",{style:{display:"flex",gap:4,flexWrap:"wrap",padding:"2px 4px"}},
                            item.sizes.map(sz=>React.createElement("button",{key:sz.label,onClick:()=>selectCatalogItem(i,item,sz),style:{padding:"5px 10px",background:"rgba(201,168,76,.08)",border:"1px solid rgba(201,168,76,.2)",borderRadius:6,color:"#c9a84c",cursor:"pointer",fontSize:11,fontWeight:600}},`${sz.label} — ${fmt(sz.price)}`))
                          )
                        )
                  ),
                  React.createElement("button",{onClick:()=>{updateService(i,"isCustom",true);setShowSvcPicker(null);},style:{width:"100%",padding:"7px",background:"transparent",border:"1px dashed #5a5a5a",borderRadius:6,color:"#909090",fontSize:11,cursor:"pointer",marginTop:4}},"+ Servicio personalizado")
                )
              )
            ),
            s.name&&React.createElement("div",null,
              (s.includes||[]).slice(0,3).map((inc,j)=>React.createElement("div",{key:j,className:"inc-item"},React.createElement("span",{style:{color:"#c9a84c"}},"✓"),inc)),
              (s.includes||[]).length>3&&React.createElement("div",{style:{fontSize:10,color:"#909090",marginTop:2}},`+${s.includes.length-3} más incluidos`),
              React.createElement("div",{className:"pkg-price-row"},fmt(parseFloat(s.price)||0))
            )
          )
    )),
    React.createElement("button",{className:"add-svc-btn",onClick:addService},"+ Agregar servicio"),

    React.createElement("div",{className:"sec-label"},"Descuentos"),
    React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:10}},
      React.createElement("div",null,React.createElement("label",{className:"field-label"},"Anticipo"),React.createElement("input",{...inp,type:"number",value:anticipo,placeholder:"0",onChange:e=>setAnticipo(e.target.value)})),
      React.createElement("div",null,React.createElement("label",{className:"field-label"},"Descuento adicional"),React.createElement("input",{...inp,type:"number",value:descuento,placeholder:"0",onChange:e=>setDescuento(e.target.value)})),
      React.createElement("div",null,React.createElement("label",{className:"field-label"},"Concepto"),React.createElement("input",{...inp,value:descLabel,onChange:e=>setDescLabel(e.target.value)}))
    ),

    React.createElement("div",{className:"sec-label"},"Notas & Pago"),
    React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:10}},
      React.createElement("div",null,React.createElement("label",{className:"field-label"},"Notas"),React.createElement("textarea",{...inp,value:fields.notas,onChange:e=>f("notas",e.target.value)})),
      React.createElement("div",null,React.createElement("label",{className:"field-label"},"Método de pago"),React.createElement("input",{...inp,value:fields.pago,onChange:e=>f("pago",e.target.value)}))
    ),

    React.createElement("div",{className:"total-box"},
      services.map((s,i)=>{const name=s.isCustom?(s.customName||"Servicio"):s.name+(s.size?` (${s.size})`:"");return React.createElement("div",{key:i,className:"total-row-item"},React.createElement("span",{style:{flex:1,paddingRight:8}},name||"—"),React.createElement("span",{style:{color:"#c9a84c",fontWeight:600,flexShrink:0}},fmt(parseFloat(s.price)||0)));}),
      React.createElement("hr",{className:"total-divider"}),
      parseFloat(anticipo)>0&&React.createElement("div",{className:"total-row-item"},React.createElement("span",null,"Anticipo"),React.createElement("span",{style:{color:"#f87171"}},`− ${fmt(parseFloat(anticipo))}`)),
      parseFloat(descuento)>0&&React.createElement("div",{className:"total-row-item"},React.createElement("span",null,descLabel),React.createElement("span",{style:{color:"#f87171"}},`− ${fmt(parseFloat(descuento))}`)),
      React.createElement("div",{className:"total-final"},React.createElement("span",{className:"total-label"},"TOTAL"),React.createElement("span",{className:"total-amount"},fmt(total)))
    ),

    React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:14}},
      React.createElement("button",{onClick:sendWhatsApp,style:{padding:"14px",background:"#25d366",border:"none",borderRadius:10,color:"#000",fontFamily:"'Barlow',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"}},"💬 WhatsApp"),
      React.createElement("button",{className:"preview-btn",style:{margin:0,padding:"14px",fontSize:13},onClick:()=>setPreview(true)},"👁 Vista Previa")
    ),

    // ── QUOTE PREVIEW ──
    preview&&React.createElement("div",{className:"qpreview-overlay"},
      React.createElement("div",{style:{position:"sticky",top:0,zIndex:500,background:"rgba(10,10,10,.95)",backdropFilter:"blur(8px)",padding:"calc(env(safe-area-inset-top,14px) + 10px) 16px 10px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #2a2a2a"}},
        React.createElement("span",{style:{fontSize:11,letterSpacing:3,color:"#909090",textTransform:"uppercase",fontFamily:"'Barlow',sans-serif"}},"Vista Previa"),
        React.createElement("button",{onClick:()=>setPreview(false),style:{background:"#ef4444",border:"none",borderRadius:20,color:"#fff",padding:"8px 18px",fontFamily:"'Barlow',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer",letterSpacing:.5}},"✕ Cerrar")
      ),
      React.createElement("div",{className:"qpreview-inner"},
        React.createElement("div",{className:"qpreview-bar",style:{display:"none"}}),
        React.createElement(QuoteDocumentWhite,{fields:{...fields,fecha:fmtDateNice(fields.dateKey)},services,anticipo:parseFloat(anticipo)||0,descuento:parseFloat(descuento)||0,descLabel,total}),
        React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:14}},
          React.createElement("button",{className:"close-btn",style:{padding:14,fontSize:13},onClick:()=>{
            const doc=document.getElementById("quote-print");
            if(!doc)return;
            const html=doc.innerHTML;
            const win=window.open("","_blank","width=800,height=900");
            win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">
            <title>Cotización Alpha Detailing</title>
            <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&family=Barlow+Condensed:wght@600;700;800&display=swap" rel="stylesheet">
            <style>
              *{box-sizing:border-box;margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}
              @page{margin:8mm;size:Letter portrait}
              html,body{width:100%;background:#fff;font-family:'Barlow',sans-serif}
              body{padding:0;zoom:0.85}
              #quote-print{border-radius:0!important;box-shadow:none!important;border:none!important;max-width:100%!important}
              @media print{body{zoom:0.85;padding:0}}
            </style></head><body>${doc.outerHTML}</body></html>`);
            win.document.close();
            setTimeout(()=>{win.focus();win.print();},600);
          }},"🖨 Imprimir / PDF"),
          React.createElement("button",{style:{padding:14,borderRadius:10,border:"none",background:"#22c55e",color:"#000",fontFamily:"'Barlow',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"},onClick:saveAndNew},"✓ Guardar")
        )
      )
    )
  );
}

// ── WHITE QUOTE DOCUMENT ──
function QuoteDocumentWhite({fields,services,anticipo,descuento,descLabel,total}){
  const W = {
    doc:{background:"#fff",borderRadius:12,overflow:"hidden",border:"1px solid #e5e7eb",boxShadow:"0 4px 24px rgba(0,0,0,.08)",fontFamily:"'Barlow',sans-serif",color:"#111"},
    header:{background:"#111",padding:"16px 22px",display:"flex",justifyContent:"space-between",alignItems:"flex-start"},
    brand:{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"clamp(22px,5vw,32px)",fontWeight:800,letterSpacing:6,color:"#fff",lineHeight:1},
    brandSub:{fontSize:9,letterSpacing:6,color:"#c9a84c",textTransform:"uppercase",marginTop:3},
    stars:{color:"#c9a84c",fontSize:11,letterSpacing:3,marginTop:6},
    badge:{background:"#c9a84c",color:"#000",fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,letterSpacing:3,padding:"5px 14px",display:"inline-block",marginBottom:8},
    meta:{fontSize:11,color:"#ccc",lineHeight:1.9,textAlign:"right"},
    metaVal:{color:"#fff"},
    info:{display:"grid",gridTemplateColumns:"1fr 1fr",borderBottom:"1px solid #e5e7eb"},
    col:{padding:"12px 18px"},
    sec:{fontSize:9,letterSpacing:3,textTransform:"uppercase",color:"#c9a84c",fontWeight:700,marginBottom:8},
    name:{fontSize:15,fontWeight:700,color:"#111",marginBottom:3},
    detail:{fontSize:12,color:"#555",lineHeight:1.7},
    svcWrap:{padding:"12px 18px",borderBottom:"1px solid #e5e7eb"},
    tblHdr:{display:"flex",justifyContent:"space-between",fontSize:9,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"#888",paddingBottom:10,borderBottom:"1px solid #e5e7eb",marginBottom:4},
    row:{borderBottom:"1px solid #f3f4f6",padding:"8px 0"},
    rowTop:{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4},
    svcName:{fontSize:13,fontWeight:700,color:"#111"},
    svcPrice:{fontSize:13,fontWeight:700,color:"#111",flexShrink:0,marginLeft:12},
    inc:{listStyle:"none",padding:0},
    incItem:{fontSize:11,color:"#666",padding:"2px 0",display:"flex",gap:6},
    disc:{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid #f3f4f6",fontSize:13,color:"#555"},
    totalRow:{display:"flex",justifyContent:"space-between",alignItems:"baseline",paddingTop:10},
    totalLbl:{fontFamily:"'Barlow Condensed',sans-serif",fontSize:17,fontWeight:700,letterSpacing:3,color:"#111"},
    totalAmt:{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:700,color:"#c9a84c"},
    bank:{padding:"12px 18px",background:"#f9fafb",borderBottom:"1px solid #e5e7eb"},
    bankTitle:{fontSize:9,letterSpacing:3,textTransform:"uppercase",color:"#c9a84c",fontWeight:700,marginBottom:10},
    bankGrid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8},
    bankItem:{fontSize:11,color:"#555"},
    bankVal:{fontSize:13,fontWeight:700,color:"#111",marginTop:2},
    notes:{padding:"10px 18px",borderBottom:"1px solid #e5e7eb"},
    notesLbl:{fontSize:9,letterSpacing:3,textTransform:"uppercase",color:"#888",fontWeight:700,marginBottom:5},
    notesTxt:{fontSize:12,color:"#555",lineHeight:1.6},
    footer:{padding:"10px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"#111"},
    footerBrand:{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,letterSpacing:4,color:"#fff"},
    footerThanks:{fontStyle:"italic",fontSize:12,color:"#888"},
  };
  return React.createElement("div",{style:W.doc,id:"quote-print"},
    React.createElement("div",{style:W.header},
      React.createElement("div",null,
        React.createElement("div",{style:W.brand},"ALPHA"),
        React.createElement("div",{style:W.brandSub},"D E T A I L I N G"),
        React.createElement("div",{style:W.stars},"★★★★★")
      ),
      React.createElement("div",{style:{textAlign:"right"}},
        React.createElement("div",null,React.createElement("span",{style:W.badge},"COTIZACIÓN")),
        React.createElement("div",{style:W.meta},"No. ",React.createElement("span",{style:W.metaVal},fields.num)),
        React.createElement("div",{style:W.meta},"Fecha ",React.createElement("span",{style:W.metaVal},fields.fecha))
      )
    ),
    React.createElement("div",{style:W.info},
      React.createElement("div",{style:{...W.col,borderRight:"1px solid #e5e7eb"}},
        React.createElement("div",{style:W.sec},"Cliente"),
        React.createElement("div",{style:W.name},fields.nombre||"—"),
        fields.tel&&React.createElement("div",{style:W.detail},fields.tel),
        fields.dir&&React.createElement("div",{style:W.detail},fields.dir)
      ),
      React.createElement("div",{style:W.col},
        React.createElement("div",{style:W.sec},"Vehículo"),
        React.createElement("div",{style:W.name},fields.modelo||"—"),
        React.createElement("div",{style:W.detail},[fields.año,fields.color].filter(Boolean).join(" · "))
      )
    ),
    React.createElement("div",{style:W.svcWrap},
      React.createElement("div",{style:W.sec},"Servicios Incluidos"),
      React.createElement("div",{style:W.tblHdr},React.createElement("span",null,"Descripción"),React.createElement("span",null,"Precio")),
      ...services.map((s,i)=>{
        const name=s.isCustom?(s.customName||"Servicio"):s.name+(s.size?` (${s.size})`:"");
        const price=parseFloat(s.price)||0;
        const includes=s.includes||[];
        return React.createElement("div",{key:i,style:W.row},
          React.createElement("div",{style:W.rowTop},React.createElement("div",{style:W.svcName},name),React.createElement("div",{style:W.svcPrice},fmt(price))),
          React.createElement("ul",{style:W.inc},includes.map((inc,j)=>React.createElement("li",{key:j,style:W.incItem},React.createElement("span",{style:{color:"#c9a84c",fontSize:10,flexShrink:0,marginTop:1}},"✓"),inc)))
        );
      }),
      anticipo>0&&React.createElement("div",{style:W.disc},React.createElement("span",{style:{fontStyle:"italic"}},"Anticipo recibido"),React.createElement("span",{style:{color:"#ef4444",fontWeight:600}},`− ${fmt(anticipo)}`)),
      descuento>0&&React.createElement("div",{style:W.disc},React.createElement("span",{style:{fontStyle:"italic"}},descLabel),React.createElement("span",{style:{color:"#ef4444",fontWeight:600}},`− ${fmt(descuento)}`)),
      React.createElement("div",{style:W.totalRow},React.createElement("div",{style:W.totalLbl},"TOTAL"),React.createElement("div",{style:W.totalAmt},fmt(total)))
    ),
    // Bank info
    React.createElement("div",{style:W.bank},
      React.createElement("div",{style:W.bankTitle},"Datos de Pago"),
      React.createElement("div",{style:W.bankGrid},
        React.createElement("div",null,React.createElement("div",{style:W.bankItem},"Titular"),React.createElement("div",{style:W.bankVal},ALPHA_OWNER)),
        React.createElement("div",null,React.createElement("div",{style:W.bankItem},"Banco"),React.createElement("div",{style:W.bankVal},ALPHA_BANK)),
        React.createElement("div",{style:{gridColumn:"1/-1"}},React.createElement("div",{style:W.bankItem},"CLABE Interbancaria"),React.createElement("div",{style:{...W.bankVal,fontFamily:"monospace",fontSize:15,letterSpacing:1}},ALPHA_CLABE)),
        React.createElement("div",null,React.createElement("div",{style:W.bankItem},"WhatsApp"),React.createElement("div",{style:W.bankVal},`+52 ${ALPHA_PHONE}`))
      )
    ),
    fields.notas&&React.createElement("div",{style:W.notes},React.createElement("div",{style:W.notesLbl},"Notas"),React.createElement("div",{style:W.notesTxt},fields.notas)),
    fields.pago&&React.createElement("div",{style:W.notes},React.createElement("div",{style:W.notesLbl},"Método de Pago"),React.createElement("div",{style:W.notesTxt},fields.pago)),
    React.createElement("div",{style:W.footer},
      React.createElement("div",{style:W.footerBrand},"ALPHA ",React.createElement("span",{style:{color:"#c9a84c"}},"DETAILING")),
      React.createElement("div",{style:W.footerThanks},"Gracias por su preferencia")
    )
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// VENTAS MODULE
// ══════════════════════════════════════════════════════════════════════════════
function VentasModule({cal}){
  const today=new Date();
  const[year,setYear]=useState(today.getFullYear());
  const[month,setMonth]=useState(today.getMonth()+1);
  const[showReport,setShowReport]=useState(false);
  const[goalInput,setGoalInput]=useState("");
  const[showGoalEdit,setShowGoalEdit]=useState(false);
  const GOAL_KEY="alpha-goal-v1";
  const getGoal=()=>{try{const r=localStorage.getItem(GOAL_KEY);return r?JSON.parse(r):{};}catch(e){return{};}};
  const saveGoal=(y,m,v)=>{try{const g=getGoal();g[`${y}-${m}`]=v;localStorage.setItem(GOAL_KEY,JSON.stringify(g));}catch(e){}};
  const currentGoal=getGoal()[`${year}-${month}`]||0;
  const quotes=loadQuotes();
  const prevY=month===1?year-1:year,prevM=month===1?12:month-1;
  const prevMonth=()=>{if(month===1){setMonth(12);setYear(y=>y-1);}else setMonth(m=>m-1);};
  const nextMonth=()=>{if(month===12){setMonth(1);setYear(y=>y+1);}else setMonth(m=>m+1);};
  const calServicesForMonth=(y,m)=>{const arr=[];for(let d=1;d<=getDaysInMonth(y,m);d++){const data=cal[`${y}-${m}-${d}`];if(data?.type==="worked")arr.push({day:d,...data,serviceNorm:normalizeServiceName(data.service)});}return arr;};
  const calServices=calServicesForMonth(year,month);
  const prevCalServices=calServicesForMonth(prevY,prevM);
  const calTotal=calServices.reduce((acc,s)=>acc+(parseFloat(s.price)||0),0);
  const prevCalTotal=prevCalServices.reduce((acc,s)=>acc+(parseFloat(s.price)||0),0);
  const ticketProm=calServices.length>0?calTotal/calServices.length:0;
  const pctChange=prevCalTotal>0?Math.round(((calTotal-prevCalTotal)/prevCalTotal)*100):null;
  const weeks=[0,0,0,0,0];calServices.forEach(s=>{const w=Math.min(Math.floor((s.day-1)/7),4);weeks[w]+=(parseFloat(s.price)||0);});
  const maxWeek=Math.max(...weeks,1);
  const svcCount={};calServices.forEach(s=>{const k=s.serviceNorm||s.service||"Otro";svcCount[k]=(svcCount[k]||0)+1;});
  const topSvc=Object.entries(svcCount).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const statusCount={};calServices.forEach(s=>{const st=s.status||"confirmed";statusCount[st]=(statusCount[st]||0)+1;});
  const originCount={};calServices.forEach(s=>{if(s.origin)originCount[s.origin]=(originCount[s.origin]||0)+1;});

  const generatePDF=()=>{
    const win=window.open("","_blank");
    const rows=calServices.map(s=>{
      const orig=ORIGINS.find(o=>o.id===s.origin);
      return `<tr><td>${s.day}</td><td>${s.serviceNorm||s.service||"—"}</td><td>${s.vehicle||"—"}</td><td>${s.client||"—"}</td><td>${orig?orig.emoji+" "+orig.label:"—"}</td><td style="text-align:right;font-weight:700;color:#b8860b">${s.price?fmt(parseFloat(s.price)):"—"}</td></tr>`;
    }).join("");
    // Origin breakdown
    const originRows=ORIGINS.map(o=>{
      const svcs=calServices.filter(s=>s.origin===o.id);
      if(!svcs.length) return "";
      const total=svcs.reduce((a,s)=>a+(parseFloat(s.price)||0),0);
      const svcNames=[...new Set(svcs.map(s=>s.serviceNorm||s.service))].join(", ");
      return `<tr><td>${o.emoji} ${o.label}</td><td>${svcs.length}</td><td>${svcNames}</td><td style="text-align:right;font-weight:700;color:#b8860b">${fmt(total)}</td></tr>`;
    }).filter(Boolean).join("");
    const noOrigin=calServices.filter(s=>!s.origin);
    const noOriginRow=noOrigin.length?`<tr><td>— Sin origen</td><td>${noOrigin.length}</td><td>${[...new Set(noOrigin.map(s=>s.serviceNorm||s.service))].join(", ")}</td><td style="text-align:right">${fmt(noOrigin.reduce((a,s)=>a+(parseFloat(s.price)||0),0))}</td></tr>`:"";

    win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Reporte ${MONTHS[month-1]} ${year} — Alpha Detailing</title>
    <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700&family=Barlow+Condensed:wght@700;800&display=swap" rel="stylesheet">
    <style>
      *{box-sizing:border-box;margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}
      @page{margin:10mm;size:Letter}
      body{font-family:'Barlow','Helvetica Neue',sans-serif;background:#fff;color:#111;zoom:0.82}
      .header{background:#111;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;margin-bottom:0}
      .brand{font-family:'Barlow Condensed',sans-serif;font-size:32px;font-weight:800;letter-spacing:6px;color:#fff}
      .brand span{color:#c9a84c}
      .badge{background:#c9a84c;color:#000;font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;padding:5px 14px;display:inline-block;margin-bottom:6px}
      .meta{font-size:11px;color:#ccc;text-align:right;line-height:1.8}
      .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:12px 0}
      .kpi{border:1.5px solid #e5e7eb;border-radius:8px;padding:10px 8px;text-align:center}
      .kpi-val{font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:700;color:#c9a84c}
      .kpi-lbl{font-size:8px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-top:3px}
      .section-title{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#c9a84c;font-weight:700;margin:12px 0 6px;padding-bottom:5px;border-bottom:1.5px solid #e5e7eb}
      table{width:100%;border-collapse:collapse;font-size:11px}
      th{background:#f9fafb;color:#888;text-transform:uppercase;letter-spacing:.5px;font-size:8px;padding:7px 8px;text-align:left;border-bottom:1px solid #e5e7eb}
      td{padding:7px 8px;border-bottom:1px solid #f3f4f6;color:#333}
      tr:nth-child(even) td{background:#fafafa}
      .total-row td{background:#f9fafb;font-weight:700;color:#111;border-top:2px solid #c9a84c}
      .footer{margin-top:16px;display:flex;justify-content:space-between;align-items:center;padding-top:10px;border-top:1px solid #e5e7eb}
      .footer-brand{font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;letter-spacing:4px;color:#111}
      .footer-brand span{color:#c9a84c}
      .footer-note{font-size:9px;color:#aaa;font-style:italic}
    </style></head><body>
    <div class="header">
      <div><div class="brand">ALPHA <span>DETAILING</span></div><div style="font-size:9px;letter-spacing:3px;color:#888;margin-top:3px">REPORTE DE VENTAS</div></div>
      <div><div class="badge">${MONTHS[month-1].toUpperCase()} ${year}</div><div class="meta">Generado: ${new Date().toLocaleDateString("es-MX")}</div></div>
    </div>
    <div style="padding:0 4px">
    <div class="kpis">
      <div class="kpi"><div class="kpi-val">${fmt(calTotal)}</div><div class="kpi-lbl">Total del mes</div></div>
      <div class="kpi"><div class="kpi-val">${calServices.length}</div><div class="kpi-lbl">Servicios</div></div>
      <div class="kpi"><div class="kpi-val">${fmt(ticketProm)}</div><div class="kpi-lbl">Ticket promedio</div></div>
      <div class="kpi"><div class="kpi-val">${pctChange!==null?(pctChange>=0?"↑":"↓")+Math.abs(pctChange)+"%":"—"}</div><div class="kpi-lbl">vs mes anterior</div></div>
    </div>
    <div class="section-title">Origen de clientes</div>
    <table><thead><tr><th>Origen</th><th>Cantidad</th><th>Servicios</th><th style="text-align:right">Total</th></tr></thead>
    <tbody>${originRows}${noOriginRow}<tr class="total-row"><td colspan="3">TOTAL</td><td style="text-align:right;color:#c9a84c">${fmt(calTotal)}</td></tr></tbody></table>
    <div class="section-title">Detalle de servicios</div>
    <table><thead><tr><th>Día</th><th>Servicio</th><th>Vehículo</th><th>Cliente</th><th>Origen</th><th style="text-align:right">Monto</th></tr></thead>
    <tbody>${rows}<tr class="total-row"><td colspan="5">TOTAL</td><td style="text-align:right;color:#c9a84c">${fmt(calTotal)}</td></tr></tbody></table>
    <div class="footer"><div class="footer-brand">ALPHA <span>DETAILING</span></div><div class="footer-note">Reporte interno confidencial</div></div>
    </div></body></html>`);
    win.document.close();setTimeout(()=>win.print(),600);
  };

  return React.createElement("div",{style:{padding:"16px 14px calc(60px + env(safe-area-inset-bottom,0px))",maxWidth:520,margin:"0 auto"}},
    React.createElement("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginBottom:4,marginTop:8}},
      React.createElement("button",{className:"nav-btn",onClick:prevMonth},"‹"),
      React.createElement("div",{className:"month-title",style:{fontSize:"clamp(24px,7vw,42px)",minWidth:180}},`${MONTHS[month-1]} ${year}`),
      React.createElement("button",{className:"nav-btn",onClick:nextMonth},"›")
    ),
    React.createElement("p",{style:{textAlign:"center",fontSize:9,letterSpacing:3,color:"#909090",textTransform:"uppercase",marginBottom:12}},"Control de ventas"),
    // Goal banner
    React.createElement("div",{style:{maxWidth:520,margin:"0 auto 16px",background:"#1c1c1c",border:"1px solid #2a2a2a",borderRadius:12,padding:"12px 16px"}},
      showGoalEdit
        ? React.createElement("div",{style:{display:"flex",gap:8,alignItems:"center"}},
            React.createElement("span",{style:{fontSize:12,color:"#909090",flexShrink:0}},"Meta $"),
            React.createElement("input",{className:"inp",type:"number",value:goalInput,placeholder:"Ej. 150000",style:{flex:1},onChange:e=>setGoalInput(e.target.value)}),
            React.createElement("button",{onClick:()=>{saveGoal(year,month,parseFloat(goalInput)||0);setShowGoalEdit(false);},style:{padding:"8px 14px",background:"#c9a84c",border:"none",borderRadius:8,color:"#000",fontWeight:700,fontSize:12,cursor:"pointer",flexShrink:0}},"✓"),
            React.createElement("button",{onClick:()=>setShowGoalEdit(false),style:{padding:"8px 10px",background:"transparent",border:"1px solid #333",borderRadius:8,color:"#888",fontSize:12,cursor:"pointer",flexShrink:0}},"✕")
          )
        : React.createElement("div",null,
            React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:currentGoal>0?8:0}},
              React.createElement("div",{style:{fontSize:10,color:"#909090",letterSpacing:2,textTransform:"uppercase"}},currentGoal>0?"Meta del mes":"Sin meta definida"),
              React.createElement("button",{onClick:()=>{setGoalInput(String(currentGoal||""));setShowGoalEdit(true);},style:{fontSize:11,color:"#c9a84c",background:"none",border:"none",cursor:"pointer",padding:0}},currentGoal>0?"✏️ Editar":"+ Fijar meta")
            ),
            currentGoal>0&&React.createElement("div",null,
              React.createElement("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:6}},
                React.createElement("span",{style:{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:calTotal>=currentGoal?"#22c55e":"#c9a84c"}},fmt(calTotal)),
                React.createElement("span",{style:{fontSize:12,color:"#909090"}},`de ${fmt(currentGoal)}`)
              ),
              React.createElement("div",{style:{height:8,background:"#2a2a2a",borderRadius:4,overflow:"hidden"}},
                React.createElement("div",{style:{height:"100%",width:`${Math.min((calTotal/currentGoal)*100,100)}%`,background:calTotal>=currentGoal?"linear-gradient(90deg,#22c55e,#16a34a)":"linear-gradient(90deg,#c9a84c,#e0bb6e)",borderRadius:4,transition:"width .5s"}})
              ),
              React.createElement("div",{style:{fontSize:10,color:"#909090",marginTop:5,textAlign:"right"}},
                calTotal>=currentGoal
                  ? "🎉 ¡Meta alcanzada!"
                  : `Faltan ${fmt(currentGoal-calTotal)} · ${Math.round((calTotal/currentGoal)*100)}%`
              )
            )
          )
    ),
    React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}},
      React.createElement("div",{className:"stat-card",style:{padding:"14px 12px",gridColumn:"1/-1"}},
        React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"}},
          React.createElement("div",null,React.createElement("div",{style:{fontSize:9,color:"#909090",letterSpacing:2,textTransform:"uppercase",marginBottom:4}},"Total del mes"),React.createElement("div",{style:{fontFamily:"'Barlow Condensed',sans-serif",fontSize:32,fontWeight:700,color:"#c9a84c"}},fmt(calTotal))),
          pctChange!==null&&React.createElement("div",{style:{textAlign:"right"}},React.createElement("div",{style:{fontSize:20,fontWeight:700,color:pctChange>=0?"#22c55e":"#ef4444"}},(pctChange>=0?"↑":"↓")+Math.abs(pctChange)+"%"),React.createElement("div",{style:{fontSize:10,color:"#909090"}},`vs ${MONTHS_SHORT[prevM-1]}`))
        )
      ),
      React.createElement("div",{className:"stat-card",style:{padding:"12px"}},React.createElement("div",{style:{fontSize:9,color:"#909090",letterSpacing:1,textTransform:"uppercase",marginBottom:4}},"Servicios"),React.createElement("div",{style:{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:700,color:"#c9a84c"}},calServices.length)),
      React.createElement("div",{className:"stat-card",style:{padding:"12px"}},React.createElement("div",{style:{fontSize:9,color:"#909090",letterSpacing:1,textTransform:"uppercase",marginBottom:4}},"Ticket promedio"),React.createElement("div",{style:{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:700,color:"#c9a84c"}},fmt(ticketProm)))
    ),
    calTotal>0&&React.createElement("div",{className:"stat-card",style:{padding:"14px 12px",marginBottom:14}},
      React.createElement("div",{style:{fontSize:9,color:"#909090",letterSpacing:2,textTransform:"uppercase",marginBottom:12}},"Ingresos por semana"),
      React.createElement("div",{style:{display:"flex",gap:6,alignItems:"flex-end",height:80}},
        weeks.map((w,i)=>{const pct=Math.max((w/maxWeek)*100,4);return React.createElement("div",{key:i,style:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}},w>0&&React.createElement("div",{style:{fontSize:9,color:"#c9a84c",fontWeight:700}},w>=1000?(w/1000).toFixed(1)+"k":w),React.createElement("div",{style:{width:"100%",height:`${pct}%`,background:w>0?"linear-gradient(180deg,#e0bb6e,#c9a84c)":"#222",borderRadius:"4px 4px 0 0",minHeight:4}}),React.createElement("div",{style:{fontSize:8,color:"#909090"}},`S${i+1}`));})
      )
    ),
    // Origins breakdown
    Object.keys(originCount).length>0&&React.createElement("div",{className:"stat-card",style:{padding:"14px 12px",marginBottom:14}},
      React.createElement("div",{style:{fontSize:9,color:"#909090",letterSpacing:2,textTransform:"uppercase",marginBottom:12}},"Origen de clientes"),
      React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:8}},
        ORIGINS.map(o=>{
          const count=originCount[o.id]||0;if(!count)return null;
          const pct=Math.round((count/calServices.length)*100);
          return React.createElement("div",{key:o.id,style:{display:"flex",alignItems:"center",gap:10}},
            React.createElement("span",{style:{fontSize:14,minWidth:22}},o.emoji),
            React.createElement("div",{style:{flex:1}},
              React.createElement("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:4}},React.createElement("span",{style:{fontSize:12,color:"#d0d0d0",fontWeight:600}},o.label),React.createElement("span",{style:{fontSize:12,color:o.color,fontWeight:700}},`${count} · ${pct}%`)),
              React.createElement("div",{style:{height:5,background:"#2a2a2a",borderRadius:3,overflow:"hidden"}},React.createElement("div",{style:{height:"100%",width:pct+"%",background:o.color,borderRadius:3}}))
            )
          );
        }),
        calServices.filter(s=>!s.origin).length>0&&React.createElement("div",{style:{display:"flex",alignItems:"center",gap:10}},
          React.createElement("span",{style:{fontSize:14,minWidth:22}},"—"),
          React.createElement("div",{style:{flex:1,display:"flex",justifyContent:"space-between"}},React.createElement("span",{style:{fontSize:12,color:"#909090"}},"Sin origen"),React.createElement("span",{style:{fontSize:12,color:"#909090",fontWeight:700}},calServices.filter(s=>!s.origin).length))
        )
      )
    ),
    topSvc.length>0&&React.createElement("div",{className:"stat-card",style:{padding:"14px 12px",marginBottom:14}},
      React.createElement("div",{style:{fontSize:9,color:"#909090",letterSpacing:2,textTransform:"uppercase",marginBottom:10}},"Servicios más vendidos"),
      topSvc.map(([name,count],i)=>React.createElement("div",{key:i,style:{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:i<topSvc.length-1?"1px solid #222":"none"}},React.createElement("div",{style:{fontSize:12,color:"#d0d0d0",flex:1,paddingRight:8}},name),React.createElement("div",{style:{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,color:"#c9a84c"}},count,"x")))
    ),
    calServices.length>0&&React.createElement("div",null,
      React.createElement("div",{className:"sec-label",style:{marginTop:0}},"Detalle de servicios"),
      React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:8}},
        calServices.map((s,i)=>{const stObj=SERVICE_STATUSES.find(st=>st.id===s.status);return React.createElement("div",{key:i,style:{background:"#1c1c1c",border:"1px solid #2a2a2a",borderRadius:10,padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}},React.createElement("div",null,React.createElement("div",{style:{fontSize:11,color:"#909090",marginBottom:3}},`Día ${s.day}${s.client?" · "+s.client:""}`),React.createElement("div",{style:{fontSize:13,fontWeight:600,color:"#d0d0d0"}},s.serviceNorm||s.service||"Servicio"),s.vehicle&&React.createElement("div",{style:{fontSize:11,color:"#7dd3fc",marginTop:2}},s.vehicle),stObj&&React.createElement("div",{style:{fontSize:10,color:stObj.color,marginTop:3,fontWeight:700}},`${stObj.emoji} ${stObj.label}`)),React.createElement("div",{style:{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:s.price?"#c9a84c":"#909090",flexShrink:0}},s.price?fmt(parseFloat(s.price)):"—"));})
      )
    ),
    calServices.length===0&&React.createElement("div",{style:{textAlign:"center",padding:"40px 0",color:"#909090"}},React.createElement("div",{style:{fontSize:32,marginBottom:12}},"📊"),React.createElement("div",{style:{fontSize:14}},"Sin datos este mes")),
    calServices.length>0&&React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:16}},
      React.createElement("button",{onClick:()=>setShowReport(true),style:{padding:"13px",background:"#1c1c1c",border:"1px solid #2a2a2a",borderRadius:10,color:"#d0d0d0",fontFamily:"'Barlow',sans-serif",fontSize:13,fontWeight:600,cursor:"pointer"}},"📊 Ver reporte"),
      React.createElement("button",{onClick:generatePDF,style:{padding:"13px",background:"#1c1c1c",border:"1px solid #c9a84c",borderRadius:10,color:"#c9a84c",fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,letterSpacing:1,textTransform:"uppercase",cursor:"pointer"}},"📄 PDF")
    ),
    // Full report overlay with back button
    showReport&&React.createElement("div",{style:{position:"fixed",inset:0,background:"#0e0e0e",zIndex:400,overflowY:"auto"}},
      React.createElement("div",{style:{position:"sticky",top:0,zIndex:10,background:"rgba(14,14,14,.95)",backdropFilter:"blur(8px)",padding:"calc(env(safe-area-inset-top,14px) + 10px) 16px 10px",display:"flex",alignItems:"center",gap:12,borderBottom:"1px solid #222"}},
        React.createElement("button",{onClick:()=>setShowReport(false),style:{background:"none",border:"1px solid #333",borderRadius:8,color:"#d0d0d0",padding:"7px 14px",cursor:"pointer",fontSize:13,fontFamily:"'Barlow',sans-serif"}},"← Volver"),
        React.createElement("span",{style:{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,letterSpacing:3,color:"#c9a84c"}},"REPORTE "+MONTHS[month-1].toUpperCase()+" "+year),
        React.createElement("button",{onClick:generatePDF,style:{marginLeft:"auto",background:"#c9a84c",border:"none",borderRadius:8,color:"#000",padding:"7px 14px",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"'Barlow',sans-serif"}},"📄 PDF")
      ),
      React.createElement("div",{style:{padding:"16px 14px calc(60px + env(safe-area-inset-bottom,0px))",maxWidth:520,margin:"0 auto"}},
        // KPIs
        React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:16}},
          [{v:fmt(calTotal),l:"Total"},{v:calServices.length,l:"Servicios"},{v:fmt(ticketProm),l:"Ticket prom."}].map(({v,l})=>
            React.createElement("div",{key:l,className:"stat-card",style:{padding:"10px 8px",textAlign:"center"}},
              React.createElement("div",{style:{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:"#c9a84c"}},v),
              React.createElement("div",{style:{fontSize:9,color:"#909090",textTransform:"uppercase",letterSpacing:1,marginTop:2}},l)
            )
          )
        ),
        // Origin breakdown with services
        React.createElement("div",{style:{fontSize:10,color:"#c9a84c",letterSpacing:2,textTransform:"uppercase",fontWeight:700,marginBottom:10}},"Por origen de cliente"),
        React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:8,marginBottom:20}},
          [...ORIGINS.map(o=>{
            const svcs=calServices.filter(s=>s.origin===o.id);
            if(!svcs.length) return null;
            const total=svcs.reduce((a,s)=>a+(parseFloat(s.price)||0),0);
            return React.createElement("div",{key:o.id,style:{background:"#1c1c1c",border:`1px solid ${o.color}44`,borderRadius:10,padding:"12px 14px"}},
              React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}},
                React.createElement("div",{style:{display:"flex",alignItems:"center",gap:6}},
                  React.createElement("span",{style:{fontSize:16}},o.emoji),
                  React.createElement("span",{style:{fontSize:13,fontWeight:700,color:o.color}},o.label)
                ),
                React.createElement("div",{style:{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:o.color}},fmt(total))
              ),
              svcs.map((s,i)=>React.createElement("div",{key:i,style:{display:"flex",justifyContent:"space-between",fontSize:11,color:"#888",padding:"3px 0",borderTop:"1px solid #2a2a2a"}},
                React.createElement("span",null,`Día ${s.day} · ${s.serviceNorm||s.service||"—"}${s.vehicle?" · "+s.vehicle:""}`),
                React.createElement("span",{style:{color:"#d0d0d0",fontWeight:600,flexShrink:0,marginLeft:8}},s.price?fmt(parseFloat(s.price)):"—")
              ))
            );
          }).filter(Boolean),
          calServices.filter(s=>!s.origin).length>0&&React.createElement("div",{key:"none",style:{background:"#1c1c1c",border:"1px solid #2a2a2a",borderRadius:10,padding:"12px 14px"}},
            React.createElement("div",{style:{fontSize:13,fontWeight:700,color:"#909090",marginBottom:8}},"— Sin origen registrado"),
            calServices.filter(s=>!s.origin).map((s,i)=>React.createElement("div",{key:i,style:{display:"flex",justifyContent:"space-between",fontSize:11,color:"#888",padding:"3px 0",borderTop:"1px solid #2a2a2a"}},
              React.createElement("span",null,`Día ${s.day} · ${s.serviceNorm||s.service||"—"}`),
              React.createElement("span",{style:{color:"#d0d0d0",fontWeight:600,flexShrink:0,marginLeft:8}},s.price?fmt(parseFloat(s.price)):"—")
            ))
          )]
        ),
        // Services detail
        React.createElement("div",{style:{fontSize:10,color:"#c9a84c",letterSpacing:2,textTransform:"uppercase",fontWeight:700,marginBottom:10}},"Detalle de servicios"),
        React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:6}},
          calServices.map((s,i)=>{
            const stObj=SERVICE_STATUSES.find(st=>st.id===s.status);
            const origObj=ORIGINS.find(o=>o.id===s.origin);
            return React.createElement("div",{key:i,style:{background:"#1c1c1c",border:"1px solid #2a2a2a",borderRadius:8,padding:"10px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}},
              React.createElement("div",null,
                React.createElement("div",{style:{fontSize:10,color:"#909090",marginBottom:2}},`Día ${s.day}${s.client?" · "+s.client:""}${origObj?" · "+origObj.emoji+origObj.label:""}`),
                React.createElement("div",{style:{fontSize:12,fontWeight:600,color:"#d0d0d0"}},s.serviceNorm||s.service||"—"),
                s.vehicle&&React.createElement("div",{style:{fontSize:10,color:"#7dd3fc"}},s.vehicle),
                stObj&&React.createElement("div",{style:{fontSize:10,color:stObj.color,fontWeight:700}},stObj.emoji+" "+stObj.label)
              ),
              React.createElement("div",{style:{fontFamily:"'Barlow Condensed',sans-serif",fontSize:17,fontWeight:700,color:s.price?"#c9a84c":"#909090",flexShrink:0}},s.price?fmt(parseFloat(s.price)):"—")
            );
          })
        )
      )
    )
  );
}

// ── PIN + MOUNT ──
const CORRECT_PIN="1234",PIN_SESSION_KEY="alpha-pin-ok";
function PinScreen({onUnlock}){
  const[pin,setPin]=useState("");const[shake,setShake]=useState(false);const[hint,setHint]=useState("");
  const handleDigit=d=>{if(pin.length>=4)return;const next=pin+d;setPin(next);if(next.length===4){if(next===CORRECT_PIN){try{sessionStorage.setItem(PIN_SESSION_KEY,"1");}catch(e){}onUnlock();}else{setShake(true);setHint("PIN incorrecto");setTimeout(()=>{setPin("");setShake(false);setHint("");},700);}}};
  const handleDel=()=>setPin(p=>p.slice(0,-1));
  const dots=[0,1,2,3].map(i=>React.createElement("div",{key:i,style:{width:14,height:14,borderRadius:"50%",background:i<pin.length?"#c9a84c":"transparent",border:"2px solid "+(i<pin.length?"#c9a84c":"#444"),transition:"all .15s"}}));
  const keys=[["1","2","3"],["4","5","6"],["7","8","9"],["","0","⌫"]];
  return React.createElement("div",{style:{minHeight:"100vh",background:"#0e0e0e",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"calc(env(safe-area-inset-top,20px) + 20px) 16px calc(env(safe-area-inset-bottom,0px) + 40px)"}},
    React.createElement("div",{style:{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"clamp(36px,10vw,56px)",fontWeight:800,letterSpacing:10,color:"#fff",lineHeight:1}},"ALPHA"),
    React.createElement("div",{style:{fontSize:12,letterSpacing:7,color:"#c9a84c",fontWeight:700,textTransform:"uppercase",marginBottom:48}},"D E T A I L I N G"),
    React.createElement("div",{style:{fontSize:13,letterSpacing:2,color:"#606060",textTransform:"uppercase",marginBottom:24}},"Ingresa tu PIN"),
    React.createElement("div",{style:{display:"flex",gap:16,marginBottom:8,animation:shake?"shake .35s ease":"none"}},dots),
    React.createElement("div",{style:{fontSize:12,color:"#ef4444",height:18,marginBottom:24,letterSpacing:1}},hint),
    React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,width:"100%",maxWidth:280}},
      keys.flat().map((k,i)=>{if(k==="")return React.createElement("div",{key:i});return React.createElement("button",{key:i,onClick:()=>k==="⌫"?handleDel():handleDigit(k),style:{padding:"18px 0",borderRadius:14,background:k==="⌫"?"transparent":"#1c1c1c",border:k==="⌫"?"none":"1px solid #2a2a2a",color:k==="⌫"?"#606060":"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontSize:k==="⌫"?22:26,fontWeight:700,cursor:"pointer",WebkitTapHighlightColor:"transparent"}},k);})
    )
  );
}
function Root(){const[unlocked,setUnlocked]=useState(()=>{try{return sessionStorage.getItem(PIN_SESSION_KEY)==="1";}catch(e){return false;}});if(!unlocked)return React.createElement(PinScreen,{onUnlock:()=>setUnlocked(true)});return React.createElement(App);}
const root=ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(Root));
