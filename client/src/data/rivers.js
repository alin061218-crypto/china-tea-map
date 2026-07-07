/**
 * Major river definitions for Tea Atlas ink-wash map.
 *
 * Each river is a polyline of [longitude, latitude] points tracing the main course.
 * Rendered as subtle ink-wash strokes behind province fills.
 */

const RIVERS = [
  {
    id: 'yangtze',
    name: '长江',
    path: [
      [92, 33.5], [95, 32], [98, 30.5], [101, 29],
      [104, 29], [106.5, 30.5], [109, 31],
      [111, 30.5], [113, 30], [114.5, 31],
      [116, 30.5], [117.5, 32], [119, 32],
      [120, 31.5], [121.5, 31.5],
    ],
    width: 2.8,
    color: 'rgba(143, 164, 172, 0.26)',
  },
  {
    id: 'yellow',
    name: '黄河',
    path: [
      [96, 35], [99, 35.5], [102, 36],
      [104, 37], [106, 37.5], [107.5, 38],
      [109, 37.5], [110.5, 37], [111.5, 36],
      [113, 35], [115, 35], [117, 34.5],
      [118.5, 34], [119, 37.5],
    ],
    width: 2.4,
    color: 'rgba(178, 168, 148, 0.22)',
  },
  {
    id: 'pearl',
    name: '珠江',
    path: [
      [104, 24.5], [106, 24], [108, 23.8],
      [109.5, 23.5], [111, 23], [112.5, 22.8],
      [113.5, 22.5], [114, 22.2],
    ],
    width: 2.0,
    color: 'rgba(143, 164, 172, 0.22)',
  },
  {
    id: 'huaihe',
    name: '淮河',
    path: [[113, 32.5], [115, 33], [117, 33.2], [119, 33.5], [120, 33]],
    width: 1.5,
    color: 'rgba(143, 164, 172, 0.18)',
  },
  {
    id: 'songhua',
    name: '松花江',
    path: [[124, 44.5], [126, 45], [128, 46], [130, 47.5], [132, 48], [134, 48]],
    width: 1.6,
    color: 'rgba(143, 164, 172, 0.20)',
  },
];

export default RIVERS;
