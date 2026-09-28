/**
 * ContactHub — a contact manager backed by localStorage.
 *
 * Sections:
 *  1. Initial State
 *  2. Utilities (load/save)   => storage helpers
 *  3. CRUD operations (create, update, delete, find, search)
 *  4. Rendering helpers (avatars, group badges, contact cards)
 *  5. Rendering the page (grid, favorites, emergency, stats)
 *  6. Modal open/close + form handling
 *  7. Field validation
 *  8. Handlers exposed on window (used by inline onclick="")
 *  9. Application Start
 */

// 1. Initial State
var contacts = []; // list of contacts
var currentEditId = null; // null when adding new one
var currentAvatarPath = "";

// 2. Utilities
function generateContactId() {
  return `contact_${new Date().getTime()}_${Math.floor(Math.random() * 1000)}`; // unique id  // timestamp
}

function saveContactsToStorage() {
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

function loadContactsFromStorage() {
  var stored = localStorage.getItem("contacts");
  contacts = stored ? JSON.parse(stored) : [];
}

// 3. CRUD operations
function addContact(data) {
  var newContact = {
    id: generateContactId(),
    name: data.name,
    phone: data.phone,
    email: data.email || "",
    address: data.address || "",
    notes: data.notes || "",
    group: data.group || "",
    avatar: data.avatar || "",
    isFavorite: data.isFavorite || false,
    isEmergency: data.isEmergency || false,
    createdAt: new Date().toISOString(),
  };

  contacts.push(newContact);
  saveContactsToStorage();
  return newContact;
}

function updateContact(id, data) {
  var index = contacts.findIndex(function (contact) {
    return contact.id === id;
  });
  if (index === -1) return null;

  contacts[index].name = data.name;
  contacts[index].phone = data.phone;
  contacts[index].email = data.email || "";
  contacts[index].address = data.address || "";
  contacts[index].notes = data.notes || "";
  contacts[index].group = data.group || "";
  contacts[index].avatar = data.avatar || "";
  contacts[index].isFavorite = data.isFavorite || false;
  contacts[index].isEmergency = data.isEmergency || false;

  saveContactsToStorage();
  return contacts[index];
}

function deleteContact(id) {
  contacts = contacts.filter((contact) => contact.id !== id);
  saveContactsToStorage();
}

function getContactById(id) {
  return contacts.find((contact) => contact.id === id) || null;
}

function searchContacts(query) {
  if (!query) return contacts; // if nothing typed
  var lowerQuery = query.toLowerCase();

  return contacts.filter((contact) => {
    var nameMatches = contact.name.toLowerCase().indexOf(lowerQuery) !== -1;
    var phoneMatches = contact.phone.indexOf(query) !== -1;
    var emailMatches = contact.email.toLowerCase().indexOf(lowerQuery) !== -1;
    return nameMatches || phoneMatches || emailMatches;
  });
}

function getFavoriteContacts() {
  return contacts.filter((contact) => contact.isFavorite);
}

function getEmergencyContacts() {
  return contacts.filter((contact) => contact.isEmergency);
}

// 4. Rendering helpers

// Returns up to 2 uppercase initials from a contact's name (fallback: "?")
function getInitials(fullName) {
  if (!fullName || !fullName.trim()) return "?"; // spaces or empty

  var parts = fullName.trim().split(" ");
  var initials = "";

  if (parts.length >= 2) {
    // if 2 or more than 2 words
    initials =
      parts[0].charAt(0).toUpperCase() +
      parts[parts.length - 1].charAt(0).toUpperCase();
  } else if (parts.length === 1) {
    initials = parts[0].charAt(0).toUpperCase();
  }

  return initials;
}

// Renders either contact's uploaded photo, or colored initials avatar
function renderAvatar(contact, size) {
  var sizeClasses =
    size === "large" ? "w-14 h-14 text-lg" : "w-10 h-10 text-sm";
  var roundedClass = size === "large" ? "rounded-xl" : "rounded-lg";

  if (contact.avatar) {
    return `<img src="${contact.avatar}" alt="${contact.name}" class="${sizeClasses} ${roundedClass} object-cover" />`;
  }

  var initials = getInitials(contact.name);
  var gradientOptions = [
    "from-blue-500 to-blue-600",
    "from-violet-500 to-purple-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-cyan-500 to-blue-600",
    "from-indigo-500 to-violet-600",
    "from-fuchsia-500 to-pink-600",
  ];
  // Pick a gradient deterministically based on name length
  var gradient = gradientOptions[contact.name.length % gradientOptions.length];

  return `<div class="${sizeClasses} ${roundedClass} bg-linear-to-br ${gradient} flex items-center justify-center text-white font-semibold shadow-sm">${initials}</div>`;
}

// Known groups get fixed colors;
// unknown groups get deterministic color based on simple hash of group name,
// so same group always gets same color.  => later feature
function getGroupColorClasses(group) {
  var knownGroupColors = {
    family: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      border: "border-blue-200",
    },
    friends: {
      bg: "bg-green-100",
      text: "text-green-700",
      border: "border-green-200",
    },
    work: {
      bg: "bg-purple-100",
      text: "text-purple-700",
      border: "border-purple-200",
    },
    colleagues: {
      bg: "bg-indigo-100",
      text: "text-indigo-700",
      border: "border-indigo-200",
    },
    business: {
      bg: "bg-slate-100",
      text: "text-slate-700",
      border: "border-slate-200",
    },
    school: {
      bg: "bg-amber-100",
      text: "text-amber-700",
      border: "border-amber-200",
    },
    gym: {
      bg: "bg-orange-100",
      text: "text-orange-700",
      border: "border-orange-200",
    },
    neighbors: {
      bg: "bg-teal-100",
      text: "text-teal-700",
      border: "border-teal-200",
    },
    other: {
      bg: "bg-gray-100",
      text: "text-gray-700",
      border: "border-gray-200",
    },
  };

  var normalizedGroup = group ? group.toLowerCase().trim() : "";
  if (knownGroupColors[normalizedGroup]) {
    return knownGroupColors[normalizedGroup];
  }

  var fallbackColors = [
    { bg: "bg-cyan-100", text: "text-cyan-700", border: "border-cyan-200" },
    { bg: "bg-rose-100", text: "text-rose-700", border: "border-rose-200" },
    { bg: "bg-lime-100", text: "text-lime-700", border: "border-lime-200" },
    {
      bg: "bg-fuchsia-100",
      text: "text-fuchsia-700",
      border: "border-fuchsia-200",
    },
    { bg: "bg-sky-100", text: "text-sky-700", border: "border-sky-200" },
    {
      bg: "bg-violet-100",
      text: "text-violet-700",
      border: "border-violet-200",
    },
  ];

  // later feature
  // Simple string hash (djb2-ish) to pick a stable fallback color
  var hash = 0;
  for (var i = 0; i < normalizedGroup.length; i++) {
    hash = normalizedGroup.charCodeAt(i) + ((hash << 5) - hash);
  }
  var index = Math.abs(hash) % fallbackColors.length;
  return fallbackColors[index];
}

// Builds full HTML for single contact card in main grid
function renderContactCard(contact) {
  var favoriteIcon = contact.isFavorite
    ? '<i class="fa-solid fa-star text-amber-400"></i>'
    : '<i class="fa-regular fa-star"></i>';

  var favoriteButtonClasses = contact.isFavorite
    ? "text-amber-400 bg-amber-50 hover:bg-amber-100"
    : "text-gray-400 bg-gray-50 hover:bg-gray-100 hover:text-amber-400";

  var emergencyIcon = contact.isEmergency
    ? '<i class="fa-solid fa-heart-pulse text-rose-500"></i>'
    : '<i class="fa-regular fa-heart"></i>';

  var emergencyButtonClasses = contact.isEmergency
    ? "text-rose-500 bg-rose-50 hover:bg-rose-100"
    : "text-gray-400 bg-gray-50 hover:bg-gray-100 hover:text-rose-500";

  var emergencyBadge = contact.isEmergency
    ? `<span class="inline-flex items-center gap-1 px-2 py-1 bg-rose-50 text-rose-600 text-[11px] font-medium rounded-md">
        <i class="fa-solid fa-heart-pulse text-[10px]"></i>Emergency
      </span>`
    : "";

  var groupColors = getGroupColorClasses(contact.group);
  var groupBadge = contact.group
    ? `<span class="inline-flex items-center px-2 py-1 ${groupColors.bg} ${groupColors.text} text-[11px] font-medium rounded-md capitalize">${contact.group}</span>`
    : "";

  var avatarHtml = renderAvatar(contact, "large");

  var emergencyCornerBadge = contact.isEmergency
    ? `
    <div class="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center ring-2 ring-white">
      <i class="fa-solid fa-heart-pulse text-white text-[8px]"></i>
    </div>`
    : "";

  var favoriteCornerBadge = contact.isFavorite
    ? `
    <div class="absolute -top-0.5 -right-0.5 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center ring-2 ring-white">
      <i class="fa-solid fa-star text-white text-[8px]"></i>
    </div>`
    : "";

  var emailRow = contact.email
    ? `
    <div class="flex items-center gap-2.5">
      <div class="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
        <i class="fa-solid fa-envelope text-violet-600 text-[10px]"></i>
      </div>
      <span class="text-gray-600 text-sm truncate">${contact.email}</span>
    </div>`
    : "";

  var addressRow = contact.address
    ? `
    <div class="flex items-center gap-2.5">
      <div class="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
        <i class="fa-solid fa-location-dot text-emerald-600 text-[10px]"></i>
      </div>
      <span class="text-gray-600 text-sm truncate">${contact.address}</span>
    </div>`
    : "";

  var badgesRow =
    emergencyBadge || groupBadge
      ? `
    <div class="flex flex-wrap gap-1.5 mt-3">
      ${groupBadge}
      ${emergencyBadge}
    </div>`
      : "";

  var emailButton = contact.email
    ? `
    <button onclick="emailContact('${contact.email}')" class="w-9 h-9 rounded-lg transition-all flex items-center justify-center cursor-pointer text-violet-600 bg-violet-50 hover:bg-violet-100" title="Email">
      <i class="fa-solid fa-envelope text-sm"></i>
    </button>`
    : "";

  return `
    <div class="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-200 overflow-hidden h-full flex flex-col">
      <!-- Header -->
      <div class="p-4 pb-3 flex-1">
        <div class="flex items-start gap-3.5">
          <div class="relative shrink-0">
            ${avatarHtml}
            ${emergencyCornerBadge}
            ${favoriteCornerBadge}
          </div>
          <div class="flex-1 min-w-0 pt-1">
            <h3 class="font-semibold text-gray-900 text-base truncate">${contact.name}</h3>
            <div class="flex items-center gap-2 mt-1">
              <div class="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center shrink-0">
                <i class="fa-solid fa-phone text-blue-600 text-[9px]"></i>
              </div>
              <span class="text-gray-500 text-sm truncate">${contact.phone}</span>
            </div>
          </div>
        </div>

        <!-- Contact Details -->
        <div class="mt-3 space-y-2">
          ${emailRow}
          ${addressRow}
        </div>

        ${badgesRow}
      </div>

      <!-- Actions Footer -->
      <div class="border-t border-gray-100 bg-gray-50/80 px-4 py-2.5 flex items-center justify-between mt-auto">
        <div class="flex items-center gap-1.5">
          <a href="tel:${contact.phone}" class="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-all flex items-center justify-center cursor-pointer" title="Call">
            <i class="fa-solid fa-phone text-sm"></i>
          </a>
          ${emailButton}
        </div>
        <div class="flex items-center gap-1.5">
          <button onclick="toggleFavorite('${contact.id}')" class="w-9 h-9 ${favoriteButtonClasses} rounded-lg transition-all flex items-center justify-center cursor-pointer" title="Favorite">
            ${favoriteIcon}
          </button>
          <button onclick="toggleEmergency('${contact.id}')" class="w-9 h-9 ${emergencyButtonClasses} rounded-lg transition-all flex items-center justify-center cursor-pointer" title="Emergency">
            ${emergencyIcon}
          </button>
          <button onclick="editContactHandler('${contact.id}')" class="w-9 h-9 bg-gray-50 text-gray-500 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center justify-center cursor-pointer" title="Edit">
            <i class="fa-solid fa-pen text-sm"></i>
          </button>
          <button onclick="deleteContactHandler('${contact.id}')" class="w-9 h-9 bg-gray-50 text-gray-500 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-all flex items-center justify-center cursor-pointer" title="Delete">
            <i class="fa-solid fa-trash text-sm"></i>
          </button>
        </div>
      </div>
    </div>`;
}

// 5. Rendering the page

// Renders main contacts grid (or empty state if there are none)
function renderContactsGrid(contactList) {
  var gridSection = document.getElementById("contacts-grid");
  if (!gridSection) return;

  var gridContainer = gridSection.querySelector(".grid");

  if (!contactList || contactList.length === 0) {
    gridContainer.innerHTML = `
    <div class="col-span-full text-center py-20">
      <div class="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
        <i class="fa-solid fa-address-book text-3xl text-gray-300"></i>
      </div>
      <p class="text-gray-500 font-medium">No contacts found</p>
      <p class="text-gray-400 text-sm mt-1">Click "Add Contact" to get started</p>
    </div>`;
    return;
  }

  var html = "";
  for (var i = 0; i < contactList.length; i++) {
    html += renderContactCard(contactList[i]);
  }
  gridContainer.innerHTML = html;
}

// Renders Favorites sidebar (desktop) and Favorites section (mobile)
function renderFavoritesSection() {
  var desktopSection = document.getElementById("favorites-section");
  var mobileSection = document.getElementById("favorites-section-mobile");
  var favorites = getFavoriteContacts();

  var emptyStateHtml = `<div class="col-span-2 text-center py-8">
      <p class="text-gray-400 text-sm">No favorites yet</p>
    </div>`;

  var desktopItemsHtml = "";
  var mobileItemsHtml = "";

  for (var i = 0; i < favorites.length; i++) {
    var contact = favorites[i];
    var avatarHtml = renderAvatar(contact, "small");

    desktopItemsHtml += `
      <div class="flex items-center gap-3 p-2.5 bg-gray-50 hover:bg-amber-50 rounded-xl transition-all cursor-pointer group">
        <div class="shrink-0">${avatarHtml}</div>
        <div class="flex-1 min-w-0">
          <h4 class="font-medium text-gray-900 text-sm truncate">${contact.name}</h4>
          <p class="text-xs text-gray-500 truncate">${contact.phone}</p>
        </div>
        <a href="tel:${contact.phone}" class="shrink-0 w-8 h-8 bg-emerald-100 group-hover:bg-emerald-500 text-emerald-600 group-hover:text-white rounded-lg transition-all flex items-center justify-center cursor-pointer">
          <i class="fa-solid fa-phone text-xs"></i>
        </a>
      </div>`;

    mobileItemsHtml += `
      <a href="tel:${contact.phone}" class="flex items-center gap-2 p-2 bg-white border border-gray-100 hover:border-amber-200 hover:bg-amber-50 rounded-xl transition-all cursor-pointer">
        <div class="w-9 h-9 shrink-0">${avatarHtml}</div>
        <div class="min-w-0 flex-1">
          <h4 class="font-medium text-gray-900 text-[11px] truncate leading-tight">${contact.name}</h4>
          <p class="text-[10px] text-gray-400 truncate">${contact.phone}</p>
        </div>
        <div class="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-md flex items-center justify-center shrink-0">
          <i class="fa-solid fa-phone text-[8px]"></i>
        </div>
      </a>`;
  }

  if (desktopSection) {
    var desktopList = desktopSection.querySelector(".space-y-3");
    if (desktopList) {
      desktopList.innerHTML =
        favorites.length === 0 ? emptyStateHtml : desktopItemsHtml;
    }
  }

  if (mobileSection) {
    var mobileGrid = mobileSection.querySelector(".grid");
    if (mobileGrid) {
      mobileGrid.innerHTML =
        favorites.length === 0 ? emptyStateHtml : mobileItemsHtml;
    }
  }
}

// Renders Emergency sidebar (desktop) and Emergency section (mobile)
function renderEmergencySection() {
  var desktopSection = document.getElementById("emergency-contacts");
  var mobileSection = document.getElementById("emergency-contacts-mobile");
  var emergencyContacts = getEmergencyContacts();

  var emptyStateHtml = `
  <div class="col-span-2 text-center py-8">
    <p class="text-gray-400 text-sm">No emergency contacts</p>
  </div>`;

  var desktopItemsHtml = "";
  var mobileItemsHtml = "";

  for (var i = 0; i < emergencyContacts.length; i++) {
    var contact = emergencyContacts[i];
    var avatarHtml = renderAvatar(contact, "small");

    desktopItemsHtml += `
      <div class="flex items-center gap-3 p-2.5 bg-gray-50 hover:bg-rose-50 rounded-xl transition-all cursor-pointer group">
        <div class="shrink-0">${avatarHtml}</div>
        <div class="flex-1 min-w-0">
          <h4 class="font-medium text-gray-900 text-sm truncate">${contact.name}</h4>
          <p class="text-xs text-gray-500 truncate">${contact.phone}</p>
        </div>
        <a href="tel:${contact.phone}" class="shrink-0 w-8 h-8 bg-rose-100 group-hover:bg-rose-500 text-rose-600 group-hover:text-white rounded-lg transition-all flex items-center justify-center cursor-pointer">
          <i class="fa-solid fa-phone text-xs"></i>
        </a>
      </div>`;

    mobileItemsHtml += `
      <a href="tel:${contact.phone}" class="flex items-center gap-2 p-2 bg-white border border-gray-100 hover:border-rose-200 hover:bg-rose-50 rounded-xl transition-all cursor-pointer">
        <div class="w-9 h-9 shrink-0">${avatarHtml}</div>
        <div class="min-w-0 flex-1">
          <h4 class="font-medium text-gray-900 text-[11px] truncate leading-tight">${contact.name}</h4>
          <p class="text-[10px] text-gray-400 truncate">${contact.phone}</p>
        </div>
        <div class="w-6 h-6 bg-rose-100 text-rose-600 rounded-md flex items-center justify-center shrink-0">
          <i class="fa-solid fa-phone text-[8px]"></i>
        </div>
      </a>`;
  }

  if (desktopSection) {
    var desktopList = desktopSection.querySelector(".space-y-3");
    if (desktopList) {
      desktopList.innerHTML =
        emergencyContacts.length === 0 ? emptyStateHtml : desktopItemsHtml;
    }
  }

  if (mobileSection) {
    var mobileGrid = mobileSection.querySelector(".grid");
    if (mobileGrid) {
      mobileGrid.innerHTML =
        emergencyContacts.length === 0 ? emptyStateHtml : mobileItemsHtml;
    }
  }
}

// Renders stat cards, and updates subtitle under "All Contacts" with current total count
function renderStats() {
  var totalCount = contacts.length;
  var favoritesCount = getFavoriteContacts().length;
  var emergencyCount = getEmergencyContacts().length;

  // Count contacts per group
  var countsByGroup = {};
  for (var i = 0; i < contacts.length; i++) {
    var group = contacts[i].group || "other";
    countsByGroup[group] ? countsByGroup[group]++ : (countsByGroup[group] = 1);
  }

  var statsSection = document.getElementById("quick-stats");
  if (!statsSection) return;

  var statsHtml = `
    <div class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-center gap-3 sm:gap-4">
        <div class="w-11 h-11 sm:w-12 sm:h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
          <i class="fa-solid fa-users text-white text-sm sm:text-base"></i>
        </div>
        <div>
          <p class="text-[11px] sm:text-xs text-gray-500 font-medium uppercase tracking-wide">Total</p>
          <p class="text-xl sm:text-2xl font-bold text-gray-900">${totalCount}</p>
        </div>
      </div>
    </div>
    <div class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-center gap-3 sm:gap-4">
        <div class="w-11 h-11 sm:w-12 sm:h-12 bg-linear-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/25">
          <i class="fa-solid fa-star text-white text-sm sm:text-base"></i>
        </div>
        <div>
          <p class="text-[11px] sm:text-xs text-gray-500 font-medium uppercase tracking-wide">Favorites</p>
          <p class="text-xl sm:text-2xl font-bold text-gray-900">${favoritesCount}</p>
        </div>
      </div>
    </div>
    <div class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-center gap-3 sm:gap-4">
        <div class="w-11 h-11 sm:w-12 sm:h-12 bg-linear-to-br from-rose-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/25">
          <i class="fa-solid fa-heart-pulse text-white text-sm sm:text-base"></i>
        </div>
        <div>
          <p class="text-[11px] sm:text-xs text-gray-500 font-medium uppercase tracking-wide">Emergency</p>
          <p class="text-xl sm:text-2xl font-bold text-gray-900">${emergencyCount}</p>
        </div>
      </div>
    </div>`;

  statsSection.querySelector(".grid").innerHTML = statsHtml;

  var contactsHeader = document.getElementById("contacts-header");
  if (contactsHeader) {
    var subtitle = contactsHeader.querySelector("p");
    if (subtitle) {
      subtitle.textContent =
        "Manage and organize your " + totalCount + " contacts";
    }
  }
}

// Re-renders every dynamic part of the page from current state
function renderAll() {
  renderContactsGrid(contacts);
  renderFavoritesSection();
  renderEmergencySection();
  renderStats();
}

// 6. Modal open/close + form handling
function openAddContactModal() {
  currentEditId = null;
  currentAvatarPath = "";

  document.getElementById("modalTitle").textContent = "Add New Contact";
  document.getElementById("contactForm").reset();

  var avatarPreview = document.getElementById("avatarPreview");
  avatarPreview.innerHTML = '<i class="fa-solid fa-user"></i>';
  avatarPreview.className =
    "w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold";

  document.getElementById("contactModal").classList.remove("hidden");
}

function openEditContactModal(id) {
  currentEditId = id;
  var contact = getContactById(id);
  if (!contact) return;

  document.getElementById("modalTitle").textContent = "Edit Contact";
  document.getElementById("contactId").value = contact.id;
  document.getElementById("contactName").value = contact.name;
  document.getElementById("contactPhone").value = contact.phone;
  document.getElementById("contactEmail").value = contact.email;
  document.getElementById("contactAddress").value = contact.address;
  document.getElementById("contactNotes").value = contact.notes;
  document.getElementById("contactGroup").value = contact.group;
  document.getElementById("contactFavorite").checked = contact.isFavorite;
  document.getElementById("contactEmergency").checked = contact.isEmergency;
  document.getElementById("avatarPath").value = contact.avatar;
  currentAvatarPath = contact.avatar;

  var avatarPreview = document.getElementById("avatarPreview");
  if (currentAvatarPath) {
    avatarPreview.innerHTML = `<img src="${currentAvatarPath}" alt="Avatar" class="w-24 h-24 rounded-full object-cover" />`;
    avatarPreview.className = "w-24 h-24 rounded-full";
  } else {
    var initials = getInitials(contact.name);
    avatarPreview.innerHTML = initials;
    avatarPreview.className =
      "w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold";
  }

  document.getElementById("contactModal").classList.remove("hidden");
}

function closeContactModal() {
  document.getElementById("contactModal").classList.add("hidden");
  document.getElementById("contactForm").reset();
  currentEditId = null;
  currentAvatarPath = "";
}

function handleContactFormSubmit(event) {
  event.preventDefault();

  var name = document.getElementById("contactName").value.trim();
  var phone = document.getElementById("contactPhone").value.trim();
  var email = document.getElementById("contactEmail").value.trim();
  var address = document.getElementById("contactAddress").value.trim();
  var notes = document.getElementById("contactNotes").value.trim();
  var group = document.getElementById("contactGroup").value;
  var isFavorite = document.getElementById("contactFavorite").checked;
  var isEmergency = document.getElementById("contactEmergency").checked;
  var avatar = currentAvatarPath;

  var NAME_PATTERN = /^[a-zA-Z\u0600-\u06FF\s]{2,50}$/; // english, arabic, space
  var EGYPTIAN_PHONE_PATTERN = /^(\+20|0020|20)?0?1[0125][0-9]{8}$/;
  var EMAIL_PATTERN = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

  if (!name) {
    Swal.fire({
      icon: "error",
      title: "Missing Name",
      text: "Please enter a name for the contact!",
    });
    document.getElementById("contactName").focus();
    return;
  }

  if (!NAME_PATTERN.test(name)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Name",
      text: "Name should contain only letters and spaces (2-50 characters)",
    });
    document.getElementById("contactName").focus();
    return;
  }

  if (!phone) {
    Swal.fire({
      icon: "error",
      title: "Missing Phone",
      text: "Please enter a phone number!",
    });
    document.getElementById("contactPhone").focus();
    return;
  }

  if (!EGYPTIAN_PHONE_PATTERN.test(phone)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Phone",
      text: "Please enter a valid Egyptian phone number (e.g., 01012345678 or +201012345678)",
    });
    document.getElementById("contactPhone").focus();
    return;
  }

  // Check for another contact with same phone number (ignoring formatting characters),
  // excluding contact currently being edited
  var duplicate = contacts.find(function (existingContact) {
    var normalizedNewPhone = phone.replace(/[\s\-\(\)\+]/g, "");
    var normalizedExistingPhone = existingContact.phone.replace(
      /[\s\-\(\)\+]/g,
      "",
    );

    if (currentEditId && existingContact.id === currentEditId) return false;
    return normalizedNewPhone === normalizedExistingPhone;
  });

  if (duplicate) {
    Swal.fire({
      icon: "error",
      title: "Duplicate Phone Number",
      text:
        "A contact with this phone number already exists: " + duplicate.name,
    });
    document.getElementById("contactPhone").focus();
    return;
  }

  if (email && !EMAIL_PATTERN.test(email)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Email",
      text: "Please enter a valid email address",
    });
    document.getElementById("contactEmail").focus();
    return;
  }

  var contactData = {
    name: name,
    phone: phone,
    email: email,
    address: address,
    notes: notes,
    group: group,
    avatar: avatar,
    isFavorite: isFavorite,
    isEmergency: isEmergency,
  };

  if (currentEditId) {
    updateContact(currentEditId, contactData);
    Swal.fire({
      icon: "success",
      title: "Updated!",
      text: "Contact has been updated successfully.",
      timer: 1500,
      showConfirmButton: false,
    });
  } else {
    addContact(contactData);
    Swal.fire({
      icon: "success",
      title: "Added!",
      text: "Contact has been added successfully.",
      timer: 1500,
      showConfirmButton: false,
    });
  }

  closeContactModal();
  renderAll();
}

// upload avatar from images folder only
function handleAvatarInputChange(event) {
  var file = event.target.files[0];
  if (!file) return;

  var fileName = file.name;
  currentAvatarPath = `./images/${fileName}`;
  document.getElementById("avatarPath").value = currentAvatarPath;

  var avatarPreview = document.getElementById("avatarPreview");
  avatarPreview.innerHTML = `<img src="${currentAvatarPath}" alt="Avatar" class="w-full h-full rounded-3xl object-cover" onerror="this.parentElement.innerHTML='<i class=&quot;fa-solid fa-user&quot;></i>'" />`;
}

function handleSearchInputChange(event) {
  var query = event.target.value.trim();
  var results = searchContacts(query);
  renderContactsGrid(results);
}

// 7. Field validation (live, as the user types)
function validateNameField() {
  var input = document.getElementById("contactName");
  var errorMessage = document.getElementById("contactNameError");
  var value = input.value.trim();
  var NAME_PATTERN = /^[a-zA-Z\u0600-\u06FF\s]{2,50}$/;

  if (value.length === 0 || NAME_PATTERN.test(value)) {
    errorMessage.classList.add("hidden");
    input.classList.remove("border-red-500");
    input.classList.add("border-gray-300");
  } else {
    errorMessage.classList.remove("hidden");
    input.classList.add("border-red-500");
    input.classList.remove("border-gray-300");
  }
}

function validatePhoneField() {
  var input = document.getElementById("contactPhone");
  var errorMessage = document.getElementById("contactPhoneError");
  var value = input.value.trim();
  var EGYPTIAN_PHONE_PATTERN = /^(\+20|0020|20)?0?1[0125][0-9]{8}$/;

  if (value.length === 0 || EGYPTIAN_PHONE_PATTERN.test(value)) {
    errorMessage.classList.add("hidden");
    input.classList.remove("border-red-500");
    input.classList.add("border-gray-300");
  } else {
    errorMessage.classList.remove("hidden");
    input.classList.add("border-red-500");
    input.classList.remove("border-gray-300");
  }
}

function validateEmailField() {
  var input = document.getElementById("contactEmail");
  var errorMessage = document.getElementById("contactEmailError");
  var value = input.value.trim();
  var EMAIL_PATTERN = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

  if (value.length === 0 || EMAIL_PATTERN.test(value)) {
    errorMessage.classList.add("hidden");
    input.classList.remove("border-red-500");
    input.classList.add("border-gray-300");
  } else {
    errorMessage.classList.remove("hidden");
    input.classList.add("border-red-500");
    input.classList.remove("border-gray-300");
  }
}

// 8. Handlers exposed on window used by inline events
function toggleFavorite(id) {
  var contact = getContactById(id);
  if (contact) {
    contact.isFavorite = !contact.isFavorite;
    saveContactsToStorage();
    renderAll();
  }
}

function toggleEmergency(id) {
  var contact = getContactById(id);
  if (contact) {
    contact.isEmergency = !contact.isEmergency;
    saveContactsToStorage();
    renderAll();
  }
}

function editContactHandler(id) {
  openEditContactModal(id);
}

function deleteContactHandler(id) {
  var contact = getContactById(id);
  if (!contact) return;

  Swal.fire({
    title: "Delete Contact?",
    text: `Are you sure you want to delete ${contact.name}? This action cannot be undone.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  }).then(function (result) {
    if (result.isConfirmed) {
      deleteContact(id);
      renderAll();
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Contact has been deleted.",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  });
}

function callContact(phone) {
  Swal.fire({
    icon: "info",
    title: "Calling...",
    text: `Calling ${phone}`,
    timer: 2000,
    showConfirmButton: false,
  });
}

function emailContact(email) {
  if (!email) {
    Swal.fire({
      icon: "warning",
      title: "No Email",
      text: "This contact does not have an email address.",
    });
    return;
  }
  window.location.href = "mailto:" + email;
}

// 9. Application Start
function initApp() {
  loadContactsFromStorage();
  renderAll();

  document
    .getElementById("addContactBtn")
    .addEventListener("click", openAddContactModal);
  document
    .getElementById("closeModalBtn")
    .addEventListener("click", closeContactModal);
  document
    .getElementById("cancelModalBtn")
    .addEventListener("click", closeContactModal);
  document
    .getElementById("contactForm")
    .addEventListener("submit", handleContactFormSubmit);
  document
    .getElementById("avatarInput")
    .addEventListener("change", handleAvatarInputChange);
  document
    .getElementById("searchInput")
    .addEventListener("input", handleSearchInputChange);
  document
    .getElementById("contactName")
    .addEventListener("input", validateNameField);
  document
    .getElementById("contactPhone")
    .addEventListener("input", validatePhoneField);
  document
    .getElementById("contactEmail")
    .addEventListener("input", validateEmailField);

  // Clicking dark backdrop (not modal card itself) closes the modal
  document
    .getElementById("contactModal")
    .addEventListener("click", function (event) {
      if (event.target.id === "contactModal") closeContactModal();
    });
}

// if script tag is loaded before DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

// Expose handlers used by inline `onclick="..."` attributes in generated HTML
window.toggleFavorite = toggleFavorite;
window.toggleEmergency = toggleEmergency;
window.editContactHandler = editContactHandler;
window.deleteContactHandler = deleteContactHandler;
window.callContact = callContact;
window.emailContact = emailContact;
