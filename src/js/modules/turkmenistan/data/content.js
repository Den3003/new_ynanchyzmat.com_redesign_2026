/**
 * ВЕСЬ ТЕКСТ СЕКЦИИ.
 * Меняете подпись на карте или абзац справа — только здесь, в разметку лезть не нужно.
 * Для мультиязычности продублируйте объект и отдавайте нужный в initTurkmenistanMap().
 */
export const CONTENT = {
  title: 'Turkmenistan',

  /** Текст справа, когда ни один велаят не выбран. */
  intro: [
    'Turkmenistan is divided into five welayats (provinces) — Ahal, Balkan, Daşoguz, Lebap, and Mary — plus the capital city of Ashgabat, which holds province-level status on its own. Roughly 80% of the country is covered by the Karakum Desert, so settlement, agriculture, and industry concentrate in oases, river valleys, and along the Caspian coast.',
    'Pipelines are critical to the safe and efficient transportation of hydrocarbons across upstream, midstream, and downstream operations. Maintaining their integrity requires a comprehensive approach that addresses inspection, maintenance, and operational reliability under varying environmental and operating conditions. From routine assessments to targeted interventions, pipeline services play a key role in minimizing risks associated with corrosion, mechanical damage, and system degradation.',
  ],

  /** Подсказка под картой. */
  hint: 'Select a welayat · scroll to zoom',
  back: 'All welayats',

  /**
   * Велаяты. Ключ обязан совпадать с "id" объекта в welayats.geo.json.
   * labelAt — [долгота, широта] точки, где стоит подпись на карте.
   */
  welayats: {
    balkan: {
      name: 'BALKAN',
      labelAt: [55.36, 39.27],
      text: [
        'Balkan is the western gateway of the country: the Caspian shelf, the port of Turkmenbashi, and the refining cluster around it. Offshore platforms and coastal terminals make it the region with the highest concentration of marine logistics.',
        'Services here focus on corrosion control in a saline atmosphere, subsea line inspection, and turnaround support for refining units.',
      ],
    },
    dashoguz: {
      name: 'DASHOGUZ',
      labelAt: [58.89, 41.12],
      text: [
        'Daşoguz lies in the north, in the lower reaches of the Amu Darya. Irrigated agriculture and gas transmission corridors toward the northern border define the regional infrastructure.',
        'Typical scope: compressor station maintenance, line valve replacement, and integrity assessment of ageing transmission sections.',
      ],
    },
    ahal: {
      name: 'AHAL',
      labelAt: [58.72, 38.87],
      text: [
        'Ahal stretches along the Kopet Dag foothills and carries the capital region. Galkynysh and the gas-to-gasoline complex at Owadandepe put the heaviest processing load of the country in this welayat.',
        'Work here is dominated by rotating equipment overhauls, static equipment inspection, and shutdown planning for processing trains.',
      ],
    },
    lebap: {
      name: 'LEBAP',
      labelAt: [63.3, 38.4],
      text: [
        'Lebap follows the Amu Darya from the southeast to the north, linking the Köýtendag foothills with the eastern export corridor. It is the main transit region for pipelines heading east.',
        'Field activity covers pipeline crossings, cathodic protection surveys, and civil works along the right-of-way.',
      ],
    },
    mary: {
      name: 'MARY',
      labelAt: [62.2, 36.9],
      text: [
        'Mary is the country’s gas heartland: the Galkynysh group, the Mary industrial hub, and a dense network of gathering lines and processing plants around the Murgap oasis.',
        'Services concentrate on wellhead equipment, gas treatment units, and environmental monitoring around production pads.',
      ],
    },
  },

  /** Столица со статусом велаята — отдельная подпись. */
  capital: { name: 'AŞGABAT', labelAt: [58.38, 37.95] },

  projectsTitle: 'Ynach Hyzmat completed projects',
  facilitiesTitle: 'Map legend',

  notes: [
    '* This map does not represent Ynonch Hyzmat’s complete portfolio of projects.',
    '* For detailed information regarding experience, contact us.',
  ],

  /** Сообщение, если WebGL недоступен. */
  fallback: 'Your browser does not support WebGL, so the interactive map is unavailable. The regional breakdown is listed below.',
  /** Сообщение, если карта не смогла загрузиться (данные, сеть, ошибка сборки). */
  error: 'The interactive map could not be loaded. The regional breakdown is listed below.',
};
