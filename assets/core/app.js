
import * as employees from "../modules/employees.js";
import * as departments from "../modules/departments.js";
import * as attendance from "../modules/attendance.js";
import * as leave from "../modules/leave.js";
import * as recruitment from "../modules/recruitment.js";
import * as payroll from "../modules/payroll.js";
import * as invoices from "../modules/invoices.js";
import * as expenses from "../modules/expenses.js";
import * as accounts from "../modules/accounts.js";
import * as products from "../modules/products.js";
import * as warehouses from "../modules/warehouses.js";
import * as stock from "../modules/stock.js";
import * as suppliers from "../modules/suppliers.js";
import * as purchase_orders from "../modules/purchase_orders.js";
import * as customers from "../modules/customers.js";
import * as leads from "../modules/leads.js";
import * as opportunities from "../modules/opportunities.js";
import * as projects from "../modules/projects.js";
import * as tasks from "../modules/tasks.js";
import * as documents from "../modules/documents.js";
import * as approvals from "../modules/approvals.js";
import * as tickets from "../modules/tickets.js";
import * as assets from "../modules/assets.js";
import * as sales_orders from "../modules/sales_orders.js";
import * as reports from "../modules/reports.js";
import * as users from "../modules/users.js";
import * as roles from "../modules/roles.js";
import * as notifications from "../modules/notifications.js";
import * as audits from "../modules/audits.js";
const MODULES={"employees":employees,
"departments":departments,
"attendance":attendance,
"leave":leave,
"recruitment":recruitment,
"payroll":payroll,
"invoices":invoices,
"expenses":expenses,
"accounts":accounts,
"products":products,
"warehouses":warehouses,
"stock":stock,
"suppliers":suppliers,
"purchase_orders":purchase_orders,
"customers":customers,
"leads":leads,
"opportunities":opportunities,
"projects":projects,
"tasks":tasks,
"documents":documents,
"approvals":approvals,
"tickets":tickets,
"assets":assets,
"sales_orders":sales_orders,
"reports":reports,
"users":users,
"roles":roles,
"notifications":notifications,
"audits":audits};
const GROUPS=[...new Set(Object.values(MODULES).map(m=>m.moduleGroup))];
const state={route:"dashboard",query:"",page:1,pageSize:8,records:{}};
Object.entries(MODULES).forEach(([k,m])=>{state.records[k]=JSON.parse(localStorage.getItem("nexora:"+k)||JSON.stringify(m.seedRecords))});
const $=s=>document.querySelector(s);
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function save(k){localStorage.setItem("nexora:"+k,JSON.stringify(state.records[k]))}
function toast(t){const n=document.createElement("div");n.className="toast";n.textContent=t;document.body.appendChild(n);setTimeout(()=>n.remove(),2000)}
function shell(){let nav=GROUPS.map(g=>`<div class="nav-section">${esc(g)}</div>`+Object.entries(MODULES).filter(([,m])=>m.moduleGroup===g).map(([k,m])=>`<button class="${state.route===k?"active":""}" data-route="${k}">▸ ${esc(m.moduleTitle)}</button>`).join("")).join("");document.querySelector("#app").innerHTML=`<div class="layout"><aside class="sidebar"><div class="brand"><b>◆ NEXORA</b><small>Enterprise ERP Suite</small></div><nav class="nav"><button class="${state.route==="dashboard"?"active":""}" data-route="dashboard">▦ Dashboard</button>${nav}</nav></aside><main class="main"><header class="topbar"><input id="globalSearch" class="search" placeholder="Search records..." value="${esc(state.query)}"><div class="user"><span class="muted">Administrator</span><span class="avatar">NS</span></div></header><section class="content" id="view"></section></main></div>`;document.querySelectorAll("[data-route]").forEach(b=>b.onclick=()=>{state.route=b.dataset.route;state.query="";state.page=1;render()});$("#globalSearch").oninput=e=>{state.query=e.target.value;state.page=1;view()}}
function dashboard(){let total=Object.values(state.records).reduce((a,r)=>a+r.length,0);let top=Object.entries(state.records).sort((a,b)=>b[1].length-a[1].length).slice(0,7).map(([k,r])=>`<div class="list-item"><span>${esc(MODULES[k].moduleTitle)}</span><b>${r.length}</b></div>`).join("");let bars=[35,52,44,68,61,80,72,90,76,94].map((n,i)=>`<div class="bar" style="height:${n}%"><span>${i+1}</span></div>`).join("");return`<div class="page-head"><div><h1>Executive Dashboard</h1><p>Unified enterprise operations workspace.</p></div><div class="actions"><button class="btn" data-act="backup">Export Backup</button><button class="btn primary" data-act="quick">+ Quick Add</button></div></div><div class="cards"><div class="card"><span class="muted">Total Records</span><div class="metric">${total}</div><span class="trend">↑ 12.4%</span></div><div class="card"><span class="muted">ERP Modules</span><div class="metric">${Object.keys(MODULES).length}</div><span class="muted">Integrated</span></div><div class="card"><span class="muted">System Health</span><div class="metric">99.9%</div><span class="trend">Operational</span></div><div class="card"><span class="muted">Automation</span><div class="metric">86%</div><span class="trend">↑ 8.7%</span></div></div><div class="grid2"><div class="panel"><div class="panel-head"><b>Business Activity</b><span class="muted">Recent periods</span></div><div class="chart">${bars}</div></div><div class="panel"><div class="panel-head"><b>Module Usage</b></div><div class="panel-body list">${top}</div></div></div>`}
function moduleView(k){let m=MODULES[k],rows=state.records[k].filter(r=>!state.query||m.searchableText(r).includes(state.query.toLowerCase()));let pages=Math.max(1,Math.ceil(rows.length/state.pageSize));state.page=Math.min(state.page,pages);let start=(state.page-1)*state.pageSize,vis=rows.slice(start,start+state.pageSize);let heads=m.fields.map(f=>`<th data-sort="${esc(f)}">${esc(f)} ↕</th>`).join("");let body=vis.length?vis.map(r=>{let idx=state.records[k].indexOf(r);return`<tr>${m.fields.map(f=>`<td>${f.toLowerCase()==="status"?`<span class="status">${esc(r[f])}</span>`:esc(r[f])}</td>`).join("")}<td><button class="btn" data-edit="${idx}">Edit</button> <button class="btn danger" data-del="${idx}">Delete</button></td></tr>`}).join(""):`<tr><td colspan="${m.fields.length+1}" class="empty">No records found.</td></tr>`;return`<div class="page-head"><div><h1>${esc(m.moduleTitle)}</h1><p>${esc(m.moduleGroup)} · ${rows.length} records</p></div><div class="actions"><button class="btn" data-act="export">Export CSV</button><button class="btn" data-act="refresh">Refresh</button><button class="btn primary" data-act="create">+ Add</button></div></div><div class="panel"><div class="toolbar"><div class="toolbar-left"><input id="moduleSearch" class="input" placeholder="Filter..." value="${esc(state.query)}"><select id="pageSize" class="input"><option>8</option><option>15</option><option>30</option><option>50</option></select></div><div class="toolbar-right"><button class="btn" data-act="settings">⚙ Settings</button></div></div><div class="table-wrap"><table class="table"><thead><tr>${heads}<th>Actions</th></tr></thead><tbody>${body}</tbody></table></div><div class="pagination"><span>Showing ${rows.length?start+1:0}–${Math.min(start+vis.length,rows.length)} of ${rows.length}</span><div class="actions"><button class="btn" data-page="-1">Previous</button><span>Page ${state.page} / ${pages}</span><button class="btn" data-page="1">Next</button></div></div></div>`}
function view(){$("#view").innerHTML=state.route==="dashboard"?dashboard():moduleView(state.route);bind()}
function render(){shell();view()}
function bind(){let q=$("#moduleSearch");if(q)q.oninput=e=>{state.query=e.target.value;state.page=1;view()};let ps=$("#pageSize");if(ps)ps.onchange=e=>{state.pageSize=+e.target.value;state.page=1;view()};document.querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>form(state.route,+b.dataset.edit));document.querySelectorAll("[data-del]").forEach(b=>b.onclick=()=>del(state.route,+b.dataset.del));document.querySelectorAll("[data-page]").forEach(b=>b.onclick=()=>{state.page+=+b.dataset.page;view()});document.querySelectorAll("[data-act]").forEach(b=>b.onclick=()=>action(b.dataset.act))}
function action(a){if(a==="create")form(state.route);else if(a==="export")csv(state.route);else if(a==="backup")backup();else if(a==="refresh"){toast("Data refreshed");view()}else if(a==="quick"){let k=prompt("Enter module key: "+Object.keys(MODULES).join(", "));if(MODULES[k])form(k)}else if(a==="settings")toast("Module settings are ready for backend configuration.")}
function form(k,index=null){let m=MODULES[k],r=index===null?m.createDefaultRecord(state.records[k].length+1):{...state.records[k][index]};let fs=m.fields.map((f,i)=>{let opts=m.getFieldOptions(f);return`<div class="field"><label>${esc(f)} ${i===0?"*":""}</label>${opts.length?`<select name="${esc(f)}">${opts.map(o=>`<option ${r[f]===o?"selected":""}>${o}</option>`).join("")}</select>`:`<input name="${esc(f)}" value="${esc(r[f])}">`}</div>`}).join("");let b=document.createElement("div");b.className="modal-backdrop";b.innerHTML=`<div class="modal"><div class="modal-head"><b>${index===null?"Create":"Edit"} ${esc(m.moduleTitle)}</b><button class="btn" id="x">✕</button></div><form><div class="modal-body"><div class="form-grid">${fs}</div></div><div class="modal-foot"><button type="button" class="btn" id="c">Cancel</button><button class="btn primary">Save Changes</button></div></form></div>`;document.body.appendChild(b);b.querySelector("#x").onclick=b.querySelector("#c").onclick=()=>b.remove();b.querySelector("form").onsubmit=e=>{e.preventDefault();let fd=new FormData(e.target),n={};m.fields.forEach(f=>n[f]=fd.get(f)||"");let er=m.validateRecord(n);if(Object.keys(er).length)return toast(Object.values(er)[0]);if(index===null)state.records[k].unshift(m.normalizeRecord(n));else state.records[k][index]=m.normalizeRecord(n);save(k);b.remove();view();toast(index===null?"Record created":"Record updated")}}
function del(k,i){if(confirm("Delete this record?")){state.records[k].splice(i,1);save(k);view();toast("Record deleted")}}
function csv(k){let m=MODULES[k],rows=[m.fields.join(",")].concat(state.records[k].map(r=>m.fields.map(f=>`"${String(r[f]??"").replaceAll('"','""')}"`).join(",")));let blob=new Blob([rows.join("\n")],{type:"text/csv"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=k+"-export.csv";a.click();toast("CSV exported")}
function backup(){let blob=new Blob([JSON.stringify(state.records,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="nexora-erp-backup.json";a.click();toast("Backup exported")}
render();
// Dashboard enhancement notes
