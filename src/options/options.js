import { Storage } from '../storage.js';

// State
let groups = [];
let editingGroupId = null;
let editingSpotId = null;
let deleteTarget = null;

// DOM Elements
const groupsContainer = document.getElementById('groups-container');
const addGroupBtn = document.getElementById('add-group-btn');
const exportBtn = document.getElementById('export-btn');
const importBtn = document.getElementById('import-btn');
const importFile = document.getElementById('import-file');
const rotationDelayInput = document.getElementById('rotation-delay');

// Group Modal
const groupModal = document.getElementById('group-modal');
const groupModalTitle = document.getElementById('group-modal-title');
const groupNameInput = document.getElementById('group-name');
const groupSaveBtn = document.getElementById('group-save-btn');
const groupCancelBtn = document.getElementById('group-cancel-btn');

// Spot Modal
const spotModal = document.getElementById('spot-modal');
const spotModalTitle = document.getElementById('spot-modal-title');
const spotNameInput = document.getElementById('spot-name');
const spotUrlInput = document.getElementById('spot-url');
const spotSaveBtn = document.getElementById('spot-save-btn');
const spotCancelBtn = document.getElementById('spot-cancel-btn');

// Delete Modal
const deleteModal = document.getElementById('delete-modal');
const deleteMessage = document.getElementById('delete-message');
const deleteConfirmBtn = document.getElementById('delete-confirm-btn');
const deleteCancelBtn = document.getElementById('delete-cancel-btn');

// Restore Defaults Modal
const restoreDefaultsBtn = document.getElementById('restore-defaults-btn');
const restoreModal = document.getElementById('restore-modal');
const restoreConfirmBtn = document.getElementById('restore-confirm-btn');
const restoreCancelBtn = document.getElementById('restore-cancel-btn');

// Icons
const expandIcon = `<svg class="expand-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>`;
const dragIcon = `<svg class="drag-handle" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="5" cy="4" r="1.5"/><circle cx="11" cy="4" r="1.5"/><circle cx="5" cy="8" r="1.5"/><circle cx="11" cy="8" r="1.5"/><circle cx="5" cy="12" r="1.5"/><circle cx="11" cy="12" r="1.5"/></svg>`;
const editIcon = `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg>`;
const deleteIcon = `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>`;

// Initialize
async function init() {
    await loadData();
    renderGroups();
    setupEventListeners();
}

async function loadData() {
    groups = await Storage.loadGroups();
    const settings = await Storage.loadSettings();
    rotationDelayInput.value = Math.round(settings.rotationDelay / 60000);
}

function renderGroups() {
    if (groups.length === 0) {
        groupsContainer.innerHTML = `
            <div class="empty-state">
                <p>No location groups yet. Add your first group to get started.</p>
            </div>
        `;
        return;
    }

    groupsContainer.innerHTML = groups.map(group => `
        <div class="group-card" data-group-id="${group.id}">
            <div class="group-header">
                ${expandIcon}
                <span class="group-name">${escapeHtml(group.name)}</span>
                <span class="spot-count">${group.spots.length} spot${group.spots.length !== 1 ? 's' : ''}</span>
                <div class="group-actions">
                    <button class="btn btn-icon edit-group-btn" title="Edit group">${editIcon}</button>
                    <button class="btn btn-icon danger delete-group-btn" title="Delete group">${deleteIcon}</button>
                </div>
            </div>
            <div class="group-body">
                <div class="spots-list">
                    ${group.spots.map(spot => `
                        <div class="spot-item" data-spot-id="${spot.id}" draggable="true">
                            ${dragIcon}
                            <div class="spot-info">
                                <div class="spot-name">${escapeHtml(spot.name)}</div>
                                <div class="spot-url">${escapeHtml(spot.url)}</div>
                            </div>
                            <div class="spot-actions">
                                <button class="btn btn-icon edit-spot-btn" title="Edit spot">${editIcon}</button>
                                <button class="btn btn-icon danger delete-spot-btn" title="Delete spot">${deleteIcon}</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button class="add-spot-btn" data-group-id="${group.id}">+ Add Spot</button>
            </div>
        </div>
    `).join('');

    setupDragAndDrop();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function setupEventListeners() {
    // Add Group
    addGroupBtn.addEventListener('click', () => openGroupModal());

    // Export/Import
    exportBtn.addEventListener('click', handleExport);
    importBtn.addEventListener('click', () => importFile.click());
    importFile.addEventListener('change', handleImport);

    // Settings
    rotationDelayInput.addEventListener('change', handleSettingsChange);

    // Group Modal
    groupSaveBtn.addEventListener('click', handleGroupSave);
    groupCancelBtn.addEventListener('click', () => closeModal(groupModal));
    groupModal.querySelector('.close-btn').addEventListener('click', () => closeModal(groupModal));

    // Spot Modal
    spotSaveBtn.addEventListener('click', handleSpotSave);
    spotCancelBtn.addEventListener('click', () => closeModal(spotModal));
    spotModal.querySelector('.close-btn').addEventListener('click', () => closeModal(spotModal));

    // Delete Modal
    deleteConfirmBtn.addEventListener('click', handleDeleteConfirm);
    deleteCancelBtn.addEventListener('click', () => closeModal(deleteModal));
    deleteModal.querySelector('.close-btn').addEventListener('click', () => closeModal(deleteModal));

    // Restore Defaults Modal
    restoreDefaultsBtn.addEventListener('click', () => restoreModal.classList.add('active'));
    restoreConfirmBtn.addEventListener('click', handleRestoreDefaults);
    restoreCancelBtn.addEventListener('click', () => closeModal(restoreModal));
    restoreModal.querySelector('.close-btn').addEventListener('click', () => closeModal(restoreModal));

    // Delegated events for dynamic elements
    groupsContainer.addEventListener('click', handleGroupsContainerClick);

    // Close modals on backdrop click
    [groupModal, spotModal, deleteModal, restoreModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal);
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal(groupModal);
            closeModal(spotModal);
            closeModal(deleteModal);
            closeModal(restoreModal);
        }
    });
}

function handleGroupsContainerClick(e) {
    const target = e.target;
    const groupCard = target.closest('.group-card');
    if (!groupCard) return;

    const groupId = groupCard.dataset.groupId;

    // Toggle collapse
    if (target.closest('.group-header') && !target.closest('button')) {
        groupCard.classList.toggle('collapsed');
        return;
    }

    // Edit group
    if (target.closest('.edit-group-btn')) {
        const group = groups.find(g => g.id === groupId);
        openGroupModal(group);
        return;
    }

    // Delete group
    if (target.closest('.delete-group-btn')) {
        const group = groups.find(g => g.id === groupId);
        openDeleteModal('group', groupId, `Delete "${group.name}" and all its spots?`);
        return;
    }

    // Add spot
    if (target.closest('.add-spot-btn')) {
        openSpotModal(groupId);
        return;
    }

    // Spot actions
    const spotItem = target.closest('.spot-item');
    if (spotItem) {
        const spotId = spotItem.dataset.spotId;

        // Edit spot
        if (target.closest('.edit-spot-btn')) {
            const group = groups.find(g => g.id === groupId);
            const spot = group.spots.find(s => s.id === spotId);
            openSpotModal(groupId, spot);
            return;
        }

        // Delete spot
        if (target.closest('.delete-spot-btn')) {
            const group = groups.find(g => g.id === groupId);
            const spot = group.spots.find(s => s.id === spotId);
            openDeleteModal('spot', { groupId, spotId }, `Delete "${spot.name}"?`);
            return;
        }
    }
}

// Modal functions
function openGroupModal(group = null) {
    editingGroupId = group ? group.id : null;
    groupModalTitle.textContent = group ? 'Edit Group' : 'Add Group';
    groupNameInput.value = group ? group.name : '';
    groupModal.classList.add('active');
    groupNameInput.focus();
}

function openSpotModal(groupId, spot = null) {
    editingGroupId = groupId;
    editingSpotId = spot ? spot.id : null;
    spotModalTitle.textContent = spot ? 'Edit Spot' : 'Add Spot';
    spotNameInput.value = spot ? spot.name : '';
    spotUrlInput.value = spot ? spot.url : '';
    spotModal.classList.add('active');
    spotNameInput.focus();
}

function openDeleteModal(type, target, message) {
    deleteTarget = { type, target };
    deleteMessage.textContent = message;
    deleteModal.classList.add('active');
}

function closeModal(modal) {
    modal.classList.remove('active');
}

// Handler functions
async function handleGroupSave() {
    const name = groupNameInput.value.trim();
    if (!name) return;

    if (editingGroupId) {
        groups = await Storage.updateGroup(editingGroupId, name);
    } else {
        await Storage.addGroup(name);
        groups = await Storage.loadGroups();
    }

    renderGroups();
    closeModal(groupModal);
}

async function handleSpotSave() {
    const name = spotNameInput.value.trim();
    const url = spotUrlInput.value.trim();
    if (!name || !url) return;

    if (editingSpotId) {
        groups = await Storage.updateSpot(editingGroupId, editingSpotId, name, url);
    } else {
        await Storage.addSpot(editingGroupId, name, url);
        groups = await Storage.loadGroups();
    }

    renderGroups();
    closeModal(spotModal);
}

async function handleDeleteConfirm() {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'group') {
        groups = await Storage.deleteGroup(deleteTarget.target);
    } else if (deleteTarget.type === 'spot') {
        const { groupId, spotId } = deleteTarget.target;
        groups = await Storage.deleteSpot(groupId, spotId);
    }

    renderGroups();
    closeModal(deleteModal);
    deleteTarget = null;
}

async function handleSettingsChange() {
    const delayMinutes = parseInt(rotationDelayInput.value, 10);
    if (delayMinutes >= 1 && delayMinutes <= 10) {
        const settings = await Storage.loadSettings();
        settings.rotationDelay = delayMinutes * 60000;
        await Storage.saveSettings(settings);
    }
}

async function handleExport() {
    const json = await Storage.exportConfig();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'surfloop-config.json';
    a.click();
    URL.revokeObjectURL(url);
}

async function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
        try {
            await Storage.importConfig(event.target.result);
            await loadData();
            renderGroups();
        } catch (error) {
            alert('Invalid configuration file');
        }
    };
    reader.readAsText(file);
    importFile.value = '';
}

async function handleRestoreDefaults() {
    await Storage.restoreDefaults();
    await loadData();
    renderGroups();
    closeModal(restoreModal);
}

// Drag and Drop
function setupDragAndDrop() {
    const spotItems = document.querySelectorAll('.spot-item');

    spotItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('dragleave', handleDragLeave);
        item.addEventListener('drop', handleDrop);
    });
}

let draggedItem = null;
let draggedGroupId = null;

function handleDragStart(e) {
    draggedItem = e.target;
    draggedGroupId = e.target.closest('.group-card').dataset.groupId;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    document.querySelectorAll('.spot-item').forEach(item => {
        item.classList.remove('drag-over');
    });
    draggedItem = null;
    draggedGroupId = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const target = e.target.closest('.spot-item');
    if (target && target !== draggedItem) {
        target.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    const target = e.target.closest('.spot-item');
    if (target) {
        target.classList.remove('drag-over');
    }
}

async function handleDrop(e) {
    e.preventDefault();
    const dropTarget = e.target.closest('.spot-item');
    if (!dropTarget || dropTarget === draggedItem) return;

    const toGroupId = dropTarget.closest('.group-card').dataset.groupId;
    const spotId = draggedItem.dataset.spotId;
    const spotsList = dropTarget.closest('.spots-list');
    const spots = Array.from(spotsList.querySelectorAll('.spot-item'));
    const newIndex = spots.indexOf(dropTarget);

    groups = await Storage.moveSpot(draggedGroupId, toGroupId, spotId, newIndex);
    renderGroups();
}

// Start
init();
