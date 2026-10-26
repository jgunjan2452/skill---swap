// Skill Swap: Supabase powers real accounts and private conversations. Without configuration,
// the public directory stays browseable in demo mode and account actions explain the setup.
const SAMPLE_PROFILES = [
  { id: 'demo-maya', display_name: 'Maya Patel', location: 'Bengaluru', region: 'Bengaluru', meetup_preference: 'Both', bio: 'Frontend developer who loves turning ideas into small, useful products.', teach_skills: [{ name: 'React', level: 'Intermediate', category: 'Frontend' }, { name: 'Figma', level: 'Beginner', category: 'Design' }], learn_skills: [{ name: 'Python', level: 'Beginner', category: 'Backend' }, { name: 'Docker', level: 'Beginner', category: 'DevOps' }], learning_goal: 'Build a project', learning_style: 'Pair programming', languages: ['English', 'Hindi'], availability: 'Weeknights', timezone: 'Asia/Kolkata', experience_level: 'Intermediate', beginner_friendly: true, structured_learning: false, pair_programming: true, is_public: true, avatar_url: '', demo: true },
  { id: 'demo-arjun', display_name: 'Arjun Mehta', location: 'Mumbai', region: 'Mumbai', meetup_preference: 'Online', bio: 'Backend engineer. Happy to help with APIs, databases, and getting started with code.', teach_skills: [{ name: 'Python', level: 'Advanced', category: 'Backend' }, { name: 'PostgreSQL', level: 'Intermediate', category: 'Data' }], learn_skills: [{ name: 'React', level: 'Intermediate', category: 'Frontend' }, { name: 'AWS', level: 'Beginner', category: 'Cloud' }], learning_goal: 'Career switch', learning_style: 'Project-based', languages: ['English'], availability: 'Weekend mornings', timezone: 'Asia/Kolkata', experience_level: 'Advanced', beginner_friendly: true, structured_learning: true, pair_programming: false, is_public: true, avatar_url: '', demo: true },
  { id: 'demo-zoya', display_name: 'Zoya Khan', location: 'Delhi', region: 'Delhi NCR', meetup_preference: 'Both', bio: 'Data analyst exploring machine learning. Let’s learn by building something real.', teach_skills: [{ name: 'SQL', level: 'Advanced', category: 'Data' }, { name: 'Data analysis', level: 'Intermediate', category: 'Data' }], learn_skills: [{ name: 'Machine learning', level: 'Beginner', category: 'Data' }, { name: 'Git', level: 'Beginner', category: 'DevOps' }], learning_goal: 'Learn fundamentals', learning_style: 'Concepts explained', languages: ['English', 'Urdu'], availability: 'Weekends', timezone: 'Asia/Kolkata', experience_level: 'Intermediate', beginner_friendly: true, structured_learning: true, pair_programming: false, is_public: true, avatar_url: '', demo: true },
  { id: 'demo-kabir', display_name: 'Kabir Rao', location: 'Pune', region: 'Pune', meetup_preference: 'In person', bio: 'I teach JavaScript and Git to beginners. Currently learning cloud deployment.', teach_skills: [{ name: 'JavaScript', level: 'Advanced', category: 'Frontend' }, { name: 'Git', level: 'Intermediate', category: 'DevOps' }], learn_skills: [{ name: 'AWS', level: 'Beginner', category: 'Cloud' }, { name: 'Docker', level: 'Beginner', category: 'DevOps' }], learning_goal: 'Interview preparation', learning_style: 'Structured lessons', languages: ['English', 'Hindi', 'Marathi'], availability: 'Weekdays after 6pm', timezone: 'Asia/Kolkata', experience_level: 'Advanced', beginner_friendly: true, structured_learning: true, pair_programming: true, is_public: true, avatar_url: '', demo: true },
  { id: 'demo-ananya', display_name: 'Ananya Das', location: 'Kolkata', region: 'Kolkata', meetup_preference: 'Online', bio: 'Mobile developer who enjoys thoughtful code reviews and accessible interfaces.', teach_skills: [{ name: 'Kotlin', level: 'Intermediate', category: 'Mobile' }, { name: 'Accessibility', level: 'Intermediate', category: 'Design' }], learn_skills: [{ name: 'TypeScript', level: 'Beginner', category: 'Frontend' }, { name: 'System design', level: 'Beginner', category: 'Career' }], learning_goal: 'Build a project', learning_style: 'Code review', languages: ['English', 'Bengali'], availability: 'Flexible evenings', timezone: 'Asia/Kolkata', experience_level: 'Intermediate', beginner_friendly: false, structured_learning: false, pair_programming: true, is_public: true, avatar_url: '', demo: true },
  { id: 'demo-dev', display_name: 'Dev Shah', location: 'Ahmedabad', region: 'Ahmedabad', meetup_preference: 'Both', bio: 'Full-stack developer. I like debugging together and making complex topics simple.', teach_skills: [{ name: 'Node.js', level: 'Advanced', category: 'Backend' }, { name: 'MongoDB', level: 'Intermediate', category: 'Data' }], learn_skills: [{ name: 'UI/UX', level: 'Beginner', category: 'Design' }, { name: 'Java', level: 'Beginner', category: 'Backend' }], learning_goal: 'Career switch', learning_style: 'Pair programming', languages: ['English', 'Hindi', 'Gujarati'], availability: 'Saturday afternoons', timezone: 'Asia/Kolkata', experience_level: 'Advanced', beginner_friendly: true, structured_learning: false, pair_programming: true, is_public: true, avatar_url: '', demo: true }
];

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const SKILL_LIST = ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js', 'Python', 'Java', 'C#', 'PHP', 'APIs', 'SQL', 'PostgreSQL', 'MongoDB', 'Data analysis', 'Machine learning', 'Git', 'GitHub', 'Linux', 'Docker', 'AWS', 'Azure', 'CI/CD', 'Android', 'Kotlin', 'Swift', 'React Native', 'Flutter', 'UI/UX', 'Figma', 'Accessibility', 'DSA', 'Interview preparation', 'System design', 'Resume/portfolio review'];
const CATEGORY_BY_SKILL = new Map(Object.entries({ Frontend: ['HTML','CSS','JavaScript','TypeScript','React','Vue','Angular'], Backend: ['Node.js','Python','Java','C#','PHP','APIs'], Data: ['SQL','PostgreSQL','MongoDB','Data analysis','Machine learning'], 'DevOps / Cloud': ['Git','GitHub','Linux','Docker','AWS','Azure','CI/CD'], Mobile: ['Android','Kotlin','Swift','React Native','Flutter'], Design: ['UI/UX','Figma','Accessibility'], Career: ['DSA','Interview preparation','System design','Resume/portfolio review'] }).flatMap(([category, skills]) => skills.map(skill => [skill.toLowerCase(), category])));

let client = null;
let currentUser = null;
let ownProfile = null;
let directory = [...SAMPLE_PROFILES];
let communityData = { notes: [], ideas: [], practiceDates: [], noteReactions: [], ideaVotes: [] };
let currentChat = null;
let realtimeChannel = null;
let authMode = 'signin';
let toastTimer = null;
let pendingInviteId = new URL(location.href).searchParams.get('invite') || localStorage.getItem('skillswap-pending-invite');

function setMessage(element, message, type = '') { element.textContent = message; element.className = `form-message${type ? ` ${type}` : ''}`; }
function showToast(message) { const toast = $('#toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 3300); }
function setBanner(message, state = 'demo') { $('#mode-message').textContent = message; $('#mode-banner').className = `mode-banner ${state}`; }
function safeText(value) { return typeof value === 'string' ? value.trim() : ''; }
function escapeInitials(name = '') { return name.trim().split(/\s+/).slice(0,2).map(word => word[0] || '').join('').toUpperCase() || '?'; }
function splitList(value) { return [...new Set(String(value || '').split(',').map(item => item.trim()).filter(Boolean))].slice(0, 12); }
function parseSkills(value, defaultLevel) {
  return splitList(value).map(raw => {
    const match = raw.match(/^(.*?)\s*\((Beginner|Intermediate|Advanced)\)$/i);
    const name = (match ? match[1] : raw).trim();
    const level = match ? match[2][0].toUpperCase() + match[2].slice(1).toLowerCase() : defaultLevel;
    return { name, level, category: CATEGORY_BY_SKILL.get(name.toLowerCase()) || 'Other' };
  }).filter(skill => skill.name.length > 0);
}
function skillNames(items = []) { return Array.isArray(items) ? items.map(skill => typeof skill === 'string' ? skill : skill?.name).filter(Boolean) : []; }
function normalizeProfile(row) {
  return { ...row, teach_skills: Array.isArray(row.teach_skills) ? row.teach_skills : [], learn_skills: Array.isArray(row.learn_skills) ? row.learn_skills : [], languages: Array.isArray(row.languages) ? row.languages : [] };
}
function localModeMessage() { return 'Demo mode · sample profiles are examples. Configure Supabase to create accounts, share profiles, send requests, and chat.'; }
function openDialog(id) { const dialog = document.getElementById(id); if (dialog && !dialog.open) dialog.showModal(); }
function closeDialog(dialog) { if (dialog?.open) dialog.close(); }

async function setupBackend() {
  try {
    const config = await import('./config.js');
    if (!config.SUPABASE_URL || !config.SUPABASE_ANON_KEY || config.SUPABASE_URL.includes('YOUR_PROJECT') || config.SUPABASE_ANON_KEY.includes('YOUR_PUBLIC')) throw new Error('not configured');
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    client = createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
    const { data: { session } } = await client.auth.getSession();
    currentUser = session?.user || null;
    client.auth.onAuthStateChange((event, sessionNow) => {
      currentUser = sessionNow?.user || null;
      if (event === 'PASSWORD_RECOVERY') { window.setTimeout(() => { setAuthMode('update'); openDialog('auth-dialog'); }, 0); return; }
      window.setTimeout(() => handleAuthChange(), 0);
    });
    setBanner('Live mode · Supabase accounts, profiles and private chat are connected.', 'live');
    await handleAuthChange();
    await loadDirectory();
  } catch (error) {
    client = null;
    currentUser = null;
    setBanner(localModeMessage(), 'demo');
    renderDirectory(SAMPLE_PROFILES);
  }
}

async function handleAuthChange() {
  $('#auth-button').textContent = currentUser ? 'Sign out' : 'Sign in ↗';
  if (!currentUser) {
    ownProfile = null;
    directory = [...SAMPLE_PROFILES];
    renderDirectory(directory);
    await loadCommunityData();
    return;
  }
  await loadOwnProfile();
  await loadDirectory();
  await loadCommunityData();
  if (!ownProfile) {
    showToast('Welcome! Add your skills to finish your profile.');
    openProfileEditor(true);
  }
  await handleInvite();
}

async function loadOwnProfile() {
  if (!client || !currentUser) return;
  const { data, error } = await client.from('profiles').select('*').eq('id', currentUser.id).maybeSingle();
  if (error) { showToast('Could not load your profile. Check the connection and try again.'); return; }
  ownProfile = data ? normalizeProfile(data) : null;
}

async function loadDirectory() {
  if (!client) return;
  $('#directory-state').hidden = false;
  $('#directory-state').textContent = 'Loading skill partners…';
  try {
    const { data, error } = await client.from('profiles').select('id,display_name,location,region,bio,avatar_url,teach_skills,learn_skills,learning_goal,learning_style,languages,availability,timezone,meetup_preference,experience_level,beginner_friendly,structured_learning,pair_programming,weekly_time,is_public').eq('is_public', true).order('created_at', { ascending: false }).limit(100);
    if (error) throw error;
    directory = (data || []).map(normalizeProfile).filter(profile => profile.id !== currentUser?.id);
    renderDirectory(directory);
  } catch (error) {
    $('#directory-state').hidden = false;
    $('#directory-state').textContent = `Couldn't load the live directory. ${error.message || 'Check your connection and try again.'}`;
    const retry = document.createElement('button'); retry.type = 'button'; retry.className = 'button button-outline'; retry.textContent = 'Try again'; retry.addEventListener('click', loadDirectory); $('#directory-state').append(' ', retry);
    $('#profile-grid').replaceChildren();
  }
}

function skillOptions(selector, options) {
  const select = $(selector); const selected = select.value; const first = select.options[0]; select.replaceChildren(first);
  options.forEach(value => { const option = document.createElement('option'); option.value = value; option.textContent = value; select.append(option); });
  if (options.includes(selected)) select.value = selected;
}
function allSkillNames(key) { return [...new Set(directory.flatMap(profile => skillNames(profile[key])))].sort((a,b) => a.localeCompare(b)); }
function profileValues(key) { return [...new Set(directory.flatMap(profile => Array.isArray(profile[key]) ? profile[key] : [profile[key]]).map(value => typeof value === 'string' ? value.trim() : '').filter(Boolean))].sort((a,b) => a.localeCompare(b)); }
function applyFilterChoices() {
  skillOptions('#learn-filter', allSkillNames('learn_skills')); skillOptions('#teach-filter', allSkillNames('teach_skills'));
  [['#goal-filter','learning_goal'],['#style-filter','learning_style'],['#language-filter','languages'],['#availability-filter','availability'],['#timezone-filter','timezone'],['#region-filter','region']].forEach(([selector,key]) => skillOptions(selector, profileValues(key)));
}
function profileMatches(profile) {
  const query = $('#search-input').value.trim().toLocaleLowerCase();
  const searchable = [profile.display_name, profile.location, profile.region, profile.bio, profile.learning_goal, profile.learning_style, profile.availability, profile.timezone, ...(profile.languages || []), ...skillNames(profile.teach_skills), ...skillNames(profile.learn_skills)].join(' ').toLocaleLowerCase();
  const teach = profile.teach_skills || []; const learn = profile.learn_skills || [];
  const selectedLearn = $('#learn-filter').value; const selectedTeach = $('#teach-filter').value; const level = $('#level-filter').value; const mode = $('#mode-filter').value;
  const modeMatch = !mode || profile.meetup_preference === mode || profile.meetup_preference === 'Both';
  const levelMatch = !level || [...teach, ...learn].some(item => item.level === level);
  const exactFilters = [['#goal-filter',profile.learning_goal],['#style-filter',profile.learning_style],['#availability-filter',profile.availability],['#timezone-filter',profile.timezone],['#region-filter',profile.region],['#weekly-filter',profile.weekly_time]];
  const fieldsMatch = exactFilters.every(([selector,value]) => !$(selector).value || value === $(selector).value);
  const preferenceFilters = [['#beginner-filter',profile.beginner_friendly],['#structured-filter',profile.structured_learning],['#pair-filter',profile.pair_programming]];
  const preferencesMatch = preferenceFilters.every(([selector,value]) => !$(selector).value || value === ($(selector).value === 'true'));
  const language = $('#language-filter').value;
  return (!query || searchable.includes(query)) && (!selectedLearn || skillNames(learn).some(name => name.toLowerCase() === selectedLearn.toLowerCase())) && (!selectedTeach || skillNames(teach).some(name => name.toLowerCase() === selectedTeach.toLowerCase())) && (!language || (profile.languages || []).includes(language)) && fieldsMatch && preferencesMatch && levelMatch && modeMatch;
}
function matchingReasons(profile) {
  if (!ownProfile || profile.id === ownProfile.id || profile.demo) return [];
  const mineTeach = skillNames(ownProfile.teach_skills).map(s => s.toLowerCase()); const mineLearn = skillNames(ownProfile.learn_skills).map(s => s.toLowerCase());
  const theirTeach = skillNames(profile.teach_skills).map(s => s.toLowerCase()); const theirLearn = skillNames(profile.learn_skills).map(s => s.toLowerCase());
  const reasons = [];
  if (mineTeach.some(s => theirLearn.includes(s)) && mineLearn.some(s => theirTeach.includes(s))) reasons.push('Two-way skill match');
  else if (mineTeach.some(s => theirLearn.includes(s)) || mineLearn.some(s => theirTeach.includes(s))) reasons.push('Skill match');
  if (ownProfile.learning_style && ownProfile.learning_style === profile.learning_style) reasons.push('Same learning style');
  if (ownProfile.availability && profile.availability && ownProfile.availability.trim().toLowerCase() === profile.availability.trim().toLowerCase()) reasons.push('Schedule overlap');
  else if (ownProfile.timezone && ownProfile.timezone === profile.timezone) reasons.push('Same timezone');
  return reasons;
}
function addChip(parent, text, variant = '') { const chip = document.createElement('span'); chip.className = `skill-chip ${variant}`.trim(); chip.textContent = text; parent.append(chip); }
function createCard(profile) {
  const card = document.createElement('article'); card.className = 'profile-card';
  const top = document.createElement('div'); top.className = 'card-top';
  const avatar = document.createElement('div'); avatar.className = 'profile-avatar'; avatar.textContent = escapeInitials(profile.display_name);
  if (profile.avatar_url) { const image = document.createElement('img'); image.src = profile.avatar_url; image.alt = ''; image.referrerPolicy = 'no-referrer'; image.addEventListener('error', () => avatar.replaceChildren(document.createTextNode(escapeInitials(profile.display_name))), { once: true }); avatar.replaceChildren(image); }
  const meta = document.createElement('div'); meta.className = 'person-meta'; const name = document.createElement('h3'); name.textContent = profile.display_name; const location = document.createElement('p'); location.textContent = profile.location || 'Location not shared'; meta.append(name, location); const mode = document.createElement('span'); mode.className = 'mode-badge'; mode.textContent = profile.meetup_preference || 'Online'; top.append(avatar, meta, mode); card.append(top);
  const reasons = matchingReasons(profile); if (reasons.length) { const reasonRow = document.createElement('div'); reasonRow.className = 'reason-row'; reasons.forEach(reason => addChip(reasonRow, reason, 'reason-chip')); card.append(reasonRow); }
  const bio = document.createElement('p'); bio.className = 'card-bio'; bio.textContent = profile.bio; card.append(bio);
  const teachTitle = document.createElement('div'); teachTitle.className = 'skill-label'; teachTitle.textContent = 'CAN TEACH'; const teachRow = document.createElement('div'); teachRow.className = 'skill-row'; (profile.teach_skills || []).forEach(skill => { const item = typeof skill === 'string' ? { name: skill } : skill; addChip(teachRow, item.level ? `${item.name} · ${item.level}` : item.name); }); card.append(teachTitle, teachRow);
  const learnTitle = document.createElement('div'); learnTitle.className = 'skill-label'; learnTitle.textContent = 'WANTS TO LEARN'; const learnRow = document.createElement('div'); learnRow.className = 'skill-row'; (profile.learn_skills || []).forEach(skill => { const item = typeof skill === 'string' ? { name: skill } : skill; addChip(learnRow, item.level ? `${item.name} · ${item.level}` : item.name, 'learn-chip'); }); card.append(learnTitle, learnRow);
  const info = document.createElement('div'); info.className = 'profile-extra'; const infoItems = [profile.learning_goal, profile.learning_style, ...(profile.languages || []).slice(0,2), profile.availability].filter(Boolean).slice(0,4); infoItems.forEach(item => { const span = document.createElement('span'); span.textContent = item; info.append(span); }); card.append(info);
  const bottom = document.createElement('div'); bottom.className = 'card-bottom'; const label = document.createElement('span'); label.className = 'card-location'; label.textContent = profile.region ? `⌖ ${profile.region}` : '⌖ Flexible location'; const actions = document.createElement('div'); actions.className = 'card-actions';
  if (!profile.demo && currentUser && profile.id !== currentUser.id) { const block = document.createElement('button'); block.type = 'button'; block.className = 'quiet-action'; block.textContent = 'Block'; block.addEventListener('click', () => blockProfile(profile)); actions.append(block); }
  const connect = document.createElement('button'); connect.type = 'button'; connect.className = 'connect-button'; connect.textContent = profile.demo ? 'Demo profile' : currentUser ? 'Send swap request ↗' : 'Sign in to connect ↗'; connect.disabled = Boolean(profile.demo); connect.addEventListener('click', () => currentUser ? openRequest(profile) : openAuth()); actions.append(connect); bottom.append(label, actions); card.append(bottom); return card;
}
function renderDirectory(source = directory) {
  directory = source; applyFilterChoices();
  const visible = source.filter(profileMatches); const fragment = document.createDocumentFragment(); visible.forEach(profile => fragment.append(createCard(profile))); $('#profile-grid').replaceChildren(fragment);
  $('#empty-state').hidden = visible.length > 0; $('#directory-state').hidden = true;
  const count = $('#results-count'); count.replaceChildren(); const bold = document.createElement('strong'); bold.textContent = String(visible.length); count.append(bold, document.createTextNode(` ${visible.length === 1 ? 'skill partner' : 'skill partners'}${source.some(p => p.demo) ? ' · sample directory' : ''}`));
}
function clearFilters() { $('#filter-form').reset(); ['#goal-filter','#style-filter','#language-filter','#availability-filter','#timezone-filter','#region-filter','#beginner-filter','#structured-filter','#pair-filter','#weekly-filter'].forEach(selector => $(selector).value = ''); renderDirectory(directory); $('#search-input').focus(); }
function profileSkillText(skills) { return (skills || []).map(item => typeof item === 'string' ? item : `${item.name}${item.level ? ` (${item.level})` : ''}`).join(', '); }
function openProfileEditor(isNew = false) {
  if (!client || !currentUser) { openAuth(); return; }
  const form = $('#profile-form'); const p = ownProfile || {};
  form.elements.display_name.value = p.display_name || '';
  form.elements.location.value = p.location || '';
  form.elements.bio.value = p.bio || '';
  form.elements.avatar_url.value = p.avatar_url || '';
  form.elements.meetup_preference.value = p.meetup_preference || 'Online';
  form.elements.teach_skills.value = profileSkillText(p.teach_skills);
  form.elements.learn_skills.value = profileSkillText(p.learn_skills);
  form.elements.learning_goal.value = p.learning_goal || 'Build a project';
  form.elements.learning_style.value = p.learning_style || 'Project-based';
  form.elements.languages.value = (p.languages || []).join(', ');
  form.elements.availability.value = p.availability || '';
  form.elements.timezone.value = p.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  form.elements.weekly_time.value = p.weekly_time || '';
  form.elements.experience_level.value = p.experience_level || 'Beginner';
  form.elements.region.value = p.region || '';
  form.elements.is_public.value = String(p.is_public ?? true);
  form.elements.beginner_friendly.checked = Boolean(p.beginner_friendly);
  form.elements.structured_learning.checked = Boolean(p.structured_learning);
  form.elements.pair_programming.checked = Boolean(p.pair_programming);
  setMessage($('#profile-message'), '');
  $('#profile-dialog-title').firstChild.textContent = isNew || !ownProfile ? 'Build your skill ' : 'Update your skill ';
  openDialog('profile-dialog');
}
function renderOwnProfile() {
  const area = $('#profile-editor-area'); area.replaceChildren();
  if (!ownProfile) { const note = document.createElement('p'); note.className = 'state-panel'; note.textContent = 'Add your profile to start swapping skills.'; area.append(note); }
  else { const card = document.createElement('div'); card.className = 'dashboard-panel profile-summary'; const name = document.createElement('h3'); name.textContent = ownProfile.display_name; const email = document.createElement('p'); email.textContent = currentUser?.email || 'Signed in'; const visibility = document.createElement('p'); visibility.textContent = `Visibility: ${ownProfile.is_public ? 'Public directory' : 'Private'}`; card.append(name, email, visibility); area.append(card); }
  const actions = document.createElement('div'); actions.className = 'profile-tools'; const edit = document.createElement('button'); edit.className = 'button button-dark'; edit.type = 'button'; edit.textContent = ownProfile ? 'Edit profile' : 'Create profile'; edit.addEventListener('click', () => openProfileEditor(!ownProfile)); const invite = document.createElement('button'); invite.className = 'button button-outline'; invite.type = 'button'; invite.textContent = 'Invite a friend ↗'; invite.disabled = !ownProfile?.is_public; invite.title = ownProfile?.is_public ? 'Share a profile invite link' : 'Make your profile public before sharing an invite'; invite.addEventListener('click', shareInvite); const remove = document.createElement('button'); remove.className = 'button button-outline danger-button'; remove.type = 'button'; remove.textContent = 'Delete account'; remove.addEventListener('click', deleteAccount); actions.append(edit, invite, remove); area.append(actions);
}
function toggleView(name) {
  ['explore','connections','my-profile','chat-section'].forEach(id => { const node = document.getElementById(id); node.hidden = (name === 'profile' ? id !== 'my-profile' : name === 'chat' ? id !== 'chat-section' : id !== name); });
  if (name === 'connections') loadConnections(); if (name === 'profile') renderOwnProfile();
  const section = document.getElementById(name === 'profile' ? 'my-profile' : name === 'chat' ? 'chat-section' : name); section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
async function openRequest(profile) {
  if (!client || !currentUser || !ownProfile) { if (!ownProfile) showToast('Please complete your profile before sending a swap request.'); else openAuth(); return; }
  $('#request-person').textContent = `Request a swap with ${profile.display_name}. You can suggest a skill exchange and introduce yourself.`;
  const form = $('#request-form'); form.reset(); form.elements.recipient_id.value = profile.id; setMessage($('#request-message'), ''); openDialog('request-dialog');
}
async function sendRequest(event) {
  event.preventDefault(); const form = event.currentTarget; const recipient = form.elements.recipient_id.value;
  const proposal = safeText(form.elements.proposal.value); const introduction = safeText(form.elements.introduction.value);
  if (!proposal || proposal.length > 500) return setMessage($('#request-message'), 'Please enter a short skill-exchange proposal (up to 500 characters).', 'error');
  const button = form.querySelector('[type="submit"]'); button.disabled = true;
  let result;
  try { result = await client.from('swap_requests').insert({ sender_id: currentUser.id, recipient_id: recipient, proposal, introduction: introduction || null, status: 'pending' }); }
  catch (error) { button.disabled = false; return setMessage($('#request-message'), `Network error: ${error.message || 'Please try again.'}`, 'error'); }
  button.disabled = false;
  const { error } = result;
  if (error) return setMessage($('#request-message'), error.code === '23505' ? 'You already have an open request with this person.' : error.message, 'error');
  closeDialog($('#request-dialog')); showToast('Swap request sent. You’ll see updates in My connections.');
}
function createListCard(title, detail, actions = []) { const item = document.createElement('article'); item.className = 'request-card'; const heading = document.createElement('h4'); heading.textContent = title; const text = document.createElement('p'); text.textContent = detail || ''; item.append(heading, text); const controls = document.createElement('div'); controls.className = 'inline-actions'; actions.forEach(action => { const button = document.createElement('button'); button.type = 'button'; button.className = action.className || 'button button-outline'; button.textContent = action.label; button.addEventListener('click', action.onClick); controls.append(button); }); if (actions.length) item.append(controls); return item; }
function renderNoItems(container, text) { container.replaceChildren(); const empty = document.createElement('p'); empty.className = 'list-empty'; empty.textContent = text; container.append(empty); }
async function loadConnections() {
  if (!client || !currentUser) { renderNoItems($('#incoming-list'), 'Sign in with Supabase to manage real requests.'); renderNoItems($('#outgoing-list'), 'Your sent requests appear here.'); renderNoItems($('#accepted-list'), 'Accepted swaps unlock private chat.'); return; }
  ['incoming-list','outgoing-list','accepted-list'].forEach(id => { const node = $(`#${id}`); node.replaceChildren(); const loading = document.createElement('p'); loading.className = 'list-empty'; loading.textContent = 'Loading…'; node.append(loading); });
  const { data: requests, error } = await client.from('swap_requests').select('*').or(`sender_id.eq.${currentUser.id},recipient_id.eq.${currentUser.id}`).order('created_at', { ascending: false });
  if (error) { ['incoming-list','outgoing-list','accepted-list'].forEach(id => renderNoItems($(`#${id}`), `Could not load requests: ${error.message}`)); return; }
  const ids = [...new Set((requests || []).flatMap(r => [r.sender_id,r.recipient_id]).filter(id => id !== currentUser.id))];
  const { data: people } = ids.length ? await client.from('profiles').select('id,display_name').in('id', ids) : { data: [] };
  const personMap = new Map((people || []).map(person => [person.id, person.display_name]));
  const incoming = (requests || []).filter(r => r.recipient_id === currentUser.id && r.status === 'pending');
  const outgoing = (requests || []).filter(r => r.sender_id === currentUser.id && r.status !== 'accepted' && r.status !== 'closed');
  const accepted = (requests || []).filter(r => r.status === 'accepted');
  const inBox = $('#incoming-list'); inBox.replaceChildren(); incoming.forEach(r => inBox.append(createListCard(personMap.get(r.sender_id) || 'Skill swapper', `${r.proposal}${r.introduction ? ` · ${r.introduction}` : ''}`, [{ label:'Accept', className:'button button-dark small-button', onClick:()=>updateRequest(r.id,'accepted') },{ label:'Decline', onClick:()=>updateRequest(r.id,'declined') },{ label:'Block', className:'quiet-action', onClick:()=>blockProfile({id:r.sender_id,display_name:personMap.get(r.sender_id)||'this person'}) }]))); if (!incoming.length) renderNoItems(inBox, 'No incoming requests right now.');
  const outBox = $('#outgoing-list'); outBox.replaceChildren(); outgoing.forEach(r => outBox.append(createListCard(personMap.get(r.recipient_id) || 'Skill swapper', `${r.status === 'pending' ? 'Waiting for a reply · ' : `${r.status} · `}${r.proposal}`, r.status === 'pending' ? [{ label:'Cancel request', onClick:()=>updateRequest(r.id,'closed') }] : []))); if (!outgoing.length) renderNoItems(outBox, 'You have no pending requests.');
  const acceptedBox = $('#accepted-list'); acceptedBox.replaceChildren(); for (const r of accepted) { const personId = r.sender_id === currentUser.id ? r.recipient_id : r.sender_id; const card = createListCard(personMap.get(personId) || 'Skill swapper', r.proposal, [{ label:'Open chat', className:'button button-dark small-button', onClick:()=>openChat(r, personMap.get(personId) || 'Skill swapper') },{ label:'End swap', onClick:()=>updateRequest(r.id,'closed') },{ label:'Block', className:'quiet-action', onClick:()=>blockProfile({id:personId,display_name:personMap.get(personId)||'this person'}, r.id) }]);
    const unread = await unreadCount(r.id); if (unread) { const badge = document.createElement('span'); badge.className = 'unread-badge'; badge.textContent = `${unread} unread`; card.append(badge); } acceptedBox.append(card); }
  if (!accepted.length) renderNoItems(acceptedBox, 'Accept a request to open a private chat.');
}
async function unreadCount(requestId) {
  const { data: messages } = await client.from('messages').select('id').eq('request_id', requestId).neq('sender_id', currentUser.id);
  if (!messages?.length) return 0;
  const { data: reads } = await client.from('message_reads').select('message_id').eq('user_id', currentUser.id).in('message_id', messages.map(m => m.id));
  const readIds = new Set((reads || []).map(r => r.message_id)); return messages.filter(message => !readIds.has(message.id)).length;
}
async function updateRequest(id, status) {
  const { error } = await client.from('swap_requests').update({ status }).eq('id', id);
  if (error) { showToast(`Couldn't update the request: ${error.message}`); return; }
  showToast(status === 'accepted' ? 'Swap accepted. Your private chat is ready.' : status === 'declined' ? 'Request declined.' : 'Swap request updated.'); await loadConnections(); await loadDirectory();
}
async function blockProfile(profile, closeRequestId = null) {
  if (!client || !currentUser || profile.demo) return;
  const agreed = window.confirm(`Block ${profile.display_name || 'this person'}? They won’t be able to send you new swap requests or messages.`); if (!agreed) return;
  const { error } = await client.from('blocks').insert({ blocker_id: currentUser.id, blocked_id: profile.id });
  if (error && error.code !== '23505') { showToast(`Couldn't block this person: ${error.message}`); return; }
  if (closeRequestId) await client.from('swap_requests').update({ status:'closed' }).eq('id', closeRequestId);
  showToast('This person is blocked.'); await loadConnections(); await loadDirectory();
}

async function openChat(request, displayName) {
  currentChat = request; $('#chat-heading').textContent = `Private chat with ${displayName} · ${request.proposal}`; toggleView('chat'); await loadMessages();
  if (realtimeChannel) await client.removeChannel(realtimeChannel);
  realtimeChannel = client.channel(`chat-${request.id}`).on('postgres_changes', { event:'INSERT', schema:'public', table:'messages', filter:`request_id=eq.${request.id}` }, () => loadMessages()).subscribe();
}
function renderMessages(messages) {
  const box = $('#chat-messages'); box.replaceChildren();
  if (!messages.length) { const empty = document.createElement('p'); empty.className = 'list-empty'; empty.textContent = 'No messages yet. Start with a friendly hello and suggest a time to learn together.'; box.append(empty); return; }
  messages.forEach(message => { const bubble = document.createElement('article'); bubble.className = `message-bubble${message.sender_id === currentUser.id ? ' mine' : ''}`; const body = document.createElement('p'); body.textContent = message.body; const time = document.createElement('time'); time.dateTime = message.created_at; time.textContent = new Date(message.created_at).toLocaleString([], { dateStyle:'medium', timeStyle:'short' }); bubble.append(body, time); box.append(bubble); }); box.scrollTop = box.scrollHeight;
}
async function loadMessages() {
  if (!currentChat || !client) return;
  $('#chat-messages').textContent = 'Loading messages…';
  const { data: messages, error } = await client.from('messages').select('*').eq('request_id', currentChat.id).order('created_at', { ascending:true }).limit(200);
  if (error) { $('#chat-messages').textContent = `Could not load chat: ${error.message}`; return; }
  renderMessages(messages || []);
  const unread = (messages || []).filter(m => m.sender_id !== currentUser.id).map(m => ({ message_id:m.id,user_id:currentUser.id }));
  if (unread.length) await client.from('message_reads').upsert(unread, { onConflict:'message_id,user_id', ignoreDuplicates:true });
}
async function sendMessage(event) {
  event.preventDefault(); if (!currentChat) return;
  const input = $('#chat-input'); const body = input.value.trim(); if (!body || body.length > 2000) return;
  const button = event.currentTarget.querySelector('button'); button.disabled = true;
  let result;
  try { result = await client.from('messages').insert({ request_id:currentChat.id, sender_id:currentUser.id, body }); }
  catch (error) { button.disabled = false; showToast(`Network error: ${error.message || 'Message not sent.'}`); return; }
  const { error } = result; button.disabled = false;
  if (error) { showToast(`Message wasn't sent: ${error.message}`); return; }
  input.value = ''; await loadMessages();
}

async function shareInvite() {
  if (!ownProfile) return;
  const url = new URL(location.href); url.search = ''; url.hash = ''; url.searchParams.set('invite', ownProfile.id);
  try { if (navigator.share) await navigator.share({ title:'Join me on Skill Swap', text:'Let’s trade tech skills and learn together.', url:url.toString() }); else { await navigator.clipboard.writeText(url.toString()); showToast('Invite link copied.'); } }
  catch (error) { if (error.name !== 'AbortError') showToast('Could not share the invite link. Copy the page URL and add your invite code.'); }
}
async function handleInvite() {
  if (!client || !currentUser || !pendingInviteId) return;
  if (pendingInviteId === currentUser.id) { localStorage.removeItem('skillswap-pending-invite'); pendingInviteId = null; return; }
  if (!ownProfile) return;
  const { data: inviter } = await client.from('profiles').select('id,display_name,teach_skills').eq('id', pendingInviteId).eq('is_public', true).maybeSingle();
  if (!inviter) { showToast('The invite profile is unavailable or private.'); localStorage.removeItem('skillswap-pending-invite'); pendingInviteId = null; return; }
  $('#request-person').textContent = `You opened an invite from ${inviter.display_name}. Send a request to start a skill swap.`;
  const form = $('#request-form'); form.reset(); form.elements.recipient_id.value = inviter.id; form.elements.proposal.value = `I joined through your invite. I can teach ${profileSkillText(ownProfile.teach_skills) || 'a tech skill'} and would love to learn ${profileSkillText(inviter.teach_skills) || 'from you'}.`;
  openDialog('request-dialog'); localStorage.removeItem('skillswap-pending-invite'); pendingInviteId = null;
}

async function saveProfile(event) {
  event.preventDefault(); if (!client || !currentUser) return;
  const form = event.currentTarget; const values = new FormData(form); const teach = parseSkills(values.get('teach_skills'), values.get('experience_level')); const learn = parseSkills(values.get('learn_skills'), values.get('experience_level'));
  if (!teach.length || !learn.length) return setMessage($('#profile-message'), 'Add at least one skill you can teach and one you want to learn.', 'error');
  const displayName = safeText(values.get('display_name')); const bio = safeText(values.get('bio'));
  if (!displayName || !bio) return setMessage($('#profile-message'), 'Please add your display name and a short bio.', 'error');
  const payload = { id:currentUser.id, display_name:displayName, location:safeText(values.get('location')) || null, region:safeText(values.get('region')) || null, bio, avatar_url:safeText(values.get('avatar_url')) || null, meetup_preference:values.get('meetup_preference'), teach_skills:teach, learn_skills:learn, learning_goal:values.get('learning_goal'), learning_style:values.get('learning_style'), languages:splitList(values.get('languages')), availability:safeText(values.get('availability')) || null, timezone:safeText(values.get('timezone')) || null, weekly_time:values.get('weekly_time') || null, experience_level:values.get('experience_level'), is_public:values.get('is_public') === 'true', beginner_friendly:values.has('beginner_friendly'), structured_learning:values.has('structured_learning'), pair_programming:values.has('pair_programming') };
  const submit = form.querySelector('[type="submit"]'); submit.disabled = true; setMessage($('#profile-message'), 'Saving profile…');
  let result;
  try { result = await client.from('profiles').upsert(payload, { onConflict:'id' }); }
  catch (error) { submit.disabled = false; return setMessage($('#profile-message'), `Network error: ${error.message || 'Please try again.'}`, 'error'); }
  const { error } = result; submit.disabled = false;
  if (error) return setMessage($('#profile-message'), `Couldn't save your profile: ${error.message}`, 'error');
  await loadOwnProfile(); await loadDirectory(); closeDialog($('#profile-dialog')); renderOwnProfile(); showToast('Profile saved. Your skill swap profile is ready.');
  if (pendingInviteId) await handleInvite();
}
async function deleteAccount() {
  if (!client || !currentUser) return;
  const confirmed = window.confirm('Delete your Skill Swap account and profile? Your sent messages will be removed and your account will be disabled. This cannot be undone.'); if (!confirmed) return;
  const { error } = await client.rpc('delete_my_account');
  if (error) { showToast(`Account deletion failed: ${error.message}`); return; }
  await client.auth.signOut(); ownProfile = null; showToast('Your account was deleted.'); toggleView('explore');
}

function openAuth(mode = 'signin') {
  if (!client) { $('#auth-note').textContent = 'Live accounts are not configured yet. Add your Supabase project URL and public anon key to config.js, then reload. Demo profiles remain browseable.'; }
  setAuthMode(mode); openDialog('auth-dialog');
}
function setAuthMode(mode) {
  authMode = mode; $$('.tab-button').forEach(button => button.classList.toggle('active', button.dataset.authTab === mode));
  const password = $('#password-field'); const submit = $('#auth-submit'); const note = $('#auth-note');
  const emailLabel = $('#auth-form').querySelector('.form-field');
  password.hidden = mode === 'reset'; password.querySelector('input').required = mode !== 'reset';
  password.querySelector('input').autocomplete = mode === 'update' ? 'new-password' : 'current-password';
  password.querySelector('input').placeholder = mode === 'update' ? 'Choose a new password' : 'At least 8 characters';
  emailLabel.hidden = mode === 'update'; emailLabel.querySelector('input').required = mode !== 'update';
  $('.auth-tabs').hidden = mode === 'update';
  submit.innerHTML = mode === 'signin' ? 'Sign in <span aria-hidden="true">↗</span>' : mode === 'signup' ? 'Create account <span aria-hidden="true">↗</span>' : mode === 'reset' ? 'Send reset link <span aria-hidden="true">↗</span>' : 'Update password <span aria-hidden="true">↗</span>';
  if (client) note.textContent = mode === 'signup' ? 'We may email you a confirmation link before sign-in, depending on your Supabase Auth settings.' : mode === 'reset' ? 'We’ll send a password reset link to your email.' : mode === 'update' ? 'Choose a new password for your account.' : 'Your email is private and never shown in the public directory.';
  setMessage($('#auth-message'), '');
}
async function submitAuth(event) {
  event.preventDefault(); if (!client) { setMessage($('#auth-message'), 'Supabase is not configured. Follow the README setup steps to enable accounts and chat.', 'error'); return; }
  const form = event.currentTarget; const email = safeText(form.elements.email.value); const password = form.elements.password.value; const button = $('#auth-submit'); button.disabled = true; setMessage($('#auth-message'), 'Please wait…');
  let result;
  try {
    if (authMode === 'signup') result = await client.auth.signUp({ email,password,options:{ emailRedirectTo:location.href.split('?')[0].split('#')[0] } });
    else if (authMode === 'reset') result = await client.auth.resetPasswordForEmail(email,{ redirectTo:location.href.split('?')[0].split('#')[0] });
    else if (authMode === 'update') result = await client.auth.updateUser({ password });
    else result = await client.auth.signInWithPassword({ email,password });
  } catch (error) { button.disabled = false; return setMessage($('#auth-message'), `Network error: ${error.message || 'Please try again.'}`, 'error'); }
  button.disabled = false;
  if (result.error) return setMessage($('#auth-message'), result.error.message, 'error');
  if (authMode === 'signup' && !result.data.session) { setMessage($('#auth-message'), 'Account created. Check your email to confirm, then sign in.', 'success'); return; }
  if (authMode === 'reset') { setMessage($('#auth-message'), 'Password reset link sent. Check your email.', 'success'); return; }
  if (authMode === 'update') { closeDialog($('#auth-dialog')); showToast('Password updated.'); return; }
  closeDialog($('#auth-dialog')); showToast(authMode === 'signup' ? 'Account created.' : 'Signed in.');
}

const COMMUNITY_NOTES = [
  { id: 'seed-1', name: 'Maya P.', skill: 'React', text: 'Tiny React tip: move repeated UI into a component before it gets hard to change. My form is already much easier to read.', reactions: 12 },
  { id: 'seed-2', name: 'Arjun M.', skill: 'Python', text: 'Today’s win: finally understood why a Python dictionary lookup is usually faster than searching a list. What concept clicked for you this week?', reactions: 8 }
];
async function loadCommunityData() {
  if (!client) return;
  try {
    const [noteResult, ideaResult, practiceResult, reactionResult, voteResult] = await Promise.all([
      client.from('community_notes').select('*').order('created_at',{ascending:false}).limit(30),
      client.from('project_ideas').select('*').order('created_at',{ascending:false}).limit(30),
      currentUser ? client.from('practice_days').select('practice_date').eq('user_id',currentUser.id) : Promise.resolve({data:[],error:null}),
      client.from('community_note_reactions').select('note_id,user_id'),
      client.from('project_idea_votes').select('idea_id,user_id')
    ]);
    const failure=[noteResult,ideaResult,practiceResult,reactionResult,voteResult].find(result=>result.error);
    if(failure) throw failure.error;
    const authorIds=[...new Set([...(noteResult.data||[]).map(row=>row.author_id),...(ideaResult.data||[]).map(row=>row.author_id)])];
    const people=authorIds.length ? await client.from('profiles').select('id,display_name').in('id',authorIds) : {data:[],error:null};
    if(people.error) throw people.error;
    const names=new Map((people.data||[]).map(person=>[person.id,person.display_name]));
    communityData={
      notes:(noteResult.data||[]).map(row=>({id:row.id,name:names.get(row.author_id)||'Skill Swap member',text:row.body,reactions:0,date:new Date(row.created_at).toLocaleDateString(),remote:true,author_id:row.author_id})),
      ideas:(ideaResult.data||[]).map(row=>({id:row.id,title:row.title,description:row.description,looking_for:row.looking_for,author:names.get(row.author_id)||'Skill Swap member',votes:0,remote:true,author_id:row.author_id})),
      practiceDates:(practiceResult.data||[]).map(row=>row.practice_date),
      noteReactions:reactionResult.data||[], ideaVotes:voteResult.data||[]
    };
    renderStreak(); renderNotes(); renderIdeas();
  } catch(error) { showToast(`Community data could not load. ${error.message||'Check the database setup.'}`); }
}
const dayKey = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
function readLocal(key, fallback) { try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; } catch { return fallback; } }
function streakDates() { return client ? communityData.practiceDates : readLocal('skillswap-practice-days', []); }
function streakLength(days) { const set = new Set(days); let cursor = new Date(); if (!set.has(dayKey(cursor))) cursor.setDate(cursor.getDate()-1); let count = 0; while (set.has(dayKey(cursor))) { count++; cursor.setDate(cursor.getDate()-1); } return count; }
function renderStreak() {
  const days = streakDates(); const today = dayKey(); const count = streakLength(days);
  $('#streak-count').textContent = String(count);
  $('#streak-message').textContent = days.includes(today) ? 'Nice work—you showed up today. Keep the rhythm gentle and doable.' : count ? `You’re on a ${count}-day run. A little practice keeps it going.` : 'One small coding session is enough to begin.';
  const week = $('#streak-week'); week.replaceChildren();
  for (let offset = 6; offset >= 0; offset--) { const date = new Date(); date.setDate(date.getDate()-offset); const item = document.createElement('span'); item.className = `streak-day${days.includes(dayKey(date)) ? ' done' : ''}${offset===0 ? ' today' : ''}`; item.textContent = ['S','M','T','W','T','F','S'][date.getDay()]; item.title = `${date.toLocaleDateString(undefined,{weekday:'long'})}${days.includes(dayKey(date)) ? ' · practiced' : ''}`; week.append(item); }
  const button = $('#practice-button'); button.disabled = days.includes(today); button.innerHTML = button.disabled ? 'Practiced today <span aria-hidden="true">✓</span>' : 'I practiced today <span aria-hidden="true">↗</span>';
}
function renderNotes() {
  const notes = [...(client ? communityData.notes : readLocal('skillswap-community-notes', [])), ...COMMUNITY_NOTES]; const feed = $('#notes-feed'); feed.replaceChildren();
  notes.forEach(note => { const card = document.createElement('article'); card.className = 'note-card'; const top = document.createElement('div'); top.className = 'note-author'; const avatar = document.createElement('span'); avatar.className = 'note-avatar'; avatar.textContent = note.name.split(/\s+/).map(part=>part[0]).join('').slice(0,2); const who = document.createElement('div'); const name = document.createElement('strong'); name.textContent = note.name; const tag = document.createElement('small'); tag.textContent = `${note.skill || 'Coding'} · ${note.date || 'Community note'}`; who.append(name,tag); top.append(avatar,who); const body = document.createElement('p'); body.textContent = note.text; const react = document.createElement('button'); const remoteReactions=note.remote?communityData.noteReactions.filter(item=>item.note_id===note.id):[]; note.liked=note.remote?remoteReactions.some(item=>item.user_id===currentUser?.id):note.id.startsWith('seed-')?readLocal('skillswap-note-likes',[]).includes(note.id):Boolean(note.liked); const reactionCount=note.remote?remoteReactions.length:Number(note.reactions||0)+(note.liked&&!note.id.startsWith('seed-')?1:0); react.type = 'button'; react.className = `note-react${note.liked ? ' liked' : ''}`; react.setAttribute('aria-pressed',String(Boolean(note.liked))); react.textContent = `${note.liked ? '♥' : '♡'} Helpful · ${reactionCount}`; react.addEventListener('click',async()=>{ if(client&&note.remote){if(!currentUser)return openAuth();const action=note.liked?client.from('community_note_reactions').delete().eq('note_id',note.id).eq('user_id',currentUser.id):client.from('community_note_reactions').insert({note_id:note.id,user_id:currentUser.id});const result=await action;if(result.error){showToast(result.error.message);return;}await loadCommunityData();return;}if(note.id.startsWith('seed-')){const key='skillswap-note-likes';const likes=readLocal(key,[]);localStorage.setItem(key,JSON.stringify(note.liked?likes.filter(id=>id!==note.id):[...likes,note.id]));}else{const stored=readLocal('skillswap-community-notes',[]);const found=stored.find(item=>item.id===note.id);if(found)found.liked=!found.liked;localStorage.setItem('skillswap-community-notes',JSON.stringify(stored));}renderNotes();});
    if (note.id.startsWith('seed-')) note.liked = readLocal('skillswap-note-likes',[]).includes(note.id);
    card.append(top,body,react); feed.append(card); });
}
const STARTER_IDEAS = [
  { id:'starter-1', title:'A tiny habit tracker for coding practice', description:'Let’s build a calm streak tracker with weekly goals and encouraging reminders. Great for practicing React and a small database.', looking_for:'Frontend partner', author:'Maya P.', votes:7 },
  { id:'starter-2', title:'Beginner-friendly bug bash', description:'A shared space where beginners can post a small bug and pair up to solve it without pressure.', looking_for:'Learning buddy', author:'Arjun M.', votes:5 }
];
function renderIdeas() {
  const ideas=[...(client?communityData.ideas:readLocal('skillswap-ideas',[])),...STARTER_IDEAS]; const voted=readLocal('skillswap-idea-votes',[]); const feed=$('#ideas-feed'); feed.replaceChildren();
  ideas.forEach(idea=>{const card=document.createElement('article');card.className='idea-card';const top=document.createElement('div');top.className='idea-card-top';const title=document.createElement('h3');title.textContent=idea.title;const badge=document.createElement('span');badge.className='idea-badge';badge.textContent=idea.looking_for;top.append(title,badge);const description=document.createElement('p');description.textContent=idea.description;const bottom=document.createElement('div');bottom.className='idea-card-bottom';const author=document.createElement('small');author.textContent=`Shared by ${idea.author||'You'}`;const vote=document.createElement('button');const remoteVotes=idea.remote?communityData.ideaVotes.filter(item=>item.idea_id===idea.id):[];const hasVoted=idea.remote?remoteVotes.some(item=>item.user_id===currentUser?.id):voted.includes(idea.id);const votes=idea.remote?remoteVotes.length:Number(idea.votes||0)+(hasVoted&&!idea.id.startsWith('starter-')?1:0);vote.type='button';vote.className=`idea-vote${hasVoted?' voted':''}`;vote.setAttribute('aria-pressed',String(hasVoted));vote.textContent=`${hasVoted?'♥':'♡'} I’m interested · ${votes}`;vote.addEventListener('click',async()=>{if(client&&idea.remote){if(!currentUser)return openAuth();const action=hasVoted?client.from('project_idea_votes').delete().eq('idea_id',idea.id).eq('user_id',currentUser.id):client.from('project_idea_votes').insert({idea_id:idea.id,user_id:currentUser.id});const result=await action;if(result.error){showToast(result.error.message);return;}await loadCommunityData();return;}const current=readLocal('skillswap-idea-votes',[]);localStorage.setItem('skillswap-idea-votes',JSON.stringify(current.includes(idea.id)?current.filter(id=>id!==idea.id):[...current,idea.id]));renderIdeas();});bottom.append(author,vote);card.append(top,description,bottom);feed.append(card);});
}
function wireCommunity() {
  renderStreak(); renderNotes(); renderIdeas();
  $('#practice-button').addEventListener('click',async()=>{ const today=dayKey(); if(client){if(!currentUser)return openAuth();const result=await client.from('practice_days').insert({user_id:currentUser.id,practice_date:today});if(result.error&&result.error.code!=='23505'){showToast(result.error.message);return;}await loadCommunityData();showToast('Practice logged. Every small step counts.');return;}const days=streakDates();if(!days.includes(today)){days.push(today);localStorage.setItem('skillswap-practice-days',JSON.stringify(days));renderStreak();showToast('Practice logged. Every small step counts.');} });
  $('#note-input').addEventListener('input',event=>$('#note-count').textContent=String(event.target.value.length));
  $('#note-form').addEventListener('submit',async event=>{event.preventDefault();const input=$('#note-input');const text=safeText(input.value);if(!text)return;if(client){if(!currentUser)return openAuth();if(!ownProfile?.is_public){showToast('Make your profile public before sharing community notes.');return;}const result=await client.from('community_notes').insert({author_id:currentUser.id,body:text});if(result.error){showToast(result.error.message);return;}await loadCommunityData();}else{const notes=readLocal('skillswap-community-notes',[]);notes.unshift({id:`note-${Date.now()}`,name:ownProfile?.display_name||'You',skill:'Code note',text,reactions:0,date:'Just now'});localStorage.setItem('skillswap-community-notes',JSON.stringify(notes.slice(0,30)));renderNotes();}input.value='';$('#note-count').textContent='0';showToast(client?'Note shared with the community.':'Your note is on this device.');});
  $('#idea-form').addEventListener('submit',async event=>{event.preventDefault();const form=event.currentTarget;const title=safeText(form.elements.title.value);const description=safeText(form.elements.description.value);if(client){if(!currentUser)return openAuth();if(!ownProfile?.is_public){showToast('Make your profile public before sharing an idea.');return;}const result=await client.from('project_ideas').insert({author_id:currentUser.id,title,description,looking_for:form.elements.looking_for.value});if(result.error){showToast(result.error.message);return;}await loadCommunityData();}else{const ideas=readLocal('skillswap-ideas',[]);ideas.unshift({id:`idea-${Date.now()}`,title,description,looking_for:form.elements.looking_for.value,author:'You',votes:0});localStorage.setItem('skillswap-ideas',JSON.stringify(ideas.slice(0,30)));renderIdeas();}form.reset();showToast(client?'Idea shared with the community.':'Idea shared on this device.');});
}

function wireEvents() {
  $('#auth-button').addEventListener('click', async () => { if (currentUser) { await client.auth.signOut(); showToast('Signed out.'); toggleView('explore'); } else openAuth(); });
  $$('[data-auth-required]').forEach(button => button.addEventListener('click', () => currentUser ? openProfileEditor(!ownProfile) : openAuth()));
  $$('[data-view]').forEach(button => button.addEventListener('click', () => { if (['connections','profile'].includes(button.dataset.view) && !currentUser) { openAuth(); return; } toggleView(button.dataset.view); $('#primary-nav').classList.remove('open'); $('#menu-toggle').setAttribute('aria-expanded','false'); }));
  $$('[data-close-dialog]').forEach(button => button.addEventListener('click', () => closeDialog(button.closest('dialog'))));
  $$('.tab-button').forEach(button => button.addEventListener('click', () => setAuthMode(button.dataset.authTab)));
  $('#auth-form').addEventListener('submit', submitAuth); $('#profile-form').addEventListener('submit', saveProfile); $('#request-form').addEventListener('submit', sendRequest); $('#chat-form').addEventListener('submit', sendMessage);
  $('#back-connections').addEventListener('click', () => toggleView('connections'));
  $('#filter-form').addEventListener('submit', event => event.preventDefault());
  ['#search-input','#learn-filter','#teach-filter','#level-filter','#mode-filter','#goal-filter','#style-filter','#language-filter','#availability-filter','#timezone-filter','#region-filter','#beginner-filter','#structured-filter','#pair-filter','#weekly-filter'].forEach(selector => $(selector).addEventListener(selector === '#search-input' ? 'input' : 'change', () => renderDirectory(directory)));
  $('#clear-filters').addEventListener('click', clearFilters); $('#empty-clear').addEventListener('click', clearFilters);
  $('#menu-toggle').addEventListener('click', event => { const button = event.currentTarget; const open = button.getAttribute('aria-expanded') !== 'true'; button.setAttribute('aria-expanded',String(open)); $('#primary-nav').classList.toggle('open',open); });
  window.addEventListener('offline', () => setBanner('You are offline · live requests and messages need an internet connection.', 'demo'));
  window.addEventListener('online', () => { if (client) { setBanner('Back online · reconnecting to Skill Swap.', 'live'); loadDirectory(); if (currentChat) loadMessages(); } else setBanner(localModeMessage(), 'demo'); });
  document.addEventListener('click', event => { const anchor = event.target.closest('a[href^="#"]'); if (!anchor) return; const targetId = anchor.getAttribute('href').slice(1); if (['explore','community','ideas','how-it-works'].includes(targetId)) toggleView('explore'); });
}

wireEvents();
wireCommunity();
$('#tech-skill-suggestions').replaceChildren(...SKILL_LIST.map(skill => { const option = document.createElement('option'); option.value = skill; return option; }));
if (pendingInviteId) localStorage.setItem('skillswap-pending-invite', pendingInviteId);
if (new URL(location.href).searchParams.has('invite')) { const clean = new URL(location.href); clean.searchParams.delete('invite'); history.replaceState({}, '', clean); }
await setupBackend();
