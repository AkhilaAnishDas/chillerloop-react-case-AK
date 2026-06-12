export const zones = [
  { id: "NM-01", name: "Vashi CBD", area: "Vashi", lat: 19.0754, lng: 72.9987, flowRate: 142, temp: 6.2, pressure: 4.8, status: "active", heatLoad: 2840, pipeLen: 12.4 },
  { id: "NM-02", name: "Belapur Corporate", area: "CBD Belapur", lat: 19.0224, lng: 73.0395, flowRate: 98, temp: 7.1, pressure: 4.2, status: "active", heatLoad: 2210, pipeLen: 9.8 },
  { id: "NM-03", name: "Airoli Industrial", area: "Airoli", lat: 19.1563, lng: 72.9979, flowRate: 175, temp: 8.4, pressure: 5.1, status: "warning", heatLoad: 3520, pipeLen: 15.6 },
  { id: "NM-04", name: "Nerul IT Park", area: "Nerul", lat: 19.0330, lng: 73.0169, flowRate: 88, temp: 6.8, pressure: 4.0, status: "active", heatLoad: 1980, pipeLen: 8.2 },
  { id: "NM-05", name: "Ghansoli MIDC", area: "Ghansoli", lat: 19.1197, lng: 73.0072, flowRate: 210, temp: 9.2, pressure: 5.8, status: "critical", heatLoad: 4200, pipeLen: 18.9 },
  { id: "NM-06", name: "Koparkhairane Tech", area: "Koparkhairane", lat: 19.1044, lng: 73.0155, flowRate: 120, temp: 7.5, pressure: 4.5, status: "active", heatLoad: 2560, pipeLen: 11.3 },
  { id: "NM-07", name: "Sanpada Residential", area: "Sanpada", lat: 19.0562, lng: 73.0087, flowRate: 65, temp: 6.1, pressure: 3.8, status: "active", heatLoad: 1420, pipeLen: 6.7 },
  { id: "NM-08", name: "Turbhe Warehouse", area: "Turbhe", lat: 19.0870, lng: 73.0151, flowRate: 155, temp: 8.9, pressure: 5.3, status: "warning", heatLoad: 3100, pipeLen: 13.8 },
];

export const chillers = [
  { id: "CH-NM-001", name: "Vashi Primary Chiller", zone: "NM-01", capacity: 1200, currentLoad: 78, status: "active", pressure: 4.8, model: "York YMC2", installed: "2019" },
  { id: "CH-NM-002", name: "Belapur Main Chiller", zone: "NM-02", capacity: 900, currentLoad: 65, status: "active", pressure: 4.2, model: "Carrier 19XR", installed: "2020" },
  { id: "CH-NM-003", name: "Airoli Heavy Chiller", zone: "NM-03", capacity: 1500, currentLoad: 91, status: "warning", pressure: 5.1, model: "Trane CVHF", installed: "2018" },
  { id: "CH-NM-004", name: "Nerul Secondary", zone: "NM-04", capacity: 800, currentLoad: 58, status: "active", pressure: 4.0, model: "York YMC2", installed: "2021" },
  { id: "CH-NM-005", name: "Ghansoli Industrial", zone: "NM-05", capacity: 1800, currentLoad: 96, status: "critical", pressure: 5.8, model: "Carrier 30XA", installed: "2017" },
  { id: "CH-NM-006", name: "Koparkhairane Tech", zone: "NM-06", capacity: 1100, currentLoad: 72, status: "active", pressure: 4.5, model: "Trane CVHF", installed: "2020" },
];

export const pipes = [
  { id: "PL-NM-001", name: "Vashi Main Trunk", from: "NM-01", to: "NM-07", diameter: 600, length: 3.2, material: "DI", status: "active" },
  { id: "PL-NM-002", name: "Belapur-Nerul Loop", from: "NM-02", to: "NM-04", diameter: 500, length: 4.8, material: "HDPE", status: "active" },
  { id: "PL-NM-003", name: "Airoli Industrial Feeder", from: "NM-03", to: "NM-06", diameter: 700, length: 5.1, material: "DI", status: "warning" },
  { id: "PL-NM-004", name: "Ghansoli MIDC Main", from: "NM-05", to: "NM-08", diameter: 800, length: 6.3, material: "Steel", status: "critical" },
  { id: "PL-NM-005", name: "Turbhe Distribution", from: "NM-08", to: "NM-06", diameter: 550, length: 2.9, material: "HDPE", status: "active" },
  { id: "PL-NM-006", name: "Sanpada Branch", from: "NM-07", to: "NM-04", diameter: 400, length: 3.7, material: "DI", status: "active" },
];

export const fans = [
  { id: "FN-NM-001", zone: "NM-01", name: "Vashi Cooling Tower Fan A", power: 185, load: 72, status: "active" },
  { id: "FN-NM-002", zone: "NM-01", name: "Vashi Cooling Tower Fan B", power: 185, load: 68, status: "active" },
  { id: "FN-NM-003", zone: "NM-03", name: "Airoli Industrial Fan", power: 240, load: 89, status: "warning" },
  { id: "FN-NM-004", zone: "NM-05", name: "Ghansoli MIDC Fan A", power: 300, load: 95, status: "critical" },
  { id: "FN-NM-005", zone: "NM-05", name: "Ghansoli MIDC Fan B", power: 300, load: 42, status: "active" },
  { id: "FN-NM-006", zone: "NM-06", name: "Koparkhairane Fan", power: 210, load: 71, status: "active" },
  { id: "FN-NM-007", zone: "NM-08", name: "Turbhe Fan A", power: 220, load: 85, status: "warning" },
  { id: "FN-NM-008", zone: "NM-02", name: "Belapur Fan", power: 195, load: 63, status: "active" },
];

export const restartRequests = [
  { id: "RR-001", zone: "NM-05", customer: "Ghansoli MIDC Authority", priority: "high", time: "14:22", reason: "Complete cooling failure", status: "pending" },
  { id: "RR-002", zone: "NM-03", customer: "Airoli Industrial Estate", priority: "high", time: "14:35", reason: "Pressure drop warning", status: "in-progress" },
  { id: "RR-003", zone: "NM-08", customer: "Turbhe Warehousing Corp", priority: "medium", time: "15:01", reason: "Fan motor trip", status: "pending" },
  { id: "RR-004", zone: "NM-01", customer: "Vashi Business Centre", priority: "medium", time: "15:18", reason: "Scheduled maintenance", status: "pending" },
  { id: "RR-005", zone: "NM-07", customer: "Sanpada Housing Society", priority: "low", time: "15:45", reason: "Mild temperature rise", status: "pending" },
];

export const assetRegistry = new Set([
  "CH-NM-001","CH-NM-002","CH-NM-003","CH-NM-004","CH-NM-005","CH-NM-006",
  "PL-NM-001","PL-NM-002","PL-NM-003","PL-NM-004","PL-NM-005","PL-NM-006",
  "FN-NM-001","FN-NM-002","FN-NM-003","FN-NM-004","FN-NM-005","FN-NM-006","FN-NM-007","FN-NM-008",
  "NM-01","NM-02","NM-03","NM-04","NM-05","NM-06","NM-07","NM-08",
  "PUMP-NM-01","PUMP-NM-02","PUMP-NM-03","PUMP-NM-04",
  "CTRL-NM-01","CTRL-NM-02",
]);

export const graphNodes = [
  { id: "NM-01", label: "Vashi", x: 280, y: 240 },
  { id: "NM-02", label: "Belapur", x: 200, y: 340 },
  { id: "NM-03", label: "Airoli", x: 320, y: 120 },
  { id: "NM-04", label: "Nerul", x: 240, y: 300 },
  { id: "NM-05", label: "Ghansoli", x: 360, y: 140 },
  { id: "NM-06", label: "Koparkh.", x: 340, y: 200 },
  { id: "NM-07", label: "Sanpada", x: 260, y: 260 },
  { id: "NM-08", label: "Turbhe", x: 330, y: 180 },
];

export const graphEdges = [
  { from: "NM-01", to: "NM-07", weight: 2.1, energy: 18 },
  { from: "NM-02", to: "NM-04", weight: 3.5, energy: 28 },
  { from: "NM-03", to: "NM-06", weight: 4.2, energy: 38 },
  { from: "NM-05", to: "NM-08", weight: 5.0, energy: 45 },
  { from: "NM-08", to: "NM-06", weight: 2.4, energy: 22 },
  { from: "NM-07", to: "NM-04", weight: 3.1, energy: 27 },
  { from: "NM-06", to: "NM-01", weight: 2.8, energy: 24 },
  { from: "NM-04", to: "NM-02", weight: 3.5, energy: 28 },
  { from: "NM-01", to: "NM-03", weight: 6.0, energy: 55 },
  { from: "NM-06", to: "NM-08", weight: 2.4, energy: 22 },
];
