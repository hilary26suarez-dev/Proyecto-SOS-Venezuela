import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys
const KEYS = {
  inventory: 'fs_inventory',
  hotspots: 'fs_hotspots',
  roomPhotos: 'fs_room_photos',
  photoHotspots: 'fs_photo_hotspots',
  familyMembers: 'fs_family_members',
  emergencyLog: 'fs_emergency_log',
  seeded: 'fs_seeded',
};

// ─── Helpers ────────────────────────────────────────────────────────────────

async function getList(key) {
  const raw = await AsyncStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

async function saveList(key, list) {
  await AsyncStorage.setItem(key, JSON.stringify(list));
}

function nextId(list) {
  return list.length === 0 ? 1 : Math.max(...list.map(i => i.id || 0)) + 1;
}

// ─── Init (replaces getDatabase) ────────────────────────────────────────────

export async function getDatabase() {
  const seeded = await AsyncStorage.getItem(KEYS.seeded);
  if (!seeded) await seedDefaultData();
  return true; // db token (not used but keeps API compatible)
}

async function seedDefaultData() {
  // Hotspots
  const hotspots = [
    { id: 1, room: 'cocina', type: 'gas_valve', label: 'Válvula de Gas LP', description: 'Cierre inmediato en sismos. Girar 90° para cerrar (perpendicular al tubo).', x_ratio: 0.15, y_ratio: 0.8, action_steps: JSON.stringify(['1. Localizar la válvula detrás/debajo de la cocina', '2. Girar la manija 90° hasta quedar perpendicular al tubo', '3. Verificar que no haya olor a gas', '4. NO encender luces ni cerillas hasta verificar']), danger_level: 'high' },
    { id: 2, room: 'utilidad', type: 'water_valve', label: 'Llave de Paso Principal', description: 'Cierre para evitar contaminación y daño estructural por agua.', x_ratio: 0.85, y_ratio: 0.3, action_steps: JSON.stringify(['1. Ubicar en cuarto de pilas o entrada principal', '2. Girar en sentido horario hasta tope', '3. Abrir grifos para liberar presión residual', '4. Marcar con cinta roja si no está identificada']), danger_level: 'high' },
    { id: 3, room: 'sala', type: 'shelter_point', label: 'Punto de Refugio - Concreto', description: 'PISO 1: Agacharse bajo mesa sólida, alejado de ventanas.', x_ratio: 0.5, y_ratio: 0.5, action_steps: JSON.stringify(['1. AGACHARSE al suelo', '2. CUBRIRSE bajo mesa de madera sólida', '3. SUJETARSE a la pata de la mesa', '4. Proteger cabeza y cuello con brazos', '5. Alejarse de ventanas - peligro de vidrios']), danger_level: 'medium' },
    { id: 4, room: 'entrada', type: 'exit_point', label: 'Salida Principal', description: 'Ruta de evacuación hacia punto de encuentro exterior.', x_ratio: 0.1, y_ratio: 0.9, action_steps: JSON.stringify(['1. Caminar rápido, NO correr', '2. No usar ascensores', '3. Alejarse de postes y cables eléctricos', '4. Punto de encuentro: [DEFINIR UBICACIÓN]', '5. NO regresar al edificio hasta autorización']), danger_level: 'low' },
    { id: 5, room: 'salon_segundo', type: 'fibro_danger', label: 'PELIGRO - Zona Fibrolita', description: 'PISO 2: Alejarse de paredes perimetrales. Evacuación inmediata.', x_ratio: 0.7, y_ratio: 0.4, action_steps: JSON.stringify(['¡ALERTA! Las paredes de fibrocemento colapsan explosivamente', '1. NO acercarse a paredes perimetrales', '2. Moverse hacia dintel de puerta estructural', '3. Evacuar hacia escaleras INMEDIATAMENTE', '4. Prioridad: alcanzar primer piso de concreto']), danger_level: 'critical' },
    { id: 6, room: 'exterior', type: 'meeting_point', label: 'Punto de Encuentro Familiar', description: 'Reunión fuera del radio de colapso de la estructura.', x_ratio: 0.5, y_ratio: 0.05, action_steps: JSON.stringify(['Este es el punto de reunión familiar', 'Todos deben llegar aquí tras evacuar', 'Si alguien no llega en 10 minutos: seguir protocolo de búsqueda', 'NO regresar a la casa sin confirmación de seguridad estructural']), danger_level: 'low' },
    { id: 7, room: 'electrico', type: 'breaker', label: 'Tablero Eléctrico Principal', description: 'Cortar energía para prevenir incendios y electrocución.', x_ratio: 0.9, y_ratio: 0.5, action_steps: JSON.stringify(['1. Ubicar el tablero de breakers', '2. Desactivar el breaker principal (más grande)', '3. Si hay humo o chispas: NO tocar', '4. Cortar antes de entrar a zonas inundadas']), danger_level: 'high' },
  ];

  // Inventory
  const inventory = [
    { id: 1, member: 'general', category: 'agua', item: 'Agua embotellada', quantity: 4, unit: 'litros por persona', expiry_date: null, location: 'Mochila principal', notes: 'Mínimo 1 litro/persona/día x 72h', checked: 0 },
    { id: 2, member: 'general', category: 'comida', item: 'Alimentos deshidratados/liofilizados', quantity: 6, unit: 'porciones', expiry_date: null, location: 'Mochila principal', notes: '2000 calorías/día por persona', checked: 0 },
    { id: 3, member: 'general', category: 'comida', item: 'Barras energéticas', quantity: 12, unit: 'unidades', expiry_date: null, location: 'Mochila principal', notes: 'Verificar fecha de vencimiento', checked: 0 },
    { id: 4, member: 'general', category: 'medico', item: 'Torniquete CAT o improvisado', quantity: 2, unit: 'unidades', expiry_date: null, location: 'Bolso médico', notes: 'Acceso rápido - parte externa', checked: 0 },
    { id: 5, member: 'general', category: 'medico', item: 'Gasas estériles 4x4', quantity: 10, unit: 'paquetes', expiry_date: null, location: 'Bolso médico', notes: null, checked: 0 },
    { id: 6, member: 'general', category: 'medico', item: 'Vendas elásticas', quantity: 4, unit: 'rollos', expiry_date: null, location: 'Bolso médico', notes: null, checked: 0 },
    { id: 7, member: 'general', category: 'medico', item: 'Guantes nitrilo', quantity: 4, unit: 'pares', expiry_date: null, location: 'Bolso médico', notes: null, checked: 0 },
    { id: 8, member: 'general', category: 'medico', item: 'Tijeras de trauma', quantity: 1, unit: 'unidad', expiry_date: null, location: 'Bolso médico', notes: 'Para cortar ropa rápido', checked: 0 },
    { id: 9, member: 'general', category: 'medico', item: 'Ibuprofeno / Acetaminofén', quantity: 1, unit: 'caja', expiry_date: null, location: 'Bolso médico', notes: 'Verificar alergias familia', checked: 0 },
    { id: 10, member: 'general', category: 'herramientas', item: 'Radio AM/FM analógico (pilas)', quantity: 1, unit: 'unidad', expiry_date: null, location: 'Mochila principal', notes: 'Con pilas AA extra', checked: 0 },
    { id: 11, member: 'general', category: 'herramientas', item: 'Pilas AA', quantity: 8, unit: 'unidades', expiry_date: null, location: 'Mochila principal', notes: 'Para radio y linterna', checked: 0 },
    { id: 12, member: 'general', category: 'herramientas', item: 'Linterna LED', quantity: 2, unit: 'unidades', expiry_date: null, location: 'Mochila principal', notes: 'Una por adulto', checked: 0 },
    { id: 13, member: 'general', category: 'herramientas', item: 'Silbato supervivencia (sin perlas)', quantity: 4, unit: 'unidades', expiry_date: null, location: 'EDC / persona', notes: 'Uno por miembro familia', checked: 0 },
    { id: 14, member: 'general', category: 'herramientas', item: 'Power Bank 20,000 mAh', quantity: 1, unit: 'unidad', expiry_date: null, location: 'Mochila principal', notes: 'Cargado al 100% siempre', checked: 0 },
    { id: 15, member: 'general', category: 'herramientas', item: 'Panel solar plegable 20W', quantity: 1, unit: 'unidad', expiry_date: null, location: 'Mochila principal', notes: null, checked: 0 },
    { id: 16, member: 'general', category: 'documentos', item: 'Cédulas plastificadas (copias)', quantity: 1, unit: 'set', expiry_date: null, location: 'Bolsa impermeable', notes: 'Incluir tipo de sangre de cada persona', checked: 0 },
    { id: 17, member: 'general', category: 'documentos', item: 'Número emergencias: 9-1-1, Cruz Roja, CNE', quantity: 1, unit: 'hoja', expiry_date: null, location: 'Bolsa impermeable', notes: 'Plastificado', checked: 0 },
    { id: 18, member: 'general', category: 'abrigo', item: 'Mantas térmicas mylar', quantity: 4, unit: 'unidades', expiry_date: null, location: 'Mochila principal', notes: 'Una por persona', checked: 0 },
    { id: 19, member: 'general', category: 'abrigo', item: 'Poncho impermeable', quantity: 4, unit: 'unidades', expiry_date: null, location: 'Mochila principal', notes: null, checked: 0 },
    { id: 20, member: 'general', category: 'desinfeccion', item: 'Botellas PET transparentes 2L', quantity: 4, unit: 'unidades', expiry_date: null, location: 'Mochila principal', notes: 'Para método SODIS', checked: 0 },
  ];

  await saveList(KEYS.hotspots, hotspots);
  await saveList(KEYS.inventory, inventory);
  await saveList(KEYS.roomPhotos, []);
  await saveList(KEYS.photoHotspots, []);
  await saveList(KEYS.familyMembers, [{ id: 1, name: 'Familia Suárez', role: 'Familia', blood_type: 'Verificar' }]);
  await saveList(KEYS.emergencyLog, []);
  await AsyncStorage.setItem(KEYS.seeded, '1');
}

// ─── Inventory ───────────────────────────────────────────────────────────────

export async function getInventory(_db) {
  const list = await getList(KEYS.inventory);
  return list.sort((a, b) => a.category.localeCompare(b.category) || a.item.localeCompare(b.item));
}

export async function updateInventoryCheck(_db, id, checked) {
  const list = await getList(KEYS.inventory);
  const updated = list.map(i => i.id === id ? { ...i, checked: checked ? 1 : 0 } : i);
  await saveList(KEYS.inventory, updated);
}

export async function updateInventoryExpiry(_db, id, date) {
  const list = await getList(KEYS.inventory);
  const updated = list.map(i => i.id === id ? { ...i, expiry_date: date } : i);
  await saveList(KEYS.inventory, updated);
}

// ─── Generic Hotspots (map screen) ──────────────────────────────────────────

export async function getHotspots(_db) {
  const list = await getList(KEYS.hotspots);
  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  return list.sort((a, b) => (order[a.danger_level] ?? 2) - (order[b.danger_level] ?? 2));
}

// ─── Emergency Log ───────────────────────────────────────────────────────────

export async function logEvent(_db, eventType, description, location) {
  const list = await getList(KEYS.emergencyLog);
  list.unshift({ id: nextId(list), event_type: eventType, description, location: location || null, timestamp: new Date().toISOString() });
  await saveList(KEYS.emergencyLog, list.slice(0, 100)); // keep last 100
}

// ─── Room Photos ─────────────────────────────────────────────────────────────

export async function getRoomPhotos(_db) {
  const list = await getList(KEYS.roomPhotos);
  return list.sort((a, b) => (a.floor_level || '').localeCompare(b.floor_level || '') || a.room_name.localeCompare(b.room_name));
}

export async function getRoomPhoto(_db, roomKey) {
  const list = await getList(KEYS.roomPhotos);
  return list.find(r => r.room_key === roomKey) || null;
}

export async function upsertRoomPhoto(_db, roomKey, roomName, photoUri, floorLevel, notes) {
  const list = await getList(KEYS.roomPhotos);
  const idx = list.findIndex(r => r.room_key === roomKey);
  const entry = { room_key: roomKey, room_name: roomName, photo_uri: photoUri, floor_level: floorLevel || 'ground', notes: notes || null, updated_at: new Date().toISOString() };
  if (idx >= 0) { list[idx] = { ...list[idx], ...entry }; }
  else { list.push({ id: nextId(list), ...entry, created_at: new Date().toISOString() }); }
  await saveList(KEYS.roomPhotos, list);
}

export async function saveRoomAssessment(_db, roomKey, assessment) {
  const list = await getList(KEYS.roomPhotos);
  const idx = list.findIndex(r => r.room_key === roomKey);
  if (idx >= 0) {
    list[idx] = { ...list[idx], assessment };
    await saveList(KEYS.roomPhotos, list);
  }
}

export async function deleteRoomPhoto(_db, roomKey) {
  const rooms = await getList(KEYS.roomPhotos);
  await saveList(KEYS.roomPhotos, rooms.filter(r => r.room_key !== roomKey));
  const ph = await getList(KEYS.photoHotspots);
  await saveList(KEYS.photoHotspots, ph.filter(h => h.room_key !== roomKey));
}

// ─── Photo Hotspots ──────────────────────────────────────────────────────────

export async function getPhotoHotspots(_db, roomKey) {
  const list = await getList(KEYS.photoHotspots);
  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  return list.filter(h => h.room_key === roomKey).sort((a, b) => (order[a.danger_level] ?? 2) - (order[b.danger_level] ?? 2));
}

export async function addPhotoHotspot(_db, roomKey, type, label, description, xRatio, yRatio, actionSteps, dangerLevel) {
  const list = await getList(KEYS.photoHotspots);
  list.push({ id: nextId(list), room_key: roomKey, type, label, description: description || null, x_ratio: xRatio, y_ratio: yRatio, action_steps: actionSteps || '[]', danger_level: dangerLevel || 'medium', created_at: new Date().toISOString() });
  await saveList(KEYS.photoHotspots, list);
}

export async function deletePhotoHotspot(_db, id) {
  const list = await getList(KEYS.photoHotspots);
  await saveList(KEYS.photoHotspots, list.filter(h => h.id !== id));
}

export async function updatePhotoHotspot(_db, id, label, description, actionSteps, dangerLevel) {
  const list = await getList(KEYS.photoHotspots);
  const updated = list.map(h => h.id === id ? { ...h, label, description: description || null, action_steps: actionSteps || '[]', danger_level: dangerLevel || 'medium' } : h);
  await saveList(KEYS.photoHotspots, updated);
}
