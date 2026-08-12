// Shared state helpers for the FUSIONX registration flow.
// Only Team ID, User Role, and Last Visited Page are stored in browser localStorage.

function genId(prefix){
  const t = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return prefix + t.slice(-6) + r;
}

function encodeState(state){
  return encodeURIComponent(JSON.stringify(state));
}

function decodeState(){
  const params = new URLSearchParams(window.location.search);
  const s = params.get('s');
  if(!s) return null;
  try { return JSON.parse(decodeURIComponent(s)); }
  catch(e){ return null; }
}

function getStoredTeamId(){
  const params = new URLSearchParams(window.location.search);
  return params.get('teamId') || localStorage.getItem('gcc_team_id');
}

function storeTeamId(id){
  if(id){
    localStorage.setItem('gcc_team_id', id);
  }
}

function getStoredRole(){
  return localStorage.getItem('gcc_user_role') || 'LEADER';
}

function storeRole(role){
  if(role){
    localStorage.setItem('gcc_user_role', role);
  }
}

function trackPage(pageName){
  if(pageName){
    localStorage.setItem('gcc_last_page', pageName);
  }
}

function getStoredLastPage(){
  return localStorage.getItem('gcc_last_page') || 'status.html';
}

function saveSession(data){
  if(!data) return;
  const tid = data.teamId || data.backendTeamId;
  if(tid){
    localStorage.setItem('gcc_team_id', tid);
  }
  if(data.role){
    localStorage.setItem('gcc_user_role', data.role);
  }
  if(data.lastVisitedPage){
    localStorage.setItem('gcc_last_page', data.lastVisitedPage);
  }
  localStorage.removeItem('gcc_team_state');
  localStorage.removeItem('gcc_member_token');
  localStorage.removeItem('gcc_passwords');
  localStorage.removeItem('gcc_otp');
}

function getSession(){
  const teamId = getStoredTeamId();
  const role = getStoredRole();
  const lastVisitedPage = getStoredLastPage();
  return { teamId, role, lastVisitedPage };
}

function clearSession(){
  localStorage.removeItem('gcc_team_id');
  localStorage.removeItem('gcc_user_role');
  localStorage.removeItem('gcc_last_page');
  localStorage.removeItem('gcc_team_state');
  localStorage.removeItem('gcc_member_token');
}

function goTo(page, state){
  const tid = state ? (state.teamId || state.backendTeamId) : null;
  if(tid){
    saveSession({ teamId: tid, lastVisitedPage: page });
  } else {
    trackPage(page);
  }
  window.location.href = page + (tid ? '?teamId=' + tid : '');
}

function fmtRupees(n){
  return '₹' + Number(n).toLocaleString('en-IN');
}

function formatTimeAgo(timestamp) {
  if (!timestamp || timestamp <= 0) return '—';
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 10) return 'Just now';
  if (seconds < 60) return `${seconds} Seconds Ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} Minute${minutes > 1 ? 's' : ''} Ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} Hour${hours > 1 ? 's' : ''} Ago`;
  const days = Math.floor(hours / 24);
  return `${days} Day${days > 1 ? 's' : ''} Ago`;
}

// Requirement 6: Professional Registration Progress Generator
function renderVisualProgress(membersList, totalSize) {
  const members = membersList || [];
  const total = Math.max(totalSize || 1, 1);
  const joinedCount = members.filter(m => m.joined).length;
  const pct = Math.round((joinedCount / total) * 100);
  const pendingCount = total - joinedCount;
  const blocksCount = 10;
  const filledBlocks = Math.round((joinedCount / total) * blocksCount);
  const emptyBlocks = blocksCount - filledBlocks;
  const barStr = '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);
  const isComplete = (pendingCount === 0);

  let tagsHtml = '';
  members.forEach((m, idx) => {
    const isLead = (idx === 0);
    let statusText = isLead ? 'Completed' : (m.joined ? 'Joined' : 'Invitation Sent');
    let color = isLead ? 'var(--orange-dark, #FF5A36)' : (m.joined ? '#1C9A5B' : '#64748b');
    let mName = m.name || m.email || (isLead ? 'Leader' : 'Member ' + (idx+1));
    tagsHtml += `<span style="font-family:'JetBrains Mono',monospace; font-size:11px; padding:3px 8px; border-radius:4px; background:#fff; border:1px solid var(--line, #e2e8f0); color:${color}; font-weight:600;">${mName}: ${statusText}</span> `;
  });

  return {
    pct: pct,
    barStr: barStr,
    textStatus: isComplete ? 'Payment Unlocked' : `Waiting for ${pendingCount} Member${pendingCount > 1 ? 's' : ''}`,
    joinedStr: `${joinedCount} / ${total} Members Joined`,
    html: `
      <div class="registration-progress-block" style="background:var(--grey-050, #f8fafc); border:1px solid var(--line-strong, #cbd5e1); border-radius:12px; padding:18px; margin-bottom:20px; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="font-family:'JetBrains Mono',monospace; font-size:12px; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-muted, #64748b); font-weight:700;">Registration Progress</span>
          <span style="font-family:'JetBrains Mono',monospace; font-size:14px; font-weight:800; color:${isComplete ? '#1C9A5B' : '#FF5A36'};">${pct}%</span>
        </div>
        <div style="font-family:'JetBrains Mono',monospace; font-size:20px; letter-spacing:2px; color:${isComplete ? '#1C9A5B' : '#FF5A36'}; margin:6px 0 10px 0; word-break:break-all;">
          ${barStr} <span style="font-size:14px; letter-spacing:0; color:var(--ink, #0D1013); font-weight:700;">${joinedCount} / ${total} Members Joined</span>
        </div>
        <div style="margin-bottom:10px; display:flex; flex-wrap:wrap; gap:6px;">
          ${tagsHtml}
        </div>
        <div style="font-size:12px; color:var(--text-muted, #64748b); font-weight:500;">
          ${isComplete ? '✓ All members joined — Payment will unlock automatically after all members join.' : `Payment will unlock automatically after all members join.`}
        </div>
      </div>
    `
  };
}

// Converts a team object into normalized frontend structure
function normalizeTeamState(team){
  if (!team) return null;
  const members = (team.members || []).map((m, i) => ({
    id: m.id,
    token: m.token,
    name: m.name || '',
    email: m.email || '',
    phone: m.phone || '',
    dept: m.department || m.dept || '',
    year: m.year || '',
    role: m.role || (i === 0 ? 'Lead' : 'Member'),
    joined: !!m.joined,
    invitedAt: m.invitedAt,
    joinedAt: m.joinedAt
  }));

  const allJoined = (typeof team.allMembersJoined === 'boolean') 
    ? team.allMembersJoined 
    : (members.length >= (team.teamSize || 1) && members.every(m => m.joined));

  return {
    regId: team.regId || '',
    teamName: team.teamName || '',
    college: team.college || '',
    theme: team.theme || '',
    problem: team.problemStatement || team.problem || '',
    teamSize: team.teamSize || members.length || 1,
    members: members,
    amount: team.amount || (team.teamSize * 500),
    paid: !!team.paid,
    allMembersJoined: allJoined,
    teamId: team.id || team.teamId || team.backendTeamId
  };
}

// Guard: checks for teamId in URL or localStorage; redirects to fallback ONLY if teamId is missing
function requireState(fallback){
  const storedTeamId = getStoredTeamId();

  if (storedTeamId) {
    storeTeamId(storedTeamId);
    return {
      teamId: storedTeamId,
      regId: 'GCC...',
      teamName: 'Team',
      college: '',
      theme: '',
      problem: '',
      teamSize: 1,
      members: [],
      amount: 0,
      payment: null
    };
  }

  const urlState = decodeState();
  if (urlState && (urlState.teamId || urlState.backendTeamId)) {
    const tid = urlState.teamId || urlState.backendTeamId;
    storeTeamId(tid);
    return urlState;
  }

  window.location.href = fallback || 'register.html';
  return null;
}

