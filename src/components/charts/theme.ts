// Shared chart palette (§1.1 categorical set) as concrete hex so Recharts —
// which can't read CSS vars for SVG fills — stays on-brand.
export const CHART = {
  brass: '#B08D57',
  pine: '#3F5A46',
  blue: '#5C7488',
  clay: '#A5695A',
  olive: '#8A8355',
  slate: '#6E6455',
  grid: '#E6DCC7',
  ink: '#2A2620',
  inkMuted: '#6E6455',
  surface: '#FBF8F1',
}

export const CATEGORICAL = [
  CHART.brass,
  CHART.pine,
  CHART.blue,
  CHART.clay,
  CHART.olive,
  CHART.slate,
]
