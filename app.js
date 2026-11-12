const STORAGE_KEY = "project-becoming-masterpiece-v1";
const START_DATE = "2026-11-12";
const goals = [
  ["Spiritual grounding","Spend time in Scripture and prayer."],
  ["Academic excellence","Complete a focused academic revision session."],
  ["Intellectual expansion","Read for at least 30 minutes or study a substantial article."],
  ["Main development lesson","Complete today's personal-development lesson."],
  ["Practical application","Apply one idea through a small, real-world exercise."],
  ["Communication practice","Practise writing, speaking or explaining an idea clearly."],
  ["Daily reflection","Review the day and set tomorrow's priorities."]
];
const pillars = [
  ["Intellectual development","Read widely, question assumptions and think critically."],
  ["Discipline and consistency","Build reliable routines and follow through."],
  ["Spiritual growth","Grow in Scripture, prayer, wisdom and character."],
  ["Emotional intelligence","Develop self-awareness, empathy and self-regulation."],
  ["Communication","Practise clear writing, speaking and listening."],
  ["Financial intelligence","Learn budgeting, saving and responsible decision-making."],
  ["Leadership and entrepreneurship","Solve problems, serve others and develop ideas."],
  ["Academic excellence","Strengthen subject knowledge and learning skills."]
];
const morning = ["Cleanse face","Apply facial moisturiser","Apply broad-spectrum sunscreen"];
const evening = ["Cleanse face","Apply facial moisturiser","Apply Vaseline Cocoa Glow to body after bathing"];
const products = [
  ["Vaseline Cocoa Glow body lotion","Owned"],
  ["O'malyn SPF 95+ sunscreen","Owned"],
  ["Simple Refreshing Facial Wash","To purchase"],
  ["Simple Hydrating Light Moisturiser","To purchase"],
  ["Salicylic acid 2% (optional, later)","Optional"],
  ["Hyaluronic acid serum (optional, later)","Optional"],
  ["Micellar water (optional, later)","Optional"]
];
const $ = id => document.getElementById(id);
function localDateKey(d=new Date()){const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,"0"),day=String(d.getDate()).padStart(2,"0");return `${y}-${m}-${day}`;}
function load(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY))||{};}catch{return {};}}
let data=load();
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(data));}
function ensureDay(){const today=localDateKey();if(!data.days)data.days={};if(!data.days[today])data.days[today]={goals:Array(goals.length).fill(false),morning:Array(morning.length).fill(false),evening:Array(evening.length).fill(false)};if(!data.productStatus)data.productStatus=[true,true,...Array(products.length-2).fill(false)];return data.days[today];}
function dayNumber(){const a=new Date(START_DATE+"T00:00:00"),b=new Date();return Math.max(1,Math.min(90,Math.floor((new Date(b.getFullYear(),b.getMonth(),b.getDate())-a)/86400000)+1));}
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200);}
function renderChecks(container,items,key){const day=ensureDay();$(container).innerHTML=items.map((item,i)=>`<label class="check-row ${day[key][i]?"done":""}"><input type="checkbox" data-key="${key}" data-index="${i}" ${day[key][i]?"checked":""}><span>${item}</span></label>`).join("");}
function render(){const day=ensureDay();const done=day.goals.filter(Boolean).length,pct=Math.round(done/goals.length*100);$("overallBar").style.width=pct+"%";$("overallPercent").textContent=pct+"%";$("dayCount").textContent=`DAY ${dayNumber()} OF 90`;const now=new Date();$("dateText").textContent=now.toLocaleDateString(undefined,{weekday:"long",day:"numeric",month:"long",year:"numeric"});$("todayLabel").textContent=done===goals.length?"ALL DAILY GOALS COMPLETED":"YOUR DAILY RESET";
$("dailyGoals").innerHTML=goals.map(([name,desc],i)=>`<label class="goal ${day.goals[i]?"done":""}"><input type="checkbox" data-key="goals" data-index="${i}" ${day.goals[i]?"checked":""}><span><strong>${name}</strong><small>${desc}</small></span></label>`).join("");
$("pillars").innerHTML=pillars.map(([name,desc],i)=>`<div class="pillar"><b>${String(i+1).padStart(2,"0")} · ${name}</b><p>${desc}</p></div>`).join("");
renderChecks("morningSkin",morning,"morning");renderChecks("eveningSkin",evening,"evening");$("products").innerHTML=products.map(([n,status],i)=>`<label class="check-row ${data.productStatus[i]?"done":""}"><input type="checkbox" data-key="productStatus" data-index="${i}" ${data.productStatus[i]?"checked":""}><span>${n} — ${status}</span></label>`).join("");renderHistory();}
function renderHistory(){const entries=data.journals||{};const keys=Object.keys(entries).sort().reverse().slice(0,7);$("journalHistory").innerHTML=keys.length?keys.map(k=>`<div class="history-entry"><b>${new Date(k+"T00:00:00").toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"})} · ${entries[k].rating||"—"}/10</b><p>${escapeHtml(entries[k].reflection||entries[k].achievement||"Reflection saved.")}</p></div>`).join(""):'<p class="muted small">No reflections saved yet. Your first entry can start today.</p>';}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
document.addEventListener("change",e=>{const el=e.target;if(el.matches('input[type="checkbox"][data-key]')){const d=ensureDay(),k=el.dataset.key,i=Number(el.dataset.index);if(k==="productStatus"){data.productStatus[i]=el.checked;}else{d[k][i]=el.checked;}save();render();}});
document.querySelectorAll(".tab").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x===btn));document.querySelectorAll(".panel").forEach(x=>x.classList.toggle("active",x.id===btn.dataset.tab));window.scrollTo({top:0,behavior:"smooth"});}));
$("goJournal").onclick=()=>document.querySelector('[data-tab="journal"]').click();
$("resetDayBtn").onclick=()=>{if(confirm("Refresh today's checklist? This clears only today's checked goals and skincare ticks. Your journal and previous dates stay saved.")){data.days[localDateKey()]={goals:Array(goals.length).fill(false),morning:Array(morning.length).fill(false),evening:Array(evening.length).fill(false),products:Array(products.length).fill(false)};save();render();toast("Today's checklist has been refreshed.");}};
$("rating").oninput=()=> $("ratingValue").textContent=$("rating").value;
$("saveJournal").onclick=()=>{if(!data.journals)data.journals={};data.journals[localDateKey()]={reflection:$("reflection").value,achievement:$("achievement").value,challenge:$("challenge").value,tomorrow:$("tomorrow").value,rating:$("rating").value};save();renderHistory();$("journalStatus").textContent="Saved for today ✓";toast("Your reflection is saved.");};
$("saveLearning").onclick=()=>{if(!data.learning)data.learning={};data.learning[localDateKey()]=$("learningNote").value;save();$("learningStatus").textContent="Learning note saved ✓";toast("Learning note saved.");};
$("exportBtn").onclick=()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="project-becoming-backup-"+localDateKey()+".json";a.click();URL.revokeObjectURL(a.href);};
$("importFile").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const imported=JSON.parse(await f.text());if(!imported||typeof imported!=="object")throw Error();if(confirm("Import this backup? It will replace the current app data on this device.")){data=imported;save();render();toast("Backup imported.");}}catch{alert("That backup file could not be read.");}e.target.value="";};
$("clearBtn").onclick=()=>{if(confirm("This permanently clears all Project: Becoming data stored in this browser. Export a backup first if you want to keep it.")){localStorage.removeItem(STORAGE_KEY);data={};render();toast("App data cleared.");}};
if("serviceWorker" in navigator && location.protocol!=="file:"){window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));}
let deferredPrompt=null;window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;$("installBtn").classList.remove("hidden");});$("installBtn").onclick=async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$("installBtn").classList.add("hidden");};
const savedJournal=data.journals?.[localDateKey()];if(savedJournal){$("reflection").value=savedJournal.reflection||"";$("achievement").value=savedJournal.achievement||"";$("challenge").value=savedJournal.challenge||"";$("tomorrow").value=savedJournal.tomorrow||"";$("rating").value=savedJournal.rating||7;$("ratingValue").textContent=$("rating").value;}
$("learningNote").value=data.learning?.[localDateKey()]||"";
render();
